import {
    IonButtons, IonCard, IonCardContent, IonContent, IonPage,
    IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar,
    IonButton
} from "@ionic/react"
import User from "../models/user"

interface UserProfileModalProps {
    user: User,
    close: () => void
}

interface UserProfileContentProps {
    user: User
}

export function UserProfileModal({ user, close }: UserProfileModalProps) {
    return <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonButton onClick={() => close()}>
                        Cancel
                    </IonButton>
                </IonButtons>
                <IonTitle>User's profile</IonTitle>
            </IonToolbar>
        </IonHeader>
        <UserProfileContent user={user} />
    </IonPage>
}

const UserProfileContent = ({ user }: UserProfileContentProps) =>
    <IonContent>
        <img className="h-52 w-full object-cover" src={user.backgroundImage}>
        </img>
        <img src={user.avatar} className="w-24 h-24 rounded-full mx-auto -mt-12" />
        <h1 className="text-center text-xl">{user.fullName}</h1>
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
