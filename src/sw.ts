import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import { NavigationRoute, registerRoute } from 'workbox-routing'

declare const self: ServiceWorkerGlobalScope

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

const allowlist = [/^\/$/]
registerRoute(new NavigationRoute(
    createHandlerBoundToURL('index.html'),
    { allowlist },
))

self.skipWaiting()
clientsClaim()

self.addEventListener("push", async (event) => {
    if (event.data) {
        const { title, body } = await event.data.json();
        console.log(title, body);
        self.registration.showNotification(title, {
            body,
        });
    }
});
