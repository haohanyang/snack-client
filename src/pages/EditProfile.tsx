import { useRef, useState } from "react"
import { Formik } from "formik"
import {
    IonButton, IonButtons, IonCard, IonCardContent,
    IonContent, IonHeader, IonInput, IonItem, IonLabel, IonModal,
    IonTextarea, IonTitle, IonToolbar, useIonLoading, useIonToast
} from "@ionic/react"
import { useUpdateMeMutation } from "../slices/apiSlice"
import User, { UpdateProfileRequest } from "../models/user"
import { FileUploadResult, PreSignedUrlResult } from "../models/file"
import { Auth } from "aws-amplify"
import { getApiUrl } from "../utils"

interface EditProfileModalProps {
    user: User,
    isOpen: boolean,
    close: () => void,
}

export default function EditProfileModal({ user, isOpen, close }: EditProfileModalProps) {

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

    const uploadImage = async (image: File, callBack: (uploadResult: FileUploadResult) => void) => {
        if (image.size > 1024 * 1024 * 10) {
            presentToast({
                message: "Maximum image size is 10MB",
                color: "danger",
                duration: 1500,
            })
            return
        }
        const reader = new FileReader()

        reader.onloadend = async () => {
            try {
                presentLoading({
                    message: "Uploading the image",
                })

                // Get the JWT token
                const session = await Auth.currentSession()
                const token = session.getIdToken().getJwtToken()

                // Convert the image to binary
                const readerResult = reader.result as string
                const binary = atob(readerResult.split(',')[1])
                const array = []
                for (let i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i))
                }
                const blob = new Blob([new Uint8Array(array)], { type: image.type })

                // Get presigned url
                const urlRequestResponse = await fetch(getApiUrl("/presigned-url"), {
                    method: "POST",
                    body: JSON.stringify({
                        "contentType": image.type,
                    }),
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                })

                if (!urlRequestResponse.ok) {
                    throw new Error("Failed to upload the image")
                }

                const urlRequestResult: PreSignedUrlResult = await urlRequestResponse.json()
                const uploadResponse = await fetch(urlRequestResult.url, {
                    method: "PUT",
                    body: blob,
                    headers: {
                        "x-amz-meta-user": user.id
                    },
                })

                if (!uploadResponse.ok) {
                    throw new Error("Failed to upload the image")
                }

                callBack(
                    {
                        bucket: urlRequestResult.bucket,
                        key: urlRequestResult.key,
                        contentType: image.type,
                        size: blob.size,
                        fileName: image.name,
                        uri: urlRequestResult.fileUrl,
                    }
                )
            } catch (error) {
                presentToast({
                    message: "Failed to upload the image, please try again later",
                    color: "danger",
                    duration: 1500,
                })
            } finally {
                dismissLoading()
            }
        }
        reader.onerror = () => {
            presentToast({
                message: "Failed to read the image, please try again later",
                color: "danger",
                duration: 1500,
            })
        }
        reader.readAsDataURL(image)

    }

    return <IonModal isOpen={isOpen}>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonButton onClick={close}>Close</IonButton>
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
            <Formik
                initialValues={{
                    bio: user.bio,
                    fullName: user.fullName,
                    avatar: user.avatar,
                    backgroundImage: user.backgroundImage,
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
                                userId: user.id,
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
                            close()
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
                            <IonCardContent className="pl-0 pr-2">
                                <IonItem>
                                    <IonButton slot="start" fill="clear" className="h-12 w-12 rounded-full bg-cover" style={{ backgroundImage: `url(${values.avatar})` }}
                                        onClick={() => avatarFileInputRef.current?.click()}>
                                    </IonButton>
                                    <IonLabel className="ion-text-wrap">
                                        <p>
                                            Enter your name and add an optional profile and background picture
                                            <input type="file" hidden ref={avatarFileInputRef} onChange={e => {
                                                if (e.target.files && e.target.files[0]) {
                                                    uploadImage(e.target.files[0], (uploadResult) => {
                                                        setValues({ ...values, avatar: uploadResult.uri })
                                                        setAvatarUploadResult(uploadResult)
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
                                    <IonInput value={user.email} disabled></IonInput>
                                </IonItem>
                            </IonCardContent>
                        </IonCard>

                        <IonCard className="h-60 bg-cover" button style={{ backgroundImage: `url(${values.backgroundImage})` }}
                            onClick={() => backgroundFileInputRef.current?.click()}>
                            <input type="file" accept="image/*" hidden ref={backgroundFileInputRef} onChange={e => {
                                if (e.target.files && e.target.files[0]) {
                                    uploadImage(e.target.files[0], (uploadResult) => {
                                        setValues({ ...values, backgroundImage: uploadResult.uri })
                                        setBackgroundUploadResult(uploadResult)
                                    })
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
            </Formik>
        </IonContent>
    </IonModal>
}
