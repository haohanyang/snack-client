import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from "@ionic/react"

interface NewChatModalProps {
    isOpen: boolean
    setModalOpen: (open: boolean) => void
}
export default function NewChatModal(props: NewChatModalProps) {
    return <IonModal isOpen={props.isOpen}>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonButton onClick={() => props.setModalOpen(false)}>Cancel</IonButton>
                </IonButtons>
                {/* <IonTitle>Modal</IonTitle> */}
                <IonButtons slot="end">
                    <IonButton onClick={() => props.setModalOpen(false)}>Save</IonButton>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
        </IonContent>
    </IonModal>
}