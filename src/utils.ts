export function getApiUrl(relative_path: string): string {
    return process.env.NODE_ENV === "development" ?
        `http://${import.meta.env.VITE_SERVER_ADDRESS}/api/v1${relative_path}` : `/api/v1${relative_path}`
}

export function getBrokerUrl(): string {
    let brokerUrl = ""

    if (process.env.NODE_ENV === "development") {
        brokerUrl = `ws://${import.meta.env.VITE_SERVER_ADDRESS}/ws`
    } else {
        const location = window.location
        if (location.protocol === "https:") {
            brokerUrl = "wss:"
        } else {
            brokerUrl = "ws:"
        }
        brokerUrl += "//" + location.host + "/ws"
    }

    return brokerUrl
}


