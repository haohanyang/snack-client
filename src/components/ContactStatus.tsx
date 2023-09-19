import { IonAvatar, IonItem, IonLabel } from "@ionic/react"
import { GroupChannel, UserChannel } from "../models/channel"

interface GroupChannelStatusProps {
    userId: string
    channel: GroupChannel
}

interface UserChannelStatusProps {
    userId: string
    channel: UserChannel
}

export function GroupChannelStatus({ channel }: GroupChannelStatusProps) {
    return <IonItem lines="none" color="light" routerLink={`/profile/group/${channel.id}`}>
        <IonAvatar slot="start">
            <img className="w-10 h-10 rounded-full" src={channel.avatar} />
        </IonAvatar>
        <IonLabel>
            <h1 className="text-lg font-semibold">{channel.name}</h1>
            <p>{channel!.memberCount} members</p>
        </IonLabel>
    </IonItem>
}

export function UserChannelStatus({ userId, channel }: UserChannelStatusProps) {
    const contact = channel!.user1.id === userId ? channel!.user2 : channel!.user1
    return <IonItem lines="none" color="light" routerLink={`/profile/user/${contact.id}`} detail={false}>
        <IonAvatar slot="start">
            <img src={contact.avatar} />
        </IonAvatar>
        <IonLabel>
            <h1 className="text-lg font-semibold">{contact.fullName}</h1>
            <p>Last online 10min ago</p>
        </IonLabel>
    </IonItem>
}
