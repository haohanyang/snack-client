import { useState } from "react"
import { IonAvatar, IonItem, IonLabel } from "@ionic/react"
import { GroupChannel, UserChannel } from "../models/channel"
import { UserProfileModal } from "./UserProfile"
import { GroupProfileModal } from "./GroupProfile"

interface GroupChannelStatusProps {
    userId: string
    channel: GroupChannel
}

interface UserChannelStatusProps {
    userId: string
    channel: UserChannel
}

export function GroupChannelStatus({ channel }: GroupChannelStatusProps) {
    const [openGroupProfile, setOpenGroupProfile] = useState(false)
    return <>
        <IonItem lines="none" onClick={() => setOpenGroupProfile(true)} button color="light">
            <IonAvatar slot="start" className="w-14 h-14">
                <img className="h-full w-full" src={channel.avatar} />
            </IonAvatar>
            <IonLabel>
                <h1 className="text-lg font-semibold">{channel.name}</h1>
                <p>{channel!.memberCount} members</p>
            </IonLabel>
        </IonItem>
        <GroupProfileModal group={channel} isOpen={openGroupProfile} close={() => setOpenGroupProfile(false)} />
    </>
}

export function UserChannelStatus({ userId, channel }: UserChannelStatusProps) {
    const [openUserProfile, setOpenUserProfile] = useState(false)
    const contact = channel!.user1.id === userId ? channel!.user2 : channel!.user1
    return <>
        <IonItem lines="none" onClick={() => setOpenUserProfile(true)} detail={false} button color="light">
            <IonAvatar slot="start" className="w-14 h-14">
                <img className="w-full h-full" src={contact.avatar} />
            </IonAvatar>
            <IonLabel>
                <h1 className="text-lg font-semibold">{contact.fullName}</h1>
                <p>Last online 10min ago</p>
            </IonLabel>
        </IonItem>
        <UserProfileModal user={contact} isOpen={openUserProfile} close={() => setOpenUserProfile(false)} />
    </>
}
