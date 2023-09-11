import { useState } from "react"
import {
    IonAlert, IonBackButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonItem,
    IonPage,
    IonSearchbar, IonText, IonTitle, IonToolbar, useIonRouter
} from "@ionic/react"
import { Auth } from "aws-amplify"
import UserProfileCard from "../components/UserProfileCard"
import LoadingPage from "./LoadingPage"
import { Redirect } from "react-router"
import { useAppDispatch } from "../hooks"
import { apiSlice } from "../slices/apiSlice"

interface SettingsProps {
    userId: string | null
    setUserId: (_userId: string) => void
}

export default function Settings({ userId, setUserId }: SettingsProps) {
    const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false)
    const router = useIonRouter()
    const dispatch = useAppDispatch()

    if (userId === null) {
        return <LoadingPage />
    }

    if (!userId) {
        return <Redirect to="/" />
    }

    return <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonBackButton></IonBackButton>
                </IonButtons>
                <IonTitle>Settings</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen color="light">
            <IonHeader collapse="condense">
                <IonToolbar color="light">
                    <IonTitle size="large">Settings</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonSearchbar placeholder="Search"></IonSearchbar>
            <UserProfileCard userId={userId} />
            <IonCard>
                <IonCardContent className="ion-no-margin">
                    <IonItem button className="ion-text-center" lines="none" onClick={() => setConfirmLogoutOpen(true)}>
                        <IonText color="danger">Log out</IonText>
                    </IonItem>
                    <IonAlert
                        isOpen={confirmLogoutOpen}
                        header="Confirm the logout"
                        message="Do you confirm to log out?"
                        buttons={[
                            {
                                text: "Cancel",
                                role: "cancel",
                                handler: () => {
                                    setConfirmLogoutOpen(false)
                                },
                            },
                            {
                                text: "Yes",
                                role: "confirm",
                                handler: async () => {
                                    Auth.signOut().then(() => {
                                        setUserId("")
                                        router.push("/")
                                        dispatch(apiSlice.util.resetApiState())
                                    })
                                },
                            },
                        ]}
                    ></IonAlert>
                </IonCardContent>
            </IonCard>
        </IonContent>
    </IonPage >
}
