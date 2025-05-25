import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Button, FormControl, FormLabel
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { type ItemUpdate, ItemsService, type ApiError, type ItemPublic } from "../../../client"
import { handleError } from "../../../utils"
import useCustomToast from "../../../hooks/useCustomToast"
import RichTextEditor from "../../Editor/RichTextEditor.tsx";

interface EditContentModalProps {
    isOpen: boolean
    onClose: () => void
    item: ItemPublic
    onSuccess: () => void
}

const EditContentModal = ({ isOpen, onClose, item, onSuccess }: EditContentModalProps) => {
    const showToast = useCustomToast()

    const {
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<ItemUpdate>({
        defaultValues: { content: item.content }
    })

    const mutation = useMutation({
        mutationFn: (data: ItemUpdate) => ItemsService.updateItem(item.ID, data),
        onSuccess: () => {
            showToast("Success", "Content updated", "success" )
            onSuccess()
            onClose()
        },
        onError: (err: ApiError) => handleError(err, showToast)
    })

    const onSubmit = (data: ItemUpdate) => mutation.mutate(data)


    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader>Edit Content</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isInvalid={!!errors.content} isRequired>
                        <FormLabel>Content</FormLabel>
                        <RichTextEditor
                            value={watch('content') || ''}
                            onChange={(_, __, ___, editor) => {
                                setValue('content', editor.getHTML());
                            }}
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button type="submit" variant="primary" isLoading={isSubmitting}>Save</Button>
                    <Button onClick={onClose} ml={3}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditContentModal
