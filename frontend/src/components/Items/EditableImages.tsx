import {
    Box,
    Button,
    Card,
    FormLabel,
    IconButton,
    Input,
    List,
    ListItem
} from "@chakra-ui/react"
import { CloseIcon } from "@chakra-ui/icons"
import { useRef, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MediaService, ApiError } from "../../client"
import { handleError } from "../../utils.ts"
import useCustomToast from "../../hooks/useCustomToast.ts";

interface EditableImagesProps {
    itemId: string
    initialImages: string[]
    onImagesUpdated?: () => void
}

interface FileDetail {
    name: string
    size: string
    file: File
    preview: string
}

const EditableImages = ({ itemId, initialImages, onImagesUpdated }: EditableImagesProps) => {
    const queryClient = useQueryClient()
    const showToast = useCustomToast()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [existingImages, setExistingImages] = useState(initialImages)
    const [files, setFiles] = useState<FileDetail[]>([])

    const handleFileButtonClick = () => fileInputRef.current?.click()

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const selected = Array.from(e.target.files).map((file) => ({
            name: file.name,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            file,
            preview: URL.createObjectURL(file)
        }))
        setFiles((prev) => [...prev, ...selected])
    }

    const handleRemoveFile = (index: number) => {
        const newFiles = [...files]
        URL.revokeObjectURL(newFiles[index].preview)
        newFiles.splice(index, 1)
        setFiles(newFiles)
    }

    const handleDeleteImage = async (imageUrl: string) => {
        try {
            await MediaService.deleteImage(itemId, imageUrl)
            setExistingImages((prev) => prev.filter((img) => img !== imageUrl))
            showToast( "Success", "Image deleted",  "success")
            onImagesUpdated?.()
        } catch (err) {
            handleError(err as ApiError, showToast)
        }
    }

    const uploadMutation = useMutation({
        mutationFn: async () => {
            if (files.length === 0) return
            const formData = new FormData()
            files.forEach((f) => formData.append("files", f.file))
            await MediaService.downloadImages(itemId, formData)
            onImagesUpdated?.()
        },
        onSuccess: () => {
            showToast( "Success", "Images uploaded",  "success")
            queryClient.invalidateQueries({ queryKey: ["item", itemId] })
            setFiles([])
        },
        onError: (err) => handleError(err as ApiError, showToast)
    })

    return (
        <Box>
            <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={onFileChange}
                hidden
            />
            <Button mt={2} onClick={handleFileButtonClick}>Upload Images</Button>

            <Card mt={3}>
                <List spacing={2}>
                    {files.map((file, i) => (
                        <ListItem key={i} display="flex" justifyContent="space-between">
                            <Box display="flex" alignItems="center" gap={2}>
                                <img src={file.preview} width="50" height="50" />
                                {file.name} - {file.size}
                            </Box>
                            <IconButton
                                icon={<CloseIcon />}
                                aria-label="Remove file"
                                size="sm"
                                onClick={() => handleRemoveFile(i)}
                            />
                        </ListItem>
                    ))}
                </List>
            </Card>

            {files.length > 0 && (
                <Button mt={3} variant="primary" onClick={() => uploadMutation.mutate()}>
                    Upload
                </Button>
            )}

            {existingImages.length > 0 && (
                <Box mt={4}>
                    <FormLabel>Existing Images</FormLabel>
                    <Box display="grid" gridTemplateColumns="repeat(auto-fill, 100px)" gap={4}>
                        {existingImages.map((img, i) => (
                            <Box key={i} position="relative">
                                <img src={img} width="100" height="100" style={{ borderRadius: 5 }} />
                                <IconButton
                                    icon={<CloseIcon />}
                                    aria-label="Remove existing image"
                                    position="absolute"
                                    top="5px"
                                    right="5px"
                                    size="xs"
                                    onClick={() => handleDeleteImage(img)}
                                />
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}
        </Box>
    )
}

export default EditableImages
