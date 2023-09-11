import {
    IonBackButton, IonButtons, IonCard, IonCardContent, IonContent,
    IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar
} from "@ionic/react"
import User from "../models/user"


interface UserProfileProps {
    user: User
}

function UserProfile({ user }: UserProfileProps) {
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
                            <IonLabel className="my-0">
                                <p><small>username</small></p>
                                {"@" + user.username}
                            </IonLabel>
                        </IonItem>
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

export default UserProfile