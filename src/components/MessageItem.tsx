import { IonAvatar, IonCard, IonCardContent, IonChip, IonItem, IonLabel } from "@ionic/react"
import { Message } from "../models/message"
import moment from "moment"
import { ChannelType } from "../models/channel"

interface MessageItemProps {
    userId: string
    message: Message
}

export function TextMessageItem({ userId, message }: MessageItemProps) {
    return <IonItem key={message.id} lines="none">
        {message.channel.type == ChannelType.GROUP && message.author.id !== userId && <IonAvatar slot="start" className="self-end mr-0">
            <img className="w-10 h-10 rounded-full" src={message.author.avatar} alt="avatar" />
        </IonAvatar>}
        <IonCard color={message.author.id === userId ? "primary" : "light"} button
            className={"inline-block" + (message.author.id === userId ? " ml-auto mr-0" : "")}>
            <IonCardContent className="px-2 py-1">
                {message.author.id !== userId && < p ><strong>{message.author.fullName}</strong> <small> {"@" + message.author.username}</small> </p>}
                <p>{message.content}</p>
                <p><small>{moment(message.createdAt).format("h:mm a")}</small></p>
            </IonCardContent>
        </IonCard>
    </IonItem >
}

export function AttachmentMessageItem({ userId, message }: MessageItemProps) {
    return <IonItem key={message.id} lines="none" href={message.attachment!.url} target="_blank">
        {message.channel.type == ChannelType.GROUP && message.author.id !== userId && <IonAvatar slot="start" className="mr-0 self-end">
            <img className="w-10 h-10 rounded-full" src={message.author.avatar} alt="avatar" />
        </IonAvatar>}
        <IonCard color={message.author.id === userId ? "primary" : "light"} button
            className={"inline-block max-w-sm" + (message.author.id === userId ? " ml-auto mr-0" : "")}>
            <IonCardContent className="px-2 py-1">
                {message.author.id !== userId && < p ><strong>{message.author.fullName}</strong> <small> @{message.author.username}</small> </p>}
                {message.attachment!.contentType.startsWith("image") ? <img src={message.attachment!.url} />
                    : <IonChip>
                        <i className={message.attachment!.contentType == "application/pdf" ? "fa-solid fa-file-pdf" : "fa-solid fa-file-pdf"}></i>
                        <IonLabel>{message.attachment!.filename}</IonLabel>
                    </IonChip>}
                <p>{message.content}</p>
                <p><small>{moment(message.createdAt).format("h:mm a")}</small></p>
            </IonCardContent>
        </IonCard>
    </IonItem >
}
