import { IonAvatar, IonItem, IonLabel, useIonModal } from "@ionic/react"
import { GroupChannel, UserChannel } from "../models/channel"
import { UserProfileModal } from "./UserProfile"
import { GroupInfoModal } from "./GroupInfo"

interface GroupChannelStatusProps {
    userId: string
    channel: GroupChannel
}

interface UserChannelStatusProps {
    userId: string
    channel: UserChannel
}

export function GroupChannelStatus({ channel }: GroupChannelStatusProps) {
    const [present, dismiss] = useIonModal(GroupInfoModal, {
        close: () => dismiss(),
        group: channel
    })
    return <IonItem lines="none" onClick={() => present()} button color="light">
        <IonAvatar slot="start" className="w-14 h-14">
            <img className="h-full w-full" src={channel.avatar} />
        </IonAvatar>
        <IonLabel>
            <h1 className="text-lg font-semibold">{channel.name}</h1>
            <p>{channel!.memberCount} members</p>
        </IonLabel>
    </IonItem>
}

export function UserChannelStatus({ userId, channel }: UserChannelStatusProps) {
    const contact = channel!.user1.id === userId ? channel!.user2 : channel!.user1
    const [present, dismiss] = useIonModal(UserProfileModal, {
        close: () => dismiss(),
        user: contact
    });
    return <IonItem lines="none" onClick={() => present()} detail={false} button color="light">
        <IonAvatar slot="start" className="w-14 h-14">
            <img className="w-full h-full" src={contact.avatar} />
        </IonAvatar>
        <IonLabel>
            <h1 className="text-lg font-semibold">{contact.fullName}</h1>
            <p>Last online 10min ago</p>
        </IonLabel>
    </IonItem>
}
