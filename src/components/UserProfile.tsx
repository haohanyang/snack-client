import {
    IonButtons, IonCard, IonCardContent, IonContent, IonPage,
    IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar,
    IonModal, IonButton, IonBackButton
} from "@ionic/react"
import User from "../models/user"

interface UserProfileModalProps {
    user: User,
    isOpen: boolean,
    close: () => void
}

interface UserProfilePageProps {
    user: User
}

export function UserProfilePage({ user }: UserProfilePageProps) {
    return <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonBackButton defaultHref="/chats"></IonBackButton>
                </IonButtons>
                <IonTitle>User info</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen color="light">
            <div className={`h-52 bg-[url(${user.backgroundImage})]`}>
            </div>
            <img src={user.avatar} className="w-24 h-24 rounded-full mx-auto -mt-12" />
            <h1 className="text-center">{user.fullName}</h1>
            <IonCard>
                <IonCardContent className="p-0">
                    <IonList>
                        <IonItem lines="none">
                            <IonLabel className="ion-text-wrap my-0">
                                <p><small>bio</small></p>
                                {user.bio}
                            </IonLabel>
                        </IonItem>
                    </IonList>
                </IonCardContent>
            </IonCard>
        </IonContent>
    </IonPage >
}

export function UserProfileModal({ user, isOpen, close }: UserProfileModalProps) {
    return <IonModal isOpen={isOpen} trigger="open-modal">
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonButton onClick={close}>Cancel</IonButton>
                </IonButtons>
                <IonTitle>{user.fullName}'s info</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent>
            <div className={`h-52 bg-[url(${user.backgroundImage})]`}>
            </div>
            <img src={user.avatar} className="w-24 h-24 rounded-full mx-auto -mt-12" />
            <h1 className="text-center">{user.fullName}</h1>
            <IonCard>
                <IonCardContent className="p-0">
                    <IonList>
                        <IonItem lines="none">
                            <IonLabel className="ion-text-wrap my-0">
                                <p><small>bio</small></p>
                                {user.bio}
                            </IonLabel>
                        </IonItem>
                    </IonList>
                </IonCardContent>
            </IonCard>
        </IonContent>
    </IonModal>
}
