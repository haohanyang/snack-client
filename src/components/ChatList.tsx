import { useMemo } from "react"
import { useGetChannelsQuery } from "../slices/apiSlice"

import { Channel } from "../models/channel"
import ChatItem from "./ChatItem"
import ErrorMessage from "../components/ErrorMessage"
import Loader from "./Loader"

interface ChatListProps {
    userId: string
}

export default function ChatList({ userId }: ChatListProps) {

    const { data: channels = { userChannels: [], groupChannels: [] }, isFetching, isError, error } = useGetChannelsQuery()

    const sortedChannels = useMemo(() => {
        const userChannels: Channel[] = channels.userChannels.map((channel) => {
            const contact = channel.user1.id == userId ? channel.user2 : channel.user1
            console.log(channel.unreadMessagesCount)
            return {
                id: channel.id,
                type: channel.type,
                lastUpdated: channel.lastUpdated,
                lastMessage: channel.lastMessage,
                name: contact.fullName,
                unreadMessagesCount: channel.unreadMessagesCount,
                image: contact.avatar
            }
        })

        const groupChannels: Channel[] = channels.groupChannels.map((channel) => (
            {
                id: channel.id,
                type: channel.type,
                lastUpdated: channel.lastUpdated,
                lastMessage: channel.lastMessage,
                name: channel.name,
                unreadMessagesCount: channel.unreadMessagesCount,
                image: channel.avatar
            }))

        const allChannels = [...userChannels, ...groupChannels]
        const sortedChannels = allChannels.slice()
        sortedChannels.sort((a, b) => {
            return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        })

        return sortedChannels
    }, [channels])

    if (isError) {
        return <ErrorMessage message="Failed to load" />
    } else if (isFetching) {
        return <Loader />
    } else {
        return <>
            {sortedChannels.map((channel) => {
                return <ChatItem
                    id={channel.id.toString()}
                    type={channel.type}
                    name={channel.name}
                    key={"u" + channel.id}
                    image={channel.image}
                    unreadCount={channel.unreadMessagesCount}
                    message={channel.lastMessage ? channel.lastMessage.content : ""}
                />
            })}
        </>
    }
}
