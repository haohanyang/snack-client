import { useRef } from "react"
import {
    apiSlice, useGetGroupChannelQuery,
    useGetUserChannelQuery, useSendChannelMessageMutation
} from "../slices/apiSlice"
import { useParams } from "react-router"
import {
    IonBackButton, IonButton, IonButtons, RefresherEventDetail,
    IonContent, IonFooter, IonHeader, IonIcon, IonInput, IonItem, IonPage,
    IonToolbar, IonRefresher, IonRefresherContent, useIonLoading, useIonToast
} from "@ionic/react"
import {
    cameraOutline, documentOutline, ellipsisHorizontal, ellipsisVertical,
} from "ionicons/icons"
import { ChannelInfo, ChannelType } from "../models/channel"
import MessageList from "../components/MessageList"
import { GroupChannelStatus, UserChannelStatus } from "../components/ContactStatus"
import { Formik } from "formik"
import { MessageRequest } from "../models/message"
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera"
import { FileUploadResult, PreSignedUrlResult } from "../models/file"
import { Auth } from "aws-amplify"
import LoadingPage from "./LoadingPage"
import ErrorPage from "./ErrorPage"
import NotFound from "./NotFound"
import './Chat.css'
import { getApiUrl } from "../utils"
import { useAppDispatch } from "../hooks"
import stomp, { StompWrapper } from "../ws"

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
    const dispatch = useAppDispatch()
    const ws = useRef<StompWrapper>(stomp)

    const refresh = async (event: CustomEvent<RefresherEventDetail>, channel: ChannelInfo) => {
        if (!ws.current.connected) {
            ws.current.connect()
        }
        dispatch(apiSlice.endpoints.getChannelMessages.initiate(channel, { forceRefetch: true }))
            .then(() => {
                event.detail.complete();
            })
    }

    const takePhoto = async () => {
        const photo = await Camera.getPhoto({
            resultType: CameraResultType.DataUrl,
            source: CameraSource.Photos,
            quality: 100,
        })

        if (userId && photo.dataUrl && !isLoading) {
            const binary = atob(photo.dataUrl.split(",")[1])
            const array = []
            for (let i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i))
            }

            const blob = new Blob([new Uint8Array(array)], { type: 'image/jpeg' })

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

                // Get presigned url
                const urlRequestResponse = await fetch(getApiUrl("/presigned-url"), {
                    method: "POST",
                    body: JSON.stringify({
                        "contentType": "image/jpeg"
                    }),
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (!urlRequestResponse.ok) {
                    throw new Error("Failed to get presigned url")
                }

                const urlRequestResult: PreSignedUrlResult = await urlRequestResponse.json()

                const response = await fetch(urlRequestResult.url, {
                    method: "PUT",
                    body: blob,
                    headers: {
                        "x-amz-meta-user": userId,
                    }
                })

                if (!response.ok) {
                    throw new Error("Failed to upload the photo")
                }

                const result: FileUploadResult = {
                    bucket: urlRequestResult.bucket,
                    key: urlRequestResult.key,
                    contentType: "image/jpeg",
                    size: blob.size,
                    fileName: "image.jpeg",
                    uri: ""
                }
                const messageRequest: MessageRequest = {
                    channel: channel!,
                    content: "image.jpeg",
                    authorId: userId,
                    fileUploadResult: result,
                }
                await sendChannelMessage(messageRequest).unwrap()

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
            if (file.name.length > 100) {
                presentToast({
                    message: "File name must not be more than 100 characters",
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

            const reader = new FileReader()
            reader.onload = async () => {
                if (reader.result) {
                    try {
                        presentLoading({
                            message: "Uploading the file",
                        })
                        const session = await Auth.currentSession()
                        const token = session.getIdToken().getJwtToken()

                        const readerResult = reader.result as string
                        const binary = atob(readerResult.split(',')[1])
                        const array = []
                        for (let i = 0; i < binary.length; i++) {
                            array.push(binary.charCodeAt(i))
                        }
                        const blob = new Blob([new Uint8Array(array)], { type: file.type })

                        // Get presigned url
                        const urlRequestResponse = await fetch(getApiUrl("/presigned-url"), {
                            method: "POST",
                            body: JSON.stringify({
                                "contentType": file.type
                            }),
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        })

                        if (!urlRequestResponse.ok) {
                            throw new Error("Failed to get presigned url")
                        }

                        const urlRequestResult: PreSignedUrlResult = await urlRequestResponse.json()

                        const uploadResponse = await fetch(urlRequestResult.url, {
                            method: "PUT",
                            body: blob,
                            headers: {
                                "x-amz-meta-user": userId,
                            }
                        })

                        if (!uploadResponse.ok) {
                            throw new Error("Failed to upload the photo")
                        }

                        const uploadResult: FileUploadResult = {
                            bucket: urlRequestResult.bucket,
                            key: urlRequestResult.key,
                            contentType: file.type,
                            size: blob.size,
                            fileName: file.name,
                            uri: ""
                        }

                        const messageRequest: MessageRequest = {
                            channel: channel!,
                            content: file.name,
                            authorId: userId,
                            fileUploadResult: uploadResult,
                        }
                        await sendChannelMessage(messageRequest).unwrap()
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

            reader.onerror = () => {
                presentToast({
                    message: "Failed to read the file",
                    color: "danger",
                    duration: 3000,
                })
                throw new Error("Failed to read the file")
            }

            reader.readAsDataURL(file)
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
                        <IonBackButton defaultHref="/chats"></IonBackButton>
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

            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={e => refresh(e, channel)}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <MessageList userId={userId} channel={channel} />
            </IonContent>
            <IonFooter translucent={true}>
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
                                        value={values.text} className="bg-white" disabled={isSubmitting}></IonInput>
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
