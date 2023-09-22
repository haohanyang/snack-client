import { StompSubscription, Client, IMessage } from "@stomp/stompjs"
import { getBrokerUrl } from "./utils"

export class StompWrapper {
    client: Client = new Client({
        brokerURL: getBrokerUrl(),
        debug: str => {
            if (process.env.NODE_ENV === "development") {
                console.log(str)
            }
        },
    })

    subscription: StompSubscription | null = null

    get connected() {
        return this.client.connected
    }

    setConnectAuth(jwt: string) {
        this.client.configure({
            connectHeaders: {
                Authorization: jwt,
            },
        })
    }

    subsribe(destination: string, callback: (message: IMessage) => void) {
        if (this.subscription) {
            this.subscription.unsubscribe()
        }

        this.client.configure({
            onConnect: () => {
                this.subscription = this.client.subscribe(destination, callback)
            }
        })
    }

    connect() {
        this.client.activate()
    }

    async disconnect() {
        return this.client.deactivate()
    }
}

const stomp = new StompWrapper()

export default stomp
