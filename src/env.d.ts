/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_API_BASE_URL: string
    readonly VITE_COGNITO_USER_POOL_ID: string
    readonly VITE_COGNITO_CLIENT_ID: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}