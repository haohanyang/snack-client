import { IonAvatar, IonItem, IonLabel } from "@ionic/react"
import { useGetGroupChannelsQuery } from "../slices/apiSlice"
import ErrorMessage from "./ErrorMessage"
import Loader from "./Loader"


function GroupList() {
    const { data: groups, isFetching, isError } = useGetGroupChannelsQuery()

    if (isError) {
        return <ErrorMessage message="Failed to load groups information" />
    } else if (isFetching) {
        return <Loader />
    } else {
        return <> {groups!.map(group => (
            <IonItem routerLink={`/chats/group/${group.id}`} key={group.id}>
                <IonAvatar slot="start">
                    <img src={group.avatar} />
                </IonAvatar>
                <IonLabel>
                    <h3 className="font-semibold">{group.name}</h3>
                    <p>{group.memberCount} members</p>
                </IonLabel>
            </IonItem>
        ))} </>
    }
}

export default GroupList