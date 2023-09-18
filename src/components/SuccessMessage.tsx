import { IonCard, IonCardContent, IonIcon } from "@ionic/react"
import { alertCircleOutline, checkmark } from "ionicons/icons"

interface SuccessMessageProps {
    message: string
}

function SuccessMessage({ message }: SuccessMessageProps) {
    return <IonCard color="success">
        <IonCardContent>
            <p>
                <IonIcon icon={checkmark} className="text-lg -mb-1 mr-1" />{message}
            </p>
        </IonCardContent>
    </IonCard>
}

export default SuccessMessage
