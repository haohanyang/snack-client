import { IonAvatar, IonItem, IonLabel } from "@ionic/react"
import { useGetGroupChannelsQuery } from "../slices/apiSlice"
import ErrorMessage from "./ErrorMessage"
import Loader from "./Loader"


function GroupList() {
    const { data: groups, isLoading, isError } = useGetGroupChannelsQuery()

    if (isError) {
        return <ErrorMessage message="Failed to load groups information" />
    } else if (isLoading) {
        return <Loader />
    } else if (groups) {
        return <> {groups.map(group => (
            <IonItem routerLink={`/chats/group/${group.id}`} key={group.id} detail={false}>
                <IonAvatar slot="start" className="w-14 h-14">
                    <img src={group.avatar} />
                </IonAvatar>
                <IonLabel>
                    <h3 className="font-semibold">{group.name}</h3>
                    <p>{group.memberCount} members</p>
                </IonLabel>
            </IonItem>
        ))} </>
    }

    return <></>
}

export default GroupList
