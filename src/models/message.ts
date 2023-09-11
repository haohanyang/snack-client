import { ChannelInfo } from "./channel"
import { AttachmentDto, FileUploadResult } from "./file"
import User from "./user"

export interface Message {
    id: number
    author: User
    channel: ChannelInfo
    content: string
    createdAt: string
    attachment: AttachmentDto | null
}

export interface MessageRequest {
    channel: ChannelInfo,
    authorId: string,
    content: string,
    fileUploadResult: FileUploadResult | null,
}
