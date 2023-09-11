import { IonCard, IonCardContent, IonIcon, IonItem, IonList, IonSpinner } from "@ionic/react"
import { useGetChannelMessagesQuery } from "../slices/apiSlice"
import { alertCircleOutline } from "ionicons/icons"
import { ChannelInfo } from "../models/channel"

import { AttachmentMessageItem, TextMessageItem } from "./MessageItem"
import { useEffect, useRef } from "react"

interface MessageListProps {
    userId: string
    channel: ChannelInfo
}

export default function MessageList({ userId, channel }: MessageListProps) {
    const { data: messages = null, isFetching, isError } =
        useGetChannelMessagesQuery(channel)
    const messageListRef = useRef<HTMLIonListElement>(null)
    useEffect(() => {
        if (messages) {
            setTimeout(() => {
                messageListRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" })
            }, 100)
        }
    }, [messages])
    if (isError) {
        return <IonCard color="danger">
            <IonCardContent>
                <p><IonIcon icon={alertCircleOutline} /> Failed to load messages </p>
            </IonCardContent>
        </IonCard>
    } else if (isFetching) {
        return <div className="ion-text-center ion-margin-top">
            <IonSpinner />
        </div>
    } else {
        return <IonList ref={messageListRef}>
            {messages!.map(message => (
                message.attachment ? <AttachmentMessageItem key={message.id} message={message} userId={userId} />
                    : <TextMessageItem key={message.id} message={message} userId={userId} />
            ))}
        </IonList>
    }
}
