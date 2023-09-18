import { IonCard, IonCardContent, IonItem, IonThumbnail, IonLabel, IonSpinner } from "@ionic/react"
import { useGetMeQuery } from "../slices/apiSlice"
import ErrorMessage from "./ErrorMessage"

interface UserProfileCardProps {
    userId: string
}
const UserProfileCard = ({ userId }: UserProfileCardProps) => {
    const { data: me, isFetching, isError } = useGetMeQuery()
    return <IonCard>
        <IonCardContent className="ion-no-padding">
            {isError ? <ErrorMessage message="Failed to load user information" /> : (
                isFetching ? <IonSpinner></IonSpinner> : <IonItem lines="none" routerLink="/settings/edit-profile">
                    <IonThumbnail slot="start">
                        <img className="w-14 h-14 rounded-full" src={me!.avatar} />
                    </IonThumbnail>
                    <IonLabel>
                        <h3 className="font-semibold text-lg">{me!.fullName}</h3>
                        <p>{me!.bio}</p>
                    </IonLabel>
                </IonItem>)}
        </IonCardContent>
    </IonCard >
}

export default UserProfileCard
