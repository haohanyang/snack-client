import legacy from "@vitejs/plugin-legacy"
import react from "@vitejs/plugin-react"
import { UserConfig, defineConfig } from "vite"
import { VitePWA } from 'vite-plugin-pwa'

let config: UserConfig = {
    server: {
        port: 5173,
    },
    plugins: [
        react(),
        legacy(),
        VitePWA({
            manifest: {
                name: process.env.NODE_ENV === "development" ? "Snack Test" : "Snack",
                short_name: "snack",
                icons: [
                    {
                        src: "android-chrome-192x192.png",
                        sizes: "192x192", "type": "image/png"
                    },
                    {
                        src: "android-chrome-512x512.png",
                        sizes: "512x512", "type": "image/png"
                    }],
                theme_color: "#ffffff",
                background_color: "#ffffff",
                display: "standalone",
            },
            filename: "sw.ts",
            injectRegister: "auto",
            srcDir: "src",
            strategies: "injectManifest",
            devOptions: {
                enabled: true,
                type: "module",
            }
        })
    ],
}

if (process.env.NODE_ENV === "development") {
    config.define = {
        global: {}
    }
}

export default defineConfig(config)
