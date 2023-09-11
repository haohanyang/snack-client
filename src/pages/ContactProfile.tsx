import { Redirect, useParams } from "react-router-dom"
import UserProfile from "../components/UserProfile"
import GroupProfile from "../components/GroupProfile"
import LoadingPage from "./LoadingPage"
import { useGetGroupChannelQuery, useGetUserProfileQuery } from "../slices/apiSlice"
import ErrorPage from "./ErrorPage"
import NotFound from "./NotFound"

interface ContactProfileProps {
    userId: string | null
}

export default function ContactProfile({ userId }: ContactProfileProps) {
    const { id, type } = useParams<{ id: string, type: string }>()
    const { data: user, isFetching: isFetchingUserProfile, isError: isFetchingUserProfileError } =
        useGetUserProfileQuery(id, { skip: type !== "user" })
    const { data: group, isFetching: isFetchingGroup, isError: isFetchingGroupError } =
        useGetGroupChannelQuery(id, {
            skip: type !== "group"
        })

    if (userId === null) {
        return <LoadingPage />
    }

    if (!userId) {
        return <Redirect to="/" />
    }

    if ((type === "user" && isFetchingUserProfile) || (type === "group" && isFetchingGroup)) {
        return <LoadingPage />
    }

    if ((type === "user" && isFetchingUserProfileError) || (type === "group" && isFetchingGroupError)) {
        return <ErrorPage />
    }

    if (type === "user") {
        return <UserProfile user={user!} />
    }

    if (type === "group") {
        return <GroupProfile group={group!} />
    }

    return (
        <NotFound />
    )
}

