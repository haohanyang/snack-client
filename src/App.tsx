import { useEffect, useLayoutEffect, useState } from "react"
import { Auth } from "aws-amplify"
import { Redirect, Route, useLocation } from "react-router-dom"
import { IonReactRouter } from "@ionic/react-router"
import { useGetMeQuery } from "./slices/apiSlice"
import {
    IonApp, IonIcon, IonLabel, IonLoading, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs,
    setupIonicReact
} from "@ionic/react"
import { chatbubble, people, settings } from "ionicons/icons"
import Chats from "./pages/Chats"
import Contacts from "./pages/Contacts"
import Settings from "./pages/Settings"
import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
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

setupIonicReact()

interface tabRoutesProps {
    userId: string
    setUserId: (userId: string) => void
}

const App: React.FC = () => {
    const [userId, setUserId] = useState<string | null>(null)
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
                    console.log("User not logged in")
                })
        }
    }, [userId])

    if (userId === null) {
        return <IonApp>
            <IonLoading />
        </IonApp>
    } else if (!userId) {
        return <IonApp>
            <IonReactRouter>
                <IonRouterOutlet>
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/login">
                        <Login setUserId={setUserIdCallback} />
                    </Route>
                    <Route exact path="/register">
                        <Register />
                    </Route>
                    <Route>
                        <Redirect to="/" />
                    </Route>
                </IonRouterOutlet>
            </IonReactRouter>
        </IonApp>
    }

    return <IonApp>
        <IonReactRouter>
            <TabRoutes userId={userId!} setUserId={setUserIdCallback} />
        </IonReactRouter>
    </IonApp>
}

const TabRoutes = ({ userId, setUserId }: tabRoutesProps) => {
    const { pathname } = useLocation()

    useLayoutEffect(() => {
        if (pathname === "/chats" || pathname === "/contacts" || pathname === "/settings") {
            document.querySelector("ion-tab-bar")?.classList.remove("hidden")
        } else {
            document.querySelector("ion-tab-bar")?.classList.add("hidden")
        }
    }, [pathname])

    return <IonTabs >
        <IonRouterOutlet>
            <Route exact path="/chats">
                <Chats userId={userId} />
            </Route>
            <Route exact path="/chats/:type/:id">
                <Chat userId={userId} />
            </Route>
            <Route exact path="/contacts">
                <Contacts userId={userId} />
            </Route>
            <Route exact path="/settings">
                <Settings userId={userId} setUserId={setUserId} />
            </Route>
            <Route>
                <Redirect to="/chats" />
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
    </IonTabs >
}

export default App
