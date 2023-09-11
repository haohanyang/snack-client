import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonRedirect, IonSearchbar, IonTitle, IonToolbar } from "@ionic/react"
import { ellipsisHorizontal, ellipsisVertical } from "ionicons/icons"
import ChatList from "../components/ChatList"
import LoadingPage from "./LoadingPage"
import { Redirect } from "react-router"
import { useEffect } from "react"

interface ChatsProps {
    userId: string | null
}
export const Chats = ({ userId }: ChatsProps) => {

    if (userId === null) {
        return <LoadingPage />
    }
    if (!userId) {
        return <Redirect to="/" />
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
                <ChatList userId={userId} />
            </IonContent>
        </IonPage>
    )
}


export default Chats
