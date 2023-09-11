import User from "./user"

export default interface Membership {
    id: number
    member: User
    isCreator: boolean
}