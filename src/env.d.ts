/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_COGNITO_USER_POOL_ID: string
    readonly VITE_COGNITO_CLIENT_ID: string
    readonly VITE_SERVER_ADDRESS: string
    readonly VITE_FIREBASE_APIKEY: string
    readonly VITE_FIREBASE_PROJECT_ID: string
    readonly VITE_FIREBASE_MSG_SENDER_ID: string
    readonly VITE_FIREBASE_APP_ID: string
    readonly VITE_FIREBASE_VAPIDKEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}