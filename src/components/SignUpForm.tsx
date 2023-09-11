import { IonButton, IonInput, IonItem, IonLabel, IonSpinner } from "@ionic/react"
import { Formik } from "formik"
import { useState } from "react"
import ErrorMessage from "./ErrorMessage"

interface SignUpFormProps {
    signUp: (email: string, username: string, fullName: string, password: string) => Promise<void>
}

export const SignUpForm = ({ signUp }: SignUpFormProps) => {

    const [error, setError] = useState<string>("")

    return <Formik
        initialValues={{ email: "", password: "", username: "", fullName: "" }}
        validate={values => {
            const errors = {} as any

            const email = values.email.trim()
            if (!email) {
                errors.email = "Required"
            } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
            ) {
                errors.email = "Invalid email"
            }

            const fullName = values.fullName.trim()
            if (!fullName) {
                errors.fullName = "Required"
            } else if (fullName.length > 50) {
                errors.fullName = "Full name length must be less than 50 characters"
            }

            const password = values.password
            if (!password) {
                errors.password = "Required"
            } else if (password.includes(" ")) {
                errors.password = "Password cannot contain spaces"
            } else if (password.length < 8) {
                errors.password = "Password length must be at least 8"
            }

            const username = values.username.trim()
            const pattern = /^[a-zA-Z0-9-_`]+$/
            if (!username) {
                errors.username = "Required"
            } else if (username.length < 4) {
                errors.username = "Username length must be at least 4"
            } else if (!pattern.test(username)) {
                // Only allow numbers, letters, underscores and dashes
                errors.username = "Username can only contain numbers, letters, underscores and dashes"
            }
            return errors
        }}

        onSubmit={async (values, { setSubmitting }) => {
            setError("")
            setSubmitting(true)
            try {
                await signUp(values.email.trim(), values.username.trim(), values.fullName.trim(), values.password.trim())
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
                <IonItem lines={errors.email ? "none" : "inset"}>
                    <IonInput
                        className={`${errors.email && "ion-invalid"} ${touched.email && "ion-touched"}`}
                        name="email" label="Email" type="text"
                        onIonChange={handleChange}
                        onIonBlur={handleBlur}
                        value={values.email}
                        placeholder="someone@example.com"
                        errorText={errors.email}>
                    </IonInput>
                </IonItem>
                <IonItem lines={errors.fullName ? "none" : "inset"}>
                    <IonInput
                        className={`${errors.fullName && "ion-invalid"} ${touched.fullName && "ion-touched"}`}
                        name="fullName" label="Full Name" type="text"
                        onIonChange={handleChange}
                        onIonBlur={handleBlur}
                        value={values.fullName}
                        placeholder="John Doe"
                        errorText={errors.fullName}>
                    </IonInput>
                </IonItem>
                <IonItem lines={errors.username ? "none" : "inset"}>
                    <IonInput
                        className={`${errors.username && "ion-invalid"} ${touched.username && "ion-touched"}`}
                        name="username" label="Username" type="text"
                        onIonChange={handleChange}
                        onIonBlur={handleBlur}
                        value={values.username}
                        placeholder="john_doe"
                        errorText={errors.username}
                    >
                    </IonInput>
                </IonItem>
                <IonItem lines={errors.password ? "none" : "inset"}>
                    <IonInput
                        className={`${errors.password && "ion-invalid"} ${touched.password && "ion-touched"}`}
                        name="password" label="Password" type="password"
                        onIonChange={handleChange}
                        onIonBlur={handleBlur}
                        value={values.password}
                        errorText={errors.password}
                    >
                    </IonInput>
                </IonItem>
                <IonButton className="ion-margin-horizontal ion-margin-top" expand="block" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <IonSpinner className="ion-margin-horizontal" /> : <IonLabel>Register</IonLabel>}
                </IonButton>
                {error && <ErrorMessage message={error} />}
            </form>
        )}
    </Formik>
}
