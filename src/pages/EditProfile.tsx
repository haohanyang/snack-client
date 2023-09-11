import { useRef, useState } from "react"
import { Formik } from "formik"
import {
    IonAvatar,
    IonBackButton, IonButton, IonButtons, IonCard, IonCardContent,
    IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage,
    IonTextarea, IonTitle, IonToolbar, useIonLoading, useIonToast
} from "@ionic/react"
import { useGetMeQuery, useUpdateMeMutation } from "../slices/apiSlice"
import { UpdateProfileRequest } from "../models/user"
import ErrorMessage from "../components/ErrorMessage"
import Loader from "../components/Loader"
import { FileUploadResult } from "../models/file"
import LoadingPage from "./LoadingPage"
import ErrorPage from "./ErrorPage"
import { Auth } from "aws-amplify"
import { Redirect } from "react-router"

interface EditProfileProps {
    userId: string | null
}

export default function EditProfile({ userId }: EditProfileProps) {

    // Get user info
    const { data: me, isFetching, isError } = useGetMeQuery()
    const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false)
    // type input buttons that IonButton refers to
    const submitButtonRef = useRef<HTMLButtonElement>(null)
    const resetButtonRef = useRef<HTMLButtonElement>(null)

    const backgroundFileInputRef = useRef<HTMLInputElement | null>(null)
    const avatarFileInputRef = useRef<HTMLInputElement | null>(null)

    const [avatarUploadResult, setAvatarUploadResult] = useState<FileUploadResult | null>(null)
    const [backgroundUploadResult, setBackgroundUploadResult] = useState<FileUploadResult | null>(null)


    // Notify user when upload error occurs
    const [presentToast] = useIonToast()
    const [presentLoading, dismissLoading] = useIonLoading()
    const [updateProfile, { isLoading }] = useUpdateMeMutation()
    const uploadBackgroundImage = async (backgroundFile: File, setBackgroundImage: (url: string) => void) => {
        if (me) {
            if (backgroundFile.size > 1024 * 1024 * 10) {
                presentToast({
                    message: "Maximum image size is 10MB",
                    color: "danger",
                    duration: 1500,
                })
                return
            }
            const form = new FormData()
            form.append("file", backgroundFile)

            try {
                presentLoading({
                    message: "Uploading background image",
                })
                const session = await Auth.currentSession()
                const token = session.getIdToken().getJwtToken()
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/files`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    body: form,
                })
                if (response.ok) {
                    const result: FileUploadResult = await response.json()
                    setBackgroundImage(result.uri)
                    setBackgroundUploadResult(result)
                } else {
                    presentToast({
                        message: "Failed to upload the background image, please try again later",
                        color: "danger",
                        duration: 1500,
                    })
                }
            } catch (error) {
                presentToast({
                    message: "Failed to upload the background image, please try again later",
                    color: "danger",
                    duration: 1500,
                })
            } finally {
                dismissLoading()
            }
        }
    }

    const uploadAvatar = async (avatarFile: File, setAvatar: (url: string) => void) => {
        if (me) {
            if (avatarFile.size > 1024 * 1024 * 10) {
                presentToast({
                    message: "Maximum image size is 10MB",
                    color: "danger",
                    duration: 1500,
                })
                return
            }
            const form = new FormData()
            form.append("file", avatarFile)

            try {
                presentLoading({
                    message: "Uploading the avatar",
                })
                const session = await Auth.currentSession()
                const token = session.getIdToken().getJwtToken()
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/files`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                    body: form,
                })
                if (response.ok) {
                    const result: FileUploadResult = await response.json()
                    setAvatar(result.uri)
                    setAvatarUploadResult(result)
                } else {
                    presentToast({
                        message: "Failed to upload the avatar, please try again later",
                        color: "danger",
                        duration: 1500,
                    })
                }
            } catch (error) {
                presentToast({
                    message: "Failed to upload the avatar, please try again later",
                    color: "danger",
                    duration: 1500,
                })
            } finally {
                dismissLoading()
            }
        }
    }

    if (userId === null) {
        return <LoadingPage />
    }

    if (!userId) {
        return <Redirect to="/" />
    }

    if (isError) {
        return <ErrorPage />
    }

    if (isFetching) {
        return <LoadingPage />
    }

    if (!me) {
        return <ErrorPage />
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/settings"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Edit profile</IonTitle>
                    <IonButtons slot="end">
                        {resetButtonRef && <IonButton onClick={() => resetButtonRef.current!.click()}>Reset</IonButton>}
                        {submitButtonRef && <IonButton onClick={() => submitButtonRef.current!.click()} disabled={isSavingProfile}>
                            <strong>Save</strong>
                        </IonButton>}
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen color="light">
                {
                    isError ? <ErrorMessage message="Failed to load user info" /> :
                        (isFetching ? <Loader /> : <Formik
                            initialValues={{
                                bio: me.bio,
                                fullName: me.fullName,
                                avatar: me.avatar,
                                backgroundImage: me.backgroundImage,
                            }}
                            validate={values => {
                                const errors: any = {}

                                const fullName = values.fullName.trim()
                                if (!fullName) {
                                    errors.fullName = "Required"
                                } else if (fullName.length > 50) {
                                    errors.fullName = "Full name length must be less than 50 characters"
                                }

                                return errors
                            }}
                            onSubmit={async (values, { setSubmitting }) => {
                                if (!isLoading) {
                                    setSubmitting(true)
                                    setIsSavingProfile(true)
                                    try {
                                        const request: UpdateProfileRequest = {
                                            userId: me.id,
                                            fullName: values.fullName,
                                            status: "",
                                            bio: values.bio.trim(),
                                            avatar: avatarUploadResult,
                                            backgroundImage: backgroundUploadResult,
                                        }
                                        await updateProfile(request).unwrap()
                                        presentToast({
                                            message: "The profile is saved",
                                            color: "success",
                                            duration: 1500,
                                        })
                                    } catch (err) {
                                        presentToast({
                                            message: "Failed to update the profile, please try again later",
                                            color: "danger",
                                            duration: 1500,
                                        })
                                    } finally {
                                        setSubmitting(false)
                                        setIsSavingProfile(false)
                                    }
                                }
                            }}
                        >
                            {({ values,
                                errors,
                                touched,
                                resetForm,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                setValues,
                                isSubmitting, }) => (
                                <form id="profile-form" onSubmit={handleSubmit}>
                                    <IonCard>
                                        <IonCardContent className="px-1">
                                            <IonItem>
                                                <IonButton slot="start" fill="clear" className="ion-margin-end"
                                                    onClick={() => avatarFileInputRef.current?.click()}>
                                                    <IonAvatar>
                                                        <img className="w-14 h-14 rounded-full" src={values.avatar} />
                                                    </IonAvatar>
                                                </IonButton>
                                                <IonLabel className="ion-text-wrap">
                                                    <p>
                                                        Enter your name and add an optional profile and background pictures
                                                        <input type="file" hidden ref={avatarFileInputRef} onChange={e => {
                                                            if (e.target.files && e.target.files[0]) {
                                                                uploadAvatar(e.target.files[0], (url) => {
                                                                    setValues({ ...values, avatar: url })
                                                                })
                                                            }
                                                        }} />
                                                    </p>
                                                </IonLabel>
                                            </IonItem>
                                            <IonItem lines={errors.fullName ? "none" : "inset"}>
                                                <IonInput type="text" name="fullName" placeholder="John Doe"
                                                    className={`${errors.fullName && "ion-invalid"} ${touched.fullName && "ion-touched"}`}
                                                    onIonChange={handleChange}
                                                    onBlur={handleBlur}
                                                    errorText={errors.fullName}
                                                    value={values.fullName}></IonInput>
                                            </IonItem>
                                            <IonItem>
                                                <IonInput value={"@" + me.username} disabled></IonInput>
                                            </IonItem>
                                        </IonCardContent>
                                    </IonCard>

                                    <IonCard className="h-60" button onClick={() => backgroundFileInputRef.current?.click()}>
                                        <img src={values.backgroundImage} />
                                        <input type="file" accept="image/*" hidden ref={backgroundFileInputRef} onChange={e => {
                                            if (e.target.files && e.target.files[0]) {
                                                uploadBackgroundImage(e.target.files[0], url => setValues({ ...values, backgroundImage: url }))
                                            }
                                        }} />
                                    </IonCard>

                                    <IonCard>
                                        <IonCardContent className="p-0">
                                            <IonItem lines="none">
                                                <IonTextarea
                                                    name="bio" placeholder="about"
                                                    value={values.bio}
                                                    onIonChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className="h-24"></IonTextarea>
                                            </IonItem>
                                        </IonCardContent>
                                    </IonCard>
                                    <button ref={submitButtonRef} type="submit" hidden></button>
                                    <button ref={resetButtonRef} type="button" onClick={() => resetForm()} disabled={isSubmitting} hidden></button>
                                </form>
                            )}
                        </Formik>)
                }
            </IonContent>
        </IonPage >
    )
}