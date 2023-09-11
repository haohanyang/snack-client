import { IonButton, IonCard, IonCardContent, IonInput, IonItem, IonLabel, IonSpinner } from "@ionic/react"
import { Formik } from "formik"
import { useState } from "react"

interface ConfirmSignUpFormProps {
    confirmSignUp: (code: string) => Promise<void>
}

export const ConfirmSignUpForm = ({ confirmSignUp }: ConfirmSignUpFormProps) => {

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

        onSubmit={async (values, { setSubmitting }) => {
            setError("")
            setSubmitting(true)
            try {
                await confirmSignUp(values.code)
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

                {error && <IonCard className="ion-margin-top ion-margin-horizontal" color="danger">
                    <IonCardContent>
                        {error}
                    </IonCardContent>
                </IonCard>}
            </form>
        )}
    </Formik>
}