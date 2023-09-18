import { Route, useLocation } from "react-router-dom"
import {
    IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact, useIonViewDidEnter
} from "@ionic/react"
import { chatbubble, people, settings } from "ionicons/icons"
import Chats from "./pages/Chats"
import Contacts from "./pages/Contacts"
import Settings from "./pages/Settings"
import ContactProfile from "./pages/ContactProfile"
import Chat from "./pages/Chat"

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css"

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css"
import "@ionic/react/css/structure.css"
import "@ionic/react/css/typography.css"

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css"
import "@ionic/react/css/float-elements.css"
import "@ionic/react/css/text-alignment.css"
import "@ionic/react/css/text-transformation.css"
import "@ionic/react/css/flex-utils.css"
import "@ionic/react/css/display.css"
/* Theme variables */
import "./theme/variables.css"

import EditProfile from "./pages/EditProfile"
import Home from "./pages/Home"
import Register from "./pages/Register"
import ErrorPage from "./pages/ErrorPage"
import { useEffect, useState } from "react"
import { Auth } from "aws-amplify"
import NotFound from "./pages/NotFound"
import { useGetMeQuery } from "./slices/apiSlice"

setupIonicReact()

const App: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null)
    const { pathname } = useLocation()
    const setUserIdCallback = (_userId: string) => setUserId(_userId)

    useGetMeQuery(undefined, {
        skip: !userId
    })

    useEffect(() => {
        if (!userId) {
            Auth.currentAuthenticatedUser()
                .then(user => {
                    const userId_ = user.attributes.sub
                    setUserId(userId_)
                })
                .catch(error => {
                    console.log(error)
                    setUserId("")
                })
        }
    }, [userId])

    useEffect(() => {
        if (pathname === "/chats" || pathname === "/contacts" || pathname === "/settings") {
            document.querySelector("ion-tab-bar")?.classList.remove("hidden")
        } else {
            document.querySelector("ion-tab-bar")?.classList.add("hidden")
        }
    }, [pathname])

    return <IonTabs>
        <IonRouterOutlet>
            <Route exact path="/">
                <Home userId={userId} setUserId={setUserIdCallback} />
            </Route>
            <Route exact path="/register">
                <Register />
            </Route>
            <Route exact path="/chats">
                <Chats userId={userId} />
            </Route>
            <Route path="/chats/:type/:id">
                <Chat userId={userId} />
            </Route>
            <Route exact path="/contacts">
                <Contacts userId={userId} />
            </Route>
            <Route exact path="/settings">
                <Settings userId={userId} setUserId={setUserIdCallback} />
            </Route>
            <Route path="/profile/:type/:id">
                <ContactProfile userId={userId} />
            </Route>
            <Route exact path="/settings/edit-profile">
                <EditProfile userId={userId} />
            </Route>
            <Route exact path="/error">
                <ErrorPage />
            </Route>
            <Route>
                <NotFound />
            </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom" id="tab-bar">
            <IonTabButton tab="tab1" href="/chats">
                <IonIcon aria-hidden="true" icon={chatbubble} />
                <IonLabel>Chats</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/contacts">
                <IonIcon aria-hidden="true" icon={people} />
                <IonLabel>Contacts</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/settings">
                <IonIcon aria-hidden="true" icon={settings} />
                <IonLabel>Settings</IonLabel>
            </IonTabButton>
        </IonTabBar>
    </IonTabs>
}

export default App
