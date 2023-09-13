export interface UserAsset {
    id: number
    url: string
    filename: string
    contentType: string
}

export interface FileUploadResult {
    bucket: string
    key: string
    uri: string
    fileName: string
    size: number
    contentType: string
}

export interface AttachmentDto {
    id: number
    url: string
    filename: string
    contentType: string
}

export interface PreSignedUrlResult {
    url: string
    bucket: string
    key: string
    fileUrl: string
}
