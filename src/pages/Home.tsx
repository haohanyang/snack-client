import { IonContent, IonHeader, IonItem, IonPage, IonRouterLink, IonTitle, IonToolbar, useIonRouter } from "@ionic/react"
import { SignInForm } from "../components/SignInForm"
import { Auth } from "aws-amplify"
import { Redirect } from "react-router"
import LoadingPage from "./LoadingPage"


interface HomeProps {
    userId: string | null
    setUserId: (_userId: string) => void
}

const Home = ({ userId, setUserId }: HomeProps) => {
    const router = useIonRouter()

    const signIn = async (email: string, password: string) => {
        const user = await Auth.signIn(email, password)
        setUserId(user.attributes.sub)
        router.push("/chats")
    }

    if (userId === null) {
        return <LoadingPage />
    }

    if (userId) {
        return <Redirect to="/chats" />
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Log in</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Log in</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonItem lines="none">
                    <p>Don't have an account? <IonRouterLink routerLink="/register">Register</IonRouterLink></p>
                </IonItem>
                <SignInForm signIn={signIn} />
            </IonContent>
        </IonPage >
    )
}

export default Home
