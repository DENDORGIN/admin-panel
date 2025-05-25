import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Button, FormControl, FormLabel, Input
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import { type ItemUpdate, ItemsService, type ApiError, type ItemPublic } from "../../../client"
import { handleError } from "../../../utils"
import useCustomToast from "../../../hooks/useCustomToast";

interface EditUrlModalProps {
    isOpen: boolean
    onClose: () => void
    item: ItemPublic
    onSuccess: () => void
}

const EditUrlModal = ({ isOpen, onClose, item, onSuccess }: EditUrlModalProps) => {
    const showToast = useCustomToast()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<ItemUpdate>({
        defaultValues: { item_url: item.item_url }
    })

    const mutation = useMutation({
        mutationFn: (data: ItemUpdate) => ItemsService.updateItem(item.ID, data),
        onSuccess: () => {
            showToast("Success", "Url updated", "success" )
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
                <ModalHeader>Edit Url product</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isInvalid={!!errors.item_url} isRequired>
                        <FormLabel>Url</FormLabel>
                        <Input {...register("item_url", { required: "Url is required" })} />
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

export default EditUrlModal
