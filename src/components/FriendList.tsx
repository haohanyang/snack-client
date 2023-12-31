import { IonAvatar, IonItem, IonLabel, useIonRouter } from "@ionic/react"
import { useGetFriendsQuery, useAddNewUserChannelMutation } from "../slices/apiSlice"
import ErrorMessage from "./ErrorMessage"
import Loader from "./Loader"
import { UserChannelRequest } from "../models/channel"
import User from "../models/user"
import { useIonToast } from "@ionic/react"

interface FriendListProps {
    userId: string
}

function FriendList({ userId }: FriendListProps) {
    const router = useIonRouter()
    const { data: friends, isError, isLoading } = useGetFriendsQuery()
    const [addNewUserChannel, { isLoading: isAdding }] = useAddNewUserChannelMutation()
    const [present] = useIonToast()

    const createChat = async (friend: User) => {
        if (!isAdding) {
            try {
                const reqBody: UserChannelRequest = userId < friend.id ? {
                    user1Id: userId,
                    user2Id: friend.id
                } : { user1Id: friend.id, user2Id: userId }
                const channel = await addNewUserChannel(reqBody).unwrap()
                router.push(`/chats/user/${channel.id}`)
            } catch (error) {
                console.log(error)
                present({
                    message: "Failed to create the chat",
                    color: "danger",
                    duration: 1500,
                    position: "bottom",
                })
            }
        }
    }
    if (isError) {
        return <ErrorMessage message="Failed to load friends information" />
    } else if (isLoading) {
        return <Loader />
    } else if (friends) {
        return <> {friends.map(friend => (
            <IonItem button onClick={() => createChat(friend)} key={friend.id} disabled={isLoading} detail={false}>
                <IonAvatar slot="start" className="w-14 h-14">
                    <img className="h-full w-full" src={friend.avatar} />
                </IonAvatar>
                <IonLabel>
                    <h3 className="font-semibold">{friend.fullName}</h3>
                </IonLabel>
            </IonItem >
        ))
        } </>
    }
    return <></>
}

export default FriendList
