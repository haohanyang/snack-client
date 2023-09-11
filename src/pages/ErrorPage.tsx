import { IonContent, IonHeader, IonPage, IonRouterLink } from "@ionic/react"
import ErrorMessage from "../components/ErrorMessage"

const ErrorPage: React.FC = () => <IonPage>
    <IonHeader>
    </IonHeader>
    <IonContent fullscreen className="ion-text-center">
        <div className="mt-48">
            <ErrorMessage message="An error occured" />
            <p>Go back to <IonRouterLink routerLink="/">home page</IonRouterLink> </p>
        </div>
    </IonContent>
</IonPage>

export default ErrorPage
