import { IonButton, IonInput, IonItem, IonLabel, IonSpinner, useIonRouter } from "@ionic/react"
import { Formik } from "formik"
import { useState } from "react"
import ErrorMessage from "./ErrorMessage"
import SuccessMessage from "./SuccessMessage"

interface ConfirmSignUpFormProps {
    confirmSignUp: (code: string) => Promise<void>
}

export const ConfirmSignUpForm = ({ confirmSignUp }: ConfirmSignUpFormProps) => {

    const router = useIonRouter()
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    return <Formik
        initialValues={{ code: "" }}
        validate={values => {
            const errors = {} as any
            if (!values.code) {
                errors.code = "Verification code is required"
            }
            return errors
        }}

        onSubmit={async (values, { setSubmitting, resetForm }) => {
            setError("")
            setSubmitting(true)
            try {
                await confirmSignUp(values.code)
                setSuccess(true)
                setTimeout(() => {
                    setError("")
                    setSuccess(false)
                    resetForm()
                    router.push("/")
                }, 3000)
            } catch (error: any) {
                console.log(error)
                if (error.message) {
                    setError(error.message)
                }
                else {
                    setError("Unknown error")
                }
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
        }) => (
            <form onSubmit={handleSubmit}>
                <IonItem lines={errors.code ? "none" : "inset"}>
                    <IonInput
                        className={`${errors.code && "ion-invalid"} ${touched.code && "ion-touched"}`}
                        name="code" label="Code" type="password"
                        onIonChange={handleChange}
                        onBlur={handleBlur}
                        value={values.code}
                        errorText={errors.code}>
                    </IonInput>
                </IonItem>
                <IonButton className="ion-margin-horizontal ion-margin-top" expand="block" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <IonSpinner className="ion-margin-horizontal" /> : <IonLabel>Verify</IonLabel>}
                </IonButton>

                {error && <ErrorMessage message={error} />}
                {success && <SuccessMessage message="Your email has been verified. Redirecting to login page" />}
            </form>
        )}
    </Formik>
}