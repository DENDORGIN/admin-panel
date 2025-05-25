import{ MediaService } from "../client"
export async function uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append("file", file)

    try {
        const response: string = await MediaService.downloadOneImage(formData)
        if (!response) throw new Error("Upload failed")
        return response
    } catch (error) {
        throw new Error("Image upload error: " + (error as Error).message)
    }
}
