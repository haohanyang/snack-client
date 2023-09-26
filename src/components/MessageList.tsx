import { IonCard, IonCardContent, IonIcon, IonList, IonSpinner } from "@ionic/react"
import { useGetChannelMessagesQuery } from "../slices/apiSlice"
import { alertCircleOutline } from "ionicons/icons"
import { ChannelInfo } from "../models/channel"

import { AttachmentMessageItem, TextMessageItem } from "./MessageItem"
import { useLayoutEffect, useRef } from "react"

interface MessageListProps {
    userId: string
    channel: ChannelInfo
}

export default function MessageList({ userId, channel }: MessageListProps) {
    const { data: messages = null, isLoading, isError } =
        useGetChannelMessagesQuery(channel)
    const messageListRef = useRef<HTMLIonListElement>(null)

    useLayoutEffect(() => {
        // Scroll to bottom when messages are loaded
        if (messages) {
            const timer = setTimeout(() => {
                messageListRef.current?.lastElementChild?.scrollIntoView({ behavior: "instant" })
            }, 700)
            return () => clearTimeout(timer)
        }
    }, [messages])

    if (isError) {
        return <IonCard color="danger">
            <IonCardContent>
                <p><IonIcon icon={alertCircleOutline} /> Failed to load messages </p>
            </IonCardContent>
        </IonCard>
    } else if (isLoading) {
        return <div className="ion-text-center ion-margin-top">
            <IonSpinner />
        </div>
    } else if (messages) {
        return <IonList ref={messageListRef}>
            {messages.map(message => (
                message.attachment ? <AttachmentMessageItem key={message.id} message={message} userId={userId} />
                    : <TextMessageItem key={message.id} message={message} userId={userId} />
            ))}
        </IonList>
    }

    return <></>
}
