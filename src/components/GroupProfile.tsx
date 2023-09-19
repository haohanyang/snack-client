import { IonAvatar, IonBackButton, IonBadge, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonSpinner, IonTitle, IonToolbar } from "@ionic/react"
import { useGetGroupChannelMembersQuery } from "../slices/apiSlice"
import ErrorMessage from "./ErrorMessage"
import Loader from "./Loader"
import { GroupChannel } from "../models/channel"


interface GroupProfileProps {
    group: GroupChannel
}

interface MembersProps {
    id: string
}

function Members({ id }: MembersProps) {
    const { data: memberships, isFetching, isError } = useGetGroupChannelMembersQuery(id)

    if (isError) {
        return <ErrorMessage message="Failed to fetch member information" />
    } else if (isFetching) {
        return <Loader />
    } else {
        return <IonCard className="mt-3">
            <IonCardContent className="ion-no-padding">
                {memberships!.map(membership =>
                    <IonItem key={membership.id} routerLink={`/profile/user/${membership.member.id}`}>
                        <IonAvatar slot="start">
                            <img className="w-10 h-10 rounded-full" src={membership.member.avatar} />
                        </IonAvatar>
                        <IonLabel>
                            <h3 className="font-semibold">{membership.member.fullName}</h3>
                        </IonLabel>
                        {membership.isCreator && <IonBadge color="warning" slot="end">
                            Admin
                        </IonBadge>}
                    </IonItem>)}
            </IonCardContent>
        </IonCard>
    }
}

function GroupProfile({ group }: GroupProfileProps) {
    return <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonBackButton defaultHref="/chats"></IonBackButton>
                </IonButtons>
                <IonTitle>Group Info</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen color="light">
            <IonItem lines="none" color="light">
                <img src={group.avatar} className="w-24 h-24 rounded-full mx-auto mt-6" />
            </IonItem>
            <h1 className="text-center">{group.name}</h1>
            <IonCard>
                <IonCardContent className="p-0">
                    <IonList>
                        <IonItem lines="none">
                            <IonLabel className="ion-text-wrap my-0">
                                <p><small>about</small></p>
                                {group.description}
                            </IonLabel>
                        </IonItem>
                    </IonList>
                </IonCardContent>
            </IonCard>
            <div className="ion-margin-horizontal">
                <h3>Members</h3>
            </div>
            <Members id={group.id.toString()} />
        </IonContent>
    </IonPage >

}

export default GroupProfile