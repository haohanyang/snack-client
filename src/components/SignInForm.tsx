import { IonButton, IonCard, IonCardContent, IonInput, IonItem, IonLabel, IonSpinner } from "@ionic/react"
import { Formik } from "formik"
import { useState } from "react"

interface SignInFormProps {
    signIn: (email: string, password: string) => Promise<void>
}
export const SignInForm = ({ signIn }: SignInFormProps) => {
    const [error, setError] = useState<string>("")

    return <Formik
        initialValues={{ email: "", password: "" }}
        validate={values => {
            const errors = {} as any

            const email = values.email.trim()
            if (!email) {
                errors.email = "Email is required"
            } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
            ) {
                errors.email = "Invalid email"
            }

            const password = values.password.trim()
            if (!password) {
                errors.password = "Password is required"
            }
            return errors
        }}

        onSubmit={async (values, { setSubmitting }) => {
            setError("")
            setSubmitting(true)
            try {
                await signIn(values.email.trim(), values.password.trim())
            } catch (error: any) {
                setError(error.message || "An unknown error occurred")
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
                <IonItem lines={errors.email ? "none" : "inset"}>
                    <IonInput
                        className={`${errors.email && "ion-invalid"} ${touched.email && "ion-touched"}`}
                        name="email" label="Email" type="text"
                        onIonChange={handleChange}
                        onIonBlur={handleBlur}
                        value={values.email}
                        errorText={errors.email}>
                    </IonInput>
                </IonItem>
                <IonItem lines={errors.password ? "none" : "inset"}>
                    <IonInput
                        className={`${errors.password && "ion-invalid"} ${touched.password && "ion-touched"}`}
                        name="password" label="Password" type="password"
                        onIonChange={handleChange}
                        onIonBlur={handleBlur}
                        value={values.password}
                        errorText={errors.password}>
                    </IonInput>
                </IonItem>
                <IonButton className="ion-margin-horizontal ion-margin-top" expand="block" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <IonSpinner className="ion-margin-horizontal" /> : <IonLabel>Log in</IonLabel>}
                </IonButton>

                {error && <IonCard className="ion-margin-top ion-margin-horizontal" color="danger">
                    <IonCardContent>
                        {error}
                    </IonCardContent>
                </IonCard>}
            </form>
        )}
    </Formik >
}