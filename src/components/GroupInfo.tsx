import {
    IonAvatar, IonBadge, IonButtons, IonCard, IonCardContent, IonPage,
    IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar, IonButton,
    useIonModal
} from "@ionic/react"
import { useGetGroupChannelMembersQuery } from "../slices/apiSlice"
import ErrorMessage from "./ErrorMessage"
import Loader from "./Loader"
import { GroupChannel } from "../models/channel"
import Membership from "../models/membership"
import { UserProfileModal } from "./UserProfile"

interface GroupInfoModalProps {
    group: GroupChannel
    close: () => void
}

interface GroupInfoProps {
    group: GroupChannel
}

interface MembersProps {
    id: string,
}

interface MemberProps {
    membership: Membership
}


function Members({ id }: MembersProps) {
    const { data: memberships, isFetching, isError } = useGetGroupChannelMembersQuery(id)

    if (isError) {
        return <ErrorMessage message="Failed to fetch member information" />
    } else if (isFetching) {
        return <Loader />
    } else {
        return <IonCard className="mt-3" button>
            <IonCardContent className="p-0">
                {memberships!.map(membership => <Member key={membership.member.id} membership={membership} />)}
            </IonCardContent>
        </IonCard>
    }
}

function Member({ membership }: MemberProps) {
    const { member, isCreator } = membership
    const [present, dismiss] = useIonModal(UserProfileModal, {
        close: () => dismiss(),
        user: member
    });

    return <IonItem onClick={() => present()}>
        <IonAvatar slot="start">
            <img className="w-10 h-10 rounded-full" src={member.avatar} />
        </IonAvatar>
        <IonLabel>
            <h3>{member.fullName}</h3>
        </IonLabel>
        {isCreator && <IonBadge color="warning" slot="end">
            Admin
        </IonBadge>}
    </IonItem>

}


export function GroupInfoModal({ group, close }: GroupInfoModalProps) {
    return <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonButton onClick={() => close()}>
                        Cancel
                    </IonButton>
                </IonButtons>
                <IonTitle>Welcome</IonTitle>
            </IonToolbar>
        </IonHeader>
        <GroupInfoContent group={group} />
    </IonPage>
}


const GroupInfoContent = ({ group }: GroupInfoProps) =>
    <IonContent fullscreen color="light">
        <IonItem lines="none" color="light">
            <img src={group.avatar} className="w-24 h-24 rounded-full mx-auto mt-6" />
        </IonItem>
        <h2 className="text-center text-xl">{group.name}</h2>
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
