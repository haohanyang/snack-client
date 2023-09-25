import {
    IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonButtons
} from "@ionic/react"

const Home: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Welcome to snack</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonButton routerLink="/login">
                    Login
                </IonButton>
                <IonButton routerLink="/register">
                    Register
                </IonButton>
            </IonContent>
        </IonPage >
    )
}

export default Home
