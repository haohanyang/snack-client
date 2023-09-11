import { IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonItemDivider, IonLabel, IonModal, IonSelect, IonSelectOption, IonSpinner, IonTextarea, IonTitle, IonToolbar, useIonRouter } from "@ionic/react"
import { useAddNewGroupChannelMutation, useGetFriendsQuery } from "../slices/apiSlice"
import ErrorMessage from "./ErrorMessage"
import { Formik } from "formik"
import { useState } from "react"
import { GroupChannelRequest } from "../models/channel"

interface NewGroupModalProps {
    isOpen: boolean
    userId: string
    closeModal: () => void
}

export default function NewGroupModal({ isOpen, closeModal, userId }: NewGroupModalProps) {
    const router = useIonRouter()
    const [error, setError] = useState<string | null>(null)
    const { data: friends, isFetching, isError } = useGetFriendsQuery()
    const [addNewGroupChannel, { isLoading }] = useAddNewGroupChannelMutation()

    const createGroupChannel = async (name: string, description: string, members: string[]) => {
        if (!isLoading) {
            const groupChannelRequest: GroupChannelRequest = {
                name: name,
                description: description,
                memberIds: members,
                creatorId: userId
            }
            const channel = await addNewGroupChannel(groupChannelRequest).unwrap()
            closeModal()
            router.push(`/chats/group/${channel.id}`)
        }
    }

    let content
    if (isError) {
        content = <ErrorMessage message="Failed to load friends info" />
    } else if (isFetching) {
        content = <IonSpinner />
    } else {
        content = <Formik
            initialValues={{ name: "", description: "", members: [] }}
            validate={values => {
                const errors: any = {}
                if (!values.name) {
                    errors.name = "Required"
                }

                if (!values.members) {
                    errors.members = "Required"
                }
                return errors
            }}
            onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true)
                try {
                    await createGroupChannel(values.name, values.description, values.members)
                } catch (error) {
                    setError("Failed to create group channel")
                } finally {
                    setSubmitting(false)
                }
            }}
        >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                /* and other goodies */
            }) => (
                <form onSubmit={handleSubmit}>
                    <IonItem lines="inset">
                        <IonLabel position="stacked">Name</IonLabel>
                        <IonInput
                            className={`${errors.name && "ion-invalid"} ${touched.name && "ion-touched"}`}
                            name="name" type="text"
                            onIonChange={handleChange}
                            onIonBlur={handleBlur}
                            value={values.name}
                            errorText={errors.name}
                        ></IonInput>
                    </IonItem>
                    <IonItem lines="inset">
                        <IonLabel position="stacked">Description</IonLabel>
                        <IonInput
                            className={`${errors.description && "ion-invalid"} ${touched.description && "ion-touched"}`}
                            name="description" type="text"
                            onIonChange={handleChange}
                            onIonBlur={handleBlur}
                            value={values.description}
                            errorText={errors.description}
                        ></IonInput>
                    </IonItem>
                    <IonItem lines="inset">
                        <IonLabel position="stacked">Members</IonLabel>
                        <IonSelect
                            multiple={true} okText="Add" cancelText="Cancel"
                            onIonChange={handleChange} onIonBlur={handleBlur}
                            value={values.members} name="members"
                        >
                            {friends!.map(friend => <IonSelectOption key={friend.id} value={friend.id}>{friend.fullName}</IonSelectOption>)}
                        </IonSelect>
                    </IonItem>
                    <IonButton type="submit" expand="block" className="ion-margin-top ion-margin-horizontal" disabled={isSubmitting}>
                        {isSubmitting ? <IonSpinner /> : <span>Create</span>}
                    </IonButton>
                    {error && <ErrorMessage message={error} />}
                </form>
            )}
        </Formik>
    }

    return <IonModal isOpen={isOpen}>
        <IonHeader>
            <IonToolbar>
                <IonTitle>New Group</IonTitle>
                <IonButtons slot="end">
                    <IonButton onClick={closeModal}>Close</IonButton>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
            {content}
        </IonContent>
    </IonModal>
}
