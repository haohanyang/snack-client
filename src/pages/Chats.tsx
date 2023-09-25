import { useRef } from "react"
import {
    IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage,
    IonSearchbar, IonTitle, IonToolbar, IonRefresher, IonRefresherContent,
    RefresherEventDetail
} from "@ionic/react"
import { ellipsisHorizontal, ellipsisVertical } from "ionicons/icons"
import ChatList from "../components/ChatList"
import { useAppDispatch } from "../hooks"
import { apiSlice } from "../slices/apiSlice"
import stomp, { StompWrapper } from "../ws"


interface ChatsProps {
    userId: string
}
export const Chats = ({ userId }: ChatsProps) => {
    const dispatch = useAppDispatch()
    const ws = useRef<StompWrapper>(stomp)

    const refresh = async (event: CustomEvent<RefresherEventDetail>) => {
        dispatch(apiSlice.endpoints.getChannels.initiate(undefined, { forceRefetch: true }))
            .then(() => {
                event.detail.complete();
            })
        if (!ws.current.connected) {
            ws.current.connect()
        }
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="secondary">
                        <IonButton>
                            Edit
                        </IonButton>
                    </IonButtons>
                    <IonButtons slot="primary">
                        <IonButton id="open-action-sheet">
                            <IonIcon slot="icon-only" ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>Chats</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Chats</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonSearchbar placeholder="Search"></IonSearchbar>
                <IonRefresher slot="fixed" onIonRefresh={refresh}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <ChatList userId={userId} />
            </IonContent>
        </IonPage >
    )
}


export default Chats
