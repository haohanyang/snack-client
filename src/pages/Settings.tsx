import { useEffect, useState } from "react"
import {
    IonAlert, IonBackButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonItem,
    IonPage,
    IonSearchbar, IonText, IonTitle, IonToggle, IonToolbar, useIonRouter, useIonToast
} from "@ionic/react"
import { Auth } from "aws-amplify"
import UserProfileCard from "../components/UserProfileCard"
import LoadingPage from "./LoadingPage"
import { Redirect } from "react-router"
import { useAppDispatch } from "../hooks"
import { apiSlice } from "../slices/apiSlice"
import { getMessaging, getToken } from "firebase/messaging"
import { getApiUrl } from "../utils"


interface SettingsProps {
    userId: string | null
    setUserId: (_userId: string) => void
}

export default function Settings({ userId, setUserId }: SettingsProps) {
    const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false)
    const [isSettingNotification, setIsSettingNotification] = useState(false)
    const [notificationOpen, setNotificationOpen] = useState<boolean>(Notification && Notification.permission === "granted")
    const [present] = useIonToast()
    const router = useIonRouter()
    const dispatch = useAppDispatch()

    const toggleNotification = async (checked: boolean) => {
        if (checked) {
            try {
                // Try to turn on notification
                setIsSettingNotification(true)
                const messaging = getMessaging()
                const registration = await navigator.serviceWorker.ready
                const currentToken = await getToken(messaging, {
                    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                    serviceWorkerRegistration: registration,
                })
                if (currentToken) {
                    // Send token to server
                    if (process.env.NODE_ENV === "development") {
                        console.log("current token: ", currentToken)
                    }

                    const jwt = (await Auth.currentSession()).getIdToken().getJwtToken()
                    const response = await fetch(getApiUrl("/users/@me/fcm_tokens")
                        , {
                            method: "POST",
                            body: JSON.stringify({ token: currentToken }),
                            headers: {
                                "Authorization": `Bearer ${jwt}`,
                                "Content-Type": "application/json",
                            },
                        })
                    if (!response.ok) {
                        console.log(await response.json())
                        throw new Error("Failed to send token to server")
                    }
                    setNotificationOpen(true)
                } else {
                    const permission = await Notification.requestPermission()
                    if (permission === "granted") {
                        console.log("Notification permission granted.")
                    }
                }
            } catch (error) {
                present({
                    message: "Failed to enable notification",
                    duration: 3000,
                    color: "danger",
                })
                console.log("error: ", error)
            } finally {
                setIsSettingNotification(false)
            }
        } else {

        }
    }

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
                    <IonItem lines="none">
                        <IonToggle checked={!!notificationOpen} disabled={isSettingNotification}
                            onIonChange={e => toggleNotification(e.target.checked)}>
                            Notification
                        </IonToggle>
                    </IonItem>
                </IonCardContent>
            </IonCard>
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
