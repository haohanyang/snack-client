import { useState } from "react"
import { Auth } from "aws-amplify"
import { IonContent, IonHeader, IonItem, IonPage, IonRouterLink, IonTitle, IonToolbar, useIonRouter } from "@ionic/react"
import { SignUpForm } from "../components/SignUpForm"
import { ConfirmSignUpForm } from "../components/ConfirmSignUpForm"

const Home: React.FC = () => {

    const router = useIonRouter()
    const [signUpState, setSignUpState] = useState<"initial" | "confirmSignUp">("initial")
    const [confirmDestination, setConfirmDestination] = useState<string>("")
    const [userId, setUserId] = useState<string>("")

    const signUp = async (email: string, username: string, fullName: string, password: string) => {
        const result = await Auth.signUp({
            username: email,
            password: password,
            attributes: {
                preferred_username: username,
                name: fullName
            }
        })

        if (!result.userConfirmed) {
            setSignUpState("confirmSignUp")
            setUserId(result.userSub)
            setConfirmDestination(result.codeDeliveryDetails.Destination)
        }
    }

    const confirmSignUp = async (code: string) => {
        await Auth.confirmSignUp(userId, code)
        router.push("/?registered=true")
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>
                        {signUpState == "initial" ? "Register" : "Confirm your email"}
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">
                            {signUpState == "initial" ? "Register" : "Confirm your email"}
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>

                <IonItem lines="none">
                    <p>Already have an account? <IonRouterLink routerLink="/">Log in</IonRouterLink></p>
                </IonItem>

                {signUpState == "confirmSignUp" &&
                    <IonItem lines="none">
                        <p>A verification code has been sent to {confirmDestination}. Please enter the code.</p>
                    </IonItem>
                }

                {signUpState == "initial" ?
                    <SignUpForm signUp={signUp} /> :
                    <ConfirmSignUpForm confirmSignUp={confirmSignUp} />}
            </IonContent>
        </IonPage>
    )
}

export default Home
