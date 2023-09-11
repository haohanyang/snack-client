import { IonCard, IonCardContent, IonIcon } from "@ionic/react"
import { alertCircleOutline } from "ionicons/icons"

interface ErrorMessageProps {
    message: string
}

function ErrorMessage({ message }: ErrorMessageProps) {
    return <IonCard color="danger">
        <IonCardContent>
            <p>
                <IonIcon icon={alertCircleOutline} className="text-lg -mb-1 mr-1" />{message}
            </p>
        </IonCardContent>
    </IonCard>
}

export default ErrorMessage
