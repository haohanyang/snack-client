import { useState } from "react"
import { IonCard, IonCardContent, IonItem, IonThumbnail, IonLabel, IonSpinner } from "@ionic/react"
import { useGetMeQuery } from "../slices/apiSlice"
import ErrorMessage from "./ErrorMessage"
import EditProfileModal from "../pages/EditProfile"

interface UserProfileCardProps {
    userId: string
}
const UserProfileCard = ({ userId }: UserProfileCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: me, isFetching, isError } = useGetMeQuery()

    return <IonCard>
        <IonCardContent className="px-0 py-2">
            {isError ? <ErrorMessage message="Failed to load user information" /> : (
                isFetching ? <IonSpinner></IonSpinner> :
                    <>
                        <IonItem lines="none" onClick={() => setIsModalOpen(true)} button>
                            <IonThumbnail slot="start">
                                <img className="w-14 h-14 rounded-full" src={me!.avatar} />
                            </IonThumbnail>
                            <IonLabel>
                                <h3 className="font-semibold text-lg">{me!.fullName}</h3>
                                <p>{me!.bio}</p>
                            </IonLabel>
                        </IonItem>
                        <EditProfileModal user={me!} close={() => setIsModalOpen(false)} isOpen={isModalOpen} />
                    </>)}
        </IonCardContent>
    </IonCard >
}

export default UserProfileCard
