import {
    IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonLabel, IonList, RefresherEventDetail,
    IonListHeader, IonPage, IonSearchbar, IonTitle, IonToolbar, IonRefresher, IonRefresherContent
} from "@ionic/react"
import { addOutline } from "ionicons/icons"
import { useRef, useState } from "react"
import NewGroupModal from "../components/NewGroupModal"
import GroupList from "../components/GroupList"
import FriendList from "../components/FriendList"
import LoadingPage from "./LoadingPage"
import { Redirect } from "react-router-dom"
import { useAppDispatch } from "../hooks"
import { apiSlice } from "../slices/apiSlice"
import stomp, { StompWrapper } from "../ws"

interface ContactsProps {
    userId: string | null
}

export default function Contacts({ userId }: ContactsProps) {
    const [newChannelModalOpen, setNewChannelModalOpen] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const ws = useRef<StompWrapper>(stomp)

    const refresh = (event: CustomEvent<RefresherEventDetail>) => {
        dispatch(apiSlice.endpoints.getFriends.initiate(undefined, { forceRefetch: true }))
        dispatch(apiSlice.endpoints.getGroupChannels.initiate(undefined, { forceRefetch: true }))
        if (!ws.current.connected) {
            ws.current.connect()
        }
        event.detail.complete()
    }

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

                <IonRefresher slot="fixed" onIonRefresh={refresh}>
                    <IonRefresherContent refreshingSpinner={null}></IonRefresherContent>
                </IonRefresher>

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
