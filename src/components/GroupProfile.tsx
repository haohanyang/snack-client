import {
    IonAvatar, IonModal, IonBadge, IonButtons, IonCard, IonCardContent, IonPage, IonBackButton,
    IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar, IonButton, useIonRouter
} from "@ionic/react"
import { useGetGroupChannelMembersQuery } from "../slices/apiSlice"
import ErrorMessage from "./ErrorMessage"
import Loader from "./Loader"
import { GroupChannel } from "../models/channel"


interface GroupProfileModalProps {
    group: GroupChannel
    isOpen: boolean
    close: () => void
}

interface GroupProfilePageProps {
    group: GroupChannel
}

interface MembersProps {
    id: string,
    close?: () => void
}

function Members({ id, close }: MembersProps) {
    const { data: memberships, isFetching, isError } = useGetGroupChannelMembersQuery(id)
    const router = useIonRouter()

    if (isError) {
        return <ErrorMessage message="Failed to fetch member information" />
    } else if (isFetching) {
        return <Loader />
    } else {
        return <IonCard className="mt-3" button>
            <IonCardContent className="ion-no-padding">
                {memberships!.map(membership =>
                    <IonItem key={membership.id} onClick={() => {
                        if (close) {
                            close()
                        }
                        router.push(`/profile/user/${membership.member.id}`)
                    }}>
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

export function GroupProfilePage({ group }: GroupProfilePageProps) {
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


export function GroupProfileModal({ group, isOpen, close }: GroupProfileModalProps) {
    return <IonModal isOpen={isOpen} trigger="open-modal">
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonButton onClick={close}>Cancel</IonButton>
                </IonButtons>
                <IonTitle>Welcome</IonTitle>
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
            <Members id={group.id.toString()} close={close} />
        </IonContent>
    </IonModal>
}
