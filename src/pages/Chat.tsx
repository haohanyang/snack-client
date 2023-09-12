import {
    IonBackButton, IonButton, IonButtons,
    IonContent, IonFooter, IonHeader, IonIcon, IonInput, IonItem, IonPage,
    IonToolbar, useIonLoading, useIonToast
} from "@ionic/react"
import {
    cameraOutline, documentOutline, ellipsisHorizontal, ellipsisVertical,
} from "ionicons/icons"
import { useGetGroupChannelQuery, useGetUserChannelQuery, useSendChannelMessageMutation } from "../slices/apiSlice"
import { useRef } from "react"
import { useParams } from "react-router"
import { ChannelInfo, ChannelType } from "../models/channel"
import MessageList from "../components/MessageList"
import { GroupChannelStatus, UserChannelStatus } from "../components/ContactStatus"
import { Formik } from "formik"
import { MessageRequest } from "../models/message"
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera"
import { FileUploadResult } from "../models/file"
import { Auth } from "aws-amplify"
import LoadingPage from "./LoadingPage"
import ErrorPage from "./ErrorPage"
import NotFound from "./NotFound"
import './Chat.css'

interface ChatProps {
    userId: string | null
}

const Chat = ({ userId }: ChatProps) => {

    const { id, type } = useParams<{ id: string, type: string }>()
    const { data: userChannel, isFetching: isFetchingUserChannel, isError: isFetchingUserChannelError } = useGetUserChannelQuery(id, {
        skip: type !== "user"
    })
    const { data: groupChannel, isFetching: isFetchingGroupChannel, isError: isFetchingGroupChannelError } = useGetGroupChannelQuery(id, {
        skip: type !== "group"
    })
    const [presentToast] = useIonToast()
    const [presentLoading, dismissLoading] = useIonLoading()
    const fileRef = useRef<HTMLInputElement>(null)
    const [sendChannelMessage, { isLoading }] = useSendChannelMessageMutation()

    const fileUrl = process.env.NODE_ENV === "development" ?
        `http://${import.meta.env.VITE_SERVER_ADDRESS}/api/v1/files` : "/api/v1/files"

    const takePhoto = async () => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Photos,
            quality: 100
        })

        if (userId && photo.webPath && !isLoading) {
            const response = await fetch(photo.webPath)
            const blob = await response.blob()
            if (blob.size > 10 * 1024 * 1024) {
                presentToast({
                    message: "File size must be less than 10MB",
                    color: "danger",
                    duration: 3000,
                })
                return
            }
            try {
                presentLoading({
                    message: "Uploading the media",
                })
                const session = await Auth.currentSession()
                const token = session.getIdToken().getJwtToken()
                const formData = new FormData()
                formData.append("file", blob)

                const response = await fetch(fileUrl, {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (response.ok) {
                    const result: FileUploadResult = await response.json()
                    const messageRequest: MessageRequest = {
                        channel: channel!,
                        content: `image.${photo.format}`,
                        authorId: userId,
                        fileUploadResult: result,
                    }
                    await sendChannelMessage(messageRequest).unwrap()
                } else {
                    throw new Error("Failed to upload the photo")
                }
            } catch (error) {
                console.log(error)
                presentToast({
                    message: "Failed to upload the photo, please try again later",
                    color: "danger",
                    duration: 3000,
                })
            } finally {
                dismissLoading()
            }
        }
    }

    const uploadFile = async (file: File) => {
        if (userId && !isLoading) {
            if (file.name.length > 80) {
                presentToast({
                    message: "File name must be less than 80 characters",
                    color: "danger",
                    duration: 3000,
                })
                return
            }

            if (file.size > 10 * 1024 * 1024) {
                presentToast({
                    message: "File size must be less than 10MB",
                    color: "danger",
                    duration: 3000,
                })
                return
            }
            try {
                presentLoading({
                    message: "Uploading the file",
                })
                const session = await Auth.currentSession()
                const token = session.getIdToken().getJwtToken()
                const formData = new FormData()
                formData.append("file", file)

                const response = await fetch(fileUrl, {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (response.ok) {
                    const result: FileUploadResult = await response.json()
                    const messageRequest: MessageRequest = {
                        channel: channel!,
                        content: file.name,
                        authorId: userId,
                        fileUploadResult: result,
                    }
                    await sendChannelMessage(messageRequest).unwrap()
                } else {
                    throw new Error("Failed to upload the file")
                }
            } catch (error) {
                console.log(error)
                presentToast({
                    message: "Failed to upload the file, please try again later",
                    color: "danger",
                    duration: 3000,
                })
            } finally {
                dismissLoading()
            }
        }
    }

    if (userId === null) {
        return <LoadingPage />
    }

    if (!userId || (type !== "user" && type !== "group") || !/^\d+$/.test(id)) {
        return <NotFound />
    }

    const channel: ChannelInfo = {
        id: parseInt(id),
        type: type === "user" ? ChannelType.USER : ChannelType.GROUP
    }

    if ((channel.type == ChannelType.USER && isFetchingUserChannel) ||
        (channel.type == ChannelType.GROUP && isFetchingGroupChannel)) {
        return <LoadingPage />
    }

    if ((channel.type == ChannelType.USER && isFetchingUserChannelError) ||
        (channel.type == ChannelType.GROUP && isFetchingGroupChannelError)) {
        return <ErrorPage />
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="light">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/chats">Back</IonBackButton>
                    </IonButtons>
                    {channel.type == ChannelType.USER ? <UserChannelStatus userId={userId} channel={userChannel!} />
                        : <GroupChannelStatus userId={userId} channel={groupChannel!} />}
                    <IonButtons slot="end">
                        <IonButton>
                            <IonIcon slot="icon-only" ios={ellipsisHorizontal} md={ellipsisVertical}></IonIcon>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen color="#FFFFFF">
                <MessageList userId={userId} channel={channel} />
            </IonContent>
            <IonFooter translucent={true} color="light">
                <IonToolbar>
                    <Formik
                        initialValues={{ text: "" }}
                        validate={values => {
                            const errors: any = {}
                            if (!values.text) {
                                errors.text = "Required"
                            }
                            return errors
                        }}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            if (!isLoading && values.text) {
                                const request: MessageRequest = {
                                    channel: channel!,
                                    content: values.text,
                                    authorId: userId,
                                    fileUploadResult: null,
                                }
                                try {
                                    setSubmitting(true)
                                    await sendChannelMessage(request).unwrap()
                                    resetForm()
                                } catch (error) {
                                    console.log(error)
                                    presentToast({
                                        message: "Failed to send message.",
                                        duration: 1500,
                                        position: "bottom",
                                    })
                                } finally {
                                    setSubmitting(false)
                                }
                            }
                        }}
                    >
                        {({ values, handleChange, handleBlur,
                            handleSubmit, isSubmitting, }) => (
                            <form onSubmit={handleSubmit} className="chat-input-form">
                                <IonItem className="message-toolbar">
                                    <IonInput type="text" name="text" placeholder="Message"
                                        onIonChange={handleChange} onBlur={handleBlur}
                                        value={values.text} className="bg-white"></IonInput>
                                    <IonButtons slot="end" className="ml-0">
                                        <input type="file" className="border-solid" accept=".pdf,*.txt" hidden ref={fileRef} onChange={e => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                uploadFile(e.target.files[0])
                                            }
                                        }}></input>
                                        <IonButton type="button" onClick={() => fileRef.current?.click()}>
                                            <IonIcon icon={documentOutline} ></IonIcon>
                                        </IonButton>
                                        <IonButton type="button" onClick={takePhoto}>
                                            <IonIcon icon={cameraOutline}></IonIcon>
                                        </IonButton>
                                    </IonButtons>
                                </IonItem>
                            </form>
                        )}
                    </Formik>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    )
}

export default Chat
