import { initializeApp } from 'firebase/app'
import { getMessaging } from "firebase/messaging/sw"
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { pageCache, imageCache, staticResourceCache, googleFontsCache } from 'workbox-recipes'

declare const self: ServiceWorkerGlobalScope

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)

pageCache()

googleFontsCache()

staticResourceCache()

imageCache()

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MSG_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

initializeApp(firebaseConfig)

const messaging = getMessaging()