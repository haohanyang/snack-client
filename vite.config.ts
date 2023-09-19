import legacy from "@vitejs/plugin-legacy"
import react from "@vitejs/plugin-react"
import { UserConfig, defineConfig, loadEnv } from "vite"
import { VitePWA } from 'vite-plugin-pwa'

export default ({ mode }) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
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
        config.server.proxy = {
            "/api": {
                target: `http://${process.env.VITE_SERVER_ADDRESS}`,
                changeOrigin: true,
            }
        }
    }

    return defineConfig(config)
}
