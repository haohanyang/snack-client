import React from 'react'
import { createRoot } from 'react-dom/client'
import { Amplify } from 'aws-amplify'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'
import { initializeApp } from "firebase/app"
import './index.css'


Amplify.configure({
    aws_cognito_region: "eu-north-1",
    aws_user_pools_id: import.meta.env.VITE_COGNITO_USER_POOL_ID,
    aws_user_pools_web_client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
})

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MSG_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

initializeApp(firebaseConfig)

const container = document.getElementById('root')
const root = createRoot(container!)

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
)
