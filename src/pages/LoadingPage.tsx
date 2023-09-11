import { IonContent, IonPage, IonSpinner } from "@ionic/react"

const LoadingPage: React.FC = () => <IonPage>
    <IonContent fullscreen className="ion-text-center">
        <IonSpinner class="mt-32" />
    </IonContent>
</IonPage>

export default LoadingPage
