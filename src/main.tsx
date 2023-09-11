import React from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'
import { IonApp } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'

Amplify.configure({
    aws_cognito_region: "eu-north-1",
    aws_user_pools_id: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    aws_user_pools_web_client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
})

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <IonApp>
                <IonReactRouter>
                    <App />
                </IonReactRouter>
            </IonApp>
        </Provider>
    </React.StrictMode>
)

// install service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
    })
}
