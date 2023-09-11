import {
    IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonLabel, IonList,
    IonListHeader, IonPage, IonSearchbar, IonTitle, IonToolbar
} from "@ionic/react"
import { addOutline } from "ionicons/icons"
import { useState } from "react"
import NewGroupModal from "../components/NewGroupModal"
import GroupList from "../components/GroupList"
import FriendList from "../components/FriendList"
import LoadingPage from "./LoadingPage"
import { Redirect } from "react-router-dom"

interface ContactsProps {
    userId: string | null
}

export default function Contacts({ userId }: ContactsProps) {
    const [newChannelModalOpen, setNewChannelModalOpen] = useState<boolean>(false)

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
                    <IonTitle>Contacts</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Contacts</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonSearchbar placeholder="Search"></IonSearchbar>
                <IonList>
                    <IonListHeader>
                        <IonLabel>Friends</IonLabel>
                        <IonButtons>
                            <IonButton slot="end">
                                <IonIcon slot="icon-only" icon={addOutline}></IonIcon>
                            </IonButton>
                        </IonButtons>
                    </IonListHeader>
                    <FriendList userId={userId} />
                </IonList>
                <IonList>
                    <IonListHeader>
                        <IonLabel>Groups</IonLabel>
                        <IonButtons>
                            <IonButton slot="end" onClick={() => setNewChannelModalOpen(true)}>
                                <IonIcon slot="icon-only" icon={addOutline}></IonIcon>
                            </IonButton>
                        </IonButtons>
                    </IonListHeader>
                    <GroupList />
                </IonList>
                <NewGroupModal userId={userId} isOpen={newChannelModalOpen} closeModal={() => setNewChannelModalOpen(false)} />
            </IonContent>
        </IonPage >
    )
}
