import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react"
import { Link } from "react-router-dom"

const NotFound: React.FC = () => {
    return <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonBackButton></IonBackButton>
                </IonButtons>
                <IonTitle>Not found</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <p>The page is not found. Go back to the <Link to="/">Home Page</Link></p>
        </IonContent>
    </IonPage >
}

export default NotFound