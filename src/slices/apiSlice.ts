import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { Auth } from "aws-amplify"
import User, { UpdateProfileRequest } from "../models/user"
import { ChannelInfo, ChannelType, Channels, GroupChannel, GroupChannelRequest, UserChannel, UserChannelRequest } from "../models/channel"
import { Message, MessageRequest } from "../models/message"
import Membership from "../models/membership"
import { getApiUrl } from "../utils"
import stomp from '../ws'

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: getApiUrl(""),
        prepareHeaders: async (headers) => {
            const token = (await Auth.currentSession()).getIdToken().getJwtToken()
            if (token) {
                headers.set("Authorization", `Bearer ${token}`)
            }
            return headers
        },
    }),
    tagTypes: ["Me", "Friends", "Chats", "UserProfile", "GroupChannel", "GroupChannels", "UserChannel", "UserChannels", "ChannelMessages", "GroupChannelMembers"],
    endpoints: builder => ({
        getMe: builder.query<User, void>({
            query: () => "users/@me/profile",
            providesTags: ["Me"],
            async onCacheEntryAdded(
                _arg,
                { cacheDataLoaded, cacheEntryRemoved, dispatch }
            ) {
                if (!stomp.connected) {
                    try {
                        const { data: me } = await cacheDataLoaded
                        const jwt = (await Auth.currentSession()).getIdToken().getJwtToken()
                        stomp.setConnectAuth(jwt)

                        stomp.subsribe(`/gateway/${me.id}`, packet => {
                            const message: Message = JSON.parse(packet.body)

                            if (process.env.NODE_ENV === "development") {
                                console.log("Received message: ", message)
                            }

                            // Don't notify if the message is sent by me
                            if (message.author.id === me.id) {
                                return
                            }

                            // Update message list
                            dispatch(apiSlice.util.updateQueryData("getChannelMessages", message.channel, draft => {
                                draft.push(message)
                            }))
                            // Update channel list
                            dispatch(apiSlice.util.updateQueryData("getChannels", undefined, draft => {
                                if (message.channel.type == ChannelType.USER) {
                                    const channel = draft.userChannels.find(channel => channel.id == message.channel.id)
                                    if (channel) {
                                        channel.lastMessage = message
                                        channel.lastUpdated = message.createdAt
                                        channel.unreadMessagesCount += 1
                                    } else {
                                        dispatch(apiSlice.util.updateQueryData("getChannels", undefined, draft => {
                                            const userChannel: UserChannel = {
                                                id: message.channel.id,
                                                user1: message.author.id < me.id ? message.author : me,
                                                user2: message.author.id < me.id ? me : message.author,
                                                lastMessage: message,
                                                lastUpdated: new Date(message.createdAt).toISOString(),
                                                unreadMessagesCount: 1,
                                                type: ChannelType.USER
                                            }
                                            draft.userChannels.push(userChannel)
                                        }))
                                    }
                                } else {
                                    const channel = draft.groupChannels.find(channel => channel.id == message.channel.id)
                                    if (channel) {
                                        channel.lastMessage = message
                                        channel.lastUpdated = message.createdAt
                                        channel.unreadMessagesCount++
                                    } else {
                                        // TODO: get group channel info
                                        dispatch(apiSlice.util.invalidateTags(["Chats"]))
                                    }
                                }
                            }))
                        })
                        stomp.connect()
                    } catch (error) {
                        console.log(error)
                    }
                    await cacheEntryRemoved
                    await stomp.disconnect()
                }
            }
        }),
        updateMe: builder.mutation<User, UpdateProfileRequest>({
            query: (request: UpdateProfileRequest) => ({
                url: "users/@me/profile",
                method: "PATCH",
                body: request,
            }),
            onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
                try {
                    const { data: updatedUser } = await queryFulfilled
                    dispatch(apiSlice.util.updateQueryData("getMe", undefined, draft => {
                        draft.fullName = updatedUser.fullName
                        draft.backgroundImage = updatedUser.backgroundImage
                        draft.avatar = updatedUser.avatar
                        draft.bio = updatedUser.bio
                        draft.status = updatedUser.status
                    }))
                } catch (error) {
                    console.log(error)
                }
            },
        }),
        getUserProfile: builder.query<User, string>({
            query: (userId) => `users/${userId}/profile`,
            providesTags: (_result, _error, arg) => [{ type: "UserProfile", id: arg }]
        }),
        // All friends of the user
        getFriends: builder.query<User[], void>({
            query: () => "users/@me/friends",
            providesTags: ["Friends"]
        }),
        // All channels the user is a member of
        getChannels: builder.query<Channels, void>({
            query: () => "users/@me/channels",
            providesTags: ["Chats"],
        }),
        // Create a new user channel
        addNewUserChannel: builder.mutation<UserChannel, UserChannelRequest>({
            query: (userChannelRequest: UserChannelRequest) => ({
                url: "channels/user",
                method: "POST",
                body: userChannelRequest,
            }),
            invalidatesTags: ["Chats", "UserChannels"]
        }),
        // Get a specific user channel
        getUserChannel: builder.query<UserChannel, string>({
            query: (channelId: string) => `channels/user/${channelId}`,
            providesTags: (_result, _error, arg) => [{ type: "UserChannel", id: arg }]
        }),
        // Get all messages for a specific channel
        getChannelMessages: builder.query<Message[], ChannelInfo>({
            query: ({ id, type }) =>
                type == ChannelType.USER ? `channels/user/${id}/messages` : `channels/group/${id}/messages`,
            providesTags: (_result, _error, arg) =>
                [{ type: "ChannelMessages", id: arg.type == ChannelType.USER ? "u" + arg.id : "g" + arg.id }],
            onCacheEntryAdded: async (arg, { dispatch, cacheDataLoaded }) => {
                // If the channel is a user channel, mark all messages as read
                await cacheDataLoaded
                if (arg.type == ChannelType.USER) {
                    dispatch(apiSlice.util.updateQueryData("getChannels", undefined, draft => {
                        const channel = draft.userChannels.find(channel => channel.id == arg.id)
                        if (channel) {
                            channel.unreadMessagesCount = 0
                        }
                    }))
                } else if (arg.type == ChannelType.GROUP) {
                    dispatch(apiSlice.util.updateQueryData("getChannels", undefined, draft => {
                        const channel = draft.groupChannels.find(channel => channel.id == arg.id)
                        if (channel) {
                            channel.unreadMessagesCount = 0
                        }
                    }))
                }
            },
        }),
        addNewGroupChannel: builder.mutation<GroupChannel, GroupChannelRequest>({
            query: (groupChannelRequest: GroupChannelRequest) => ({
                url: "channels/group",
                method: "POST",
                body: groupChannelRequest,
            }),
            invalidatesTags: ["Chats", "GroupChannels"]
        }),
        // Get all group channels the user is a member of
        getGroupChannels: builder.query<GroupChannel[], void>({
            query: () => "users/@me/channels/group",
            providesTags: ["GroupChannels"]
        }),
        // Get a specific group channel
        getGroupChannel: builder.query<GroupChannel, string>({
            query: (channelId: string) => `channels/group/${channelId}`,
            providesTags: (_result, _error, arg) => [{ type: "GroupChannel", id: arg }]
        }),
        getGroupChannelMembers: builder.query<Membership[], string>({
            query: (channelId: string) => `channels/group/${channelId}/members`,
            providesTags: (_result, _error, arg) => [{ type: "GroupChannelMembers", id: arg }]
        }),
        // Send a message to a channel
        sendChannelMessage: builder.mutation<Message, MessageRequest>({
            query: (messageRequest) => {
                const url = messageRequest.channel.type === ChannelType.USER ? `channels/user/${messageRequest.channel.id}/messages`
                    : `channels/group/${messageRequest.channel.id}/messages`
                return {
                    url: url,
                    method: "POST",
                    body: messageRequest,
                }
            },
            async onQueryStarted(messageRequest, { dispatch, queryFulfilled }) {
                try {
                    const { data: newMessage } = await queryFulfilled
                    dispatch(apiSlice.util.updateQueryData("getChannelMessages",
                        messageRequest.channel, draft => { draft.push(newMessage) }))
                    dispatch(apiSlice.util.updateQueryData("getChannels", undefined, draft => {
                        if (messageRequest.channel.type == ChannelType.USER) {
                            const channel = draft.userChannels.find(channel => channel.id == messageRequest.channel.id)
                            if (channel) {
                                channel.lastMessage = newMessage
                                channel.lastUpdated = newMessage.createdAt
                            } else {
                                dispatch(apiSlice.util.invalidateTags(["Chats"]))
                            }
                        } else {
                            const channel = draft.groupChannels.find(channel => channel.id == messageRequest.channel.id)
                            if (channel) {
                                channel.lastMessage = newMessage
                                channel.lastUpdated = newMessage.createdAt
                            } else {
                                dispatch(apiSlice.util.invalidateTags(["Chats"]))
                            }
                        }
                    }))
                } catch (error) {
                    console.error(error)
                }
            },
        }),
    }),
})

export const {
    useGetMeQuery, useGetUserProfileQuery, useGetChannelsQuery, useUpdateMeMutation,
    useGetUserChannelQuery, useGetGroupChannelQuery, useGetChannelMessagesQuery,
    useGetGroupChannelsQuery, useGetFriendsQuery, useAddNewUserChannelMutation,
    useAddNewGroupChannelMutation, useSendChannelMessageMutation, useGetGroupChannelMembersQuery,
} = apiSlice
