import { FileUploadResult } from "./file"

export default interface User {
    id: string
    username: string
    fullName: string
    avatar: string
    backgroundImage: string
    bio: string
    status: string
}


export interface UpdateProfileRequest {
    userId: string,
    fullName: string,
    bio: string,
    status: string,
    avatar: FileUploadResult | null,
    backgroundImage: FileUploadResult | null,
}
