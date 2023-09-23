import { IonAvatar, IonBadge, IonItem, IonLabel } from "@ionic/react"
import { ChannelType } from "../models/channel"

interface ChatItemProps {
    id: string
    name: string
    type: ChannelType
    message: string
    image: string
    unreadCount: number
}

export default function ChatItem({ id, name, type, message, image, unreadCount }: ChatItemProps) {
    return <IonItem routerLink={type == ChannelType.USER ? `/chats/user/${id}` : `/chats/group/${id}`} detail={false}>
        <IonAvatar slot="start" className="h-14 w-14">
            <img className="h-full w-full" src={image} />
        </IonAvatar>
        <IonLabel>
            <h3 className="font-semibold">{name}</h3>
            <p>{message ? message : <span>&#8203;</span>}</p>
        </IonLabel>
        {unreadCount > 0 && <IonBadge slot="end">{unreadCount}</IonBadge>}
    </IonItem>
}
