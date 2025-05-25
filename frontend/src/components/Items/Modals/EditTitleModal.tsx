import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Button, FormControl, FormLabel, Input
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { type ItemUpdate, ItemsService, type ApiError, type ItemPublic } from "../../../client"
import { handleError } from "../../../utils"
import useCustomToast from "../../../hooks/useCustomToast";

interface EditTitleModalProps {
    isOpen: boolean
    onClose: () => void
    item: ItemPublic
    onSuccess: () => void
}

const EditTitleModal = ({ isOpen, onClose, item, onSuccess }: EditTitleModalProps) => {
    const showToast = useCustomToast()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<ItemUpdate>({
        defaultValues: { title: item.title }
    })

    const mutation = useMutation({
        mutationFn: (data: ItemUpdate) => ItemsService.updateItem(item.ID, data),
        onSuccess: () => {
            showToast("Success", "Title updated", "success" )
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
                <ModalHeader>Edit Title</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isInvalid={!!errors.title} isRequired>
                        <FormLabel>Title</FormLabel>
                        <Input {...register("title", { required: "Title is required" })} />
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

export default EditTitleModal
