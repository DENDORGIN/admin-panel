import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Button, FormControl, FormLabel, Input
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import {ItemsService, type ApiError, type ItemUpdate, type ItemPublic} from "../../../client"
import { handleError } from "../../../utils"
import useCustomToast from "../../../hooks/useCustomToast";

interface EditQuantityModalProps {
    isOpen: boolean
    onClose: () => void
    item: ItemPublic
    onSuccess: () => void
}

const EditQuantityModal = ({ isOpen, onClose, item, onSuccess }: EditQuantityModalProps) => {
    const showToast = useCustomToast()
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ItemUpdate>({
        defaultValues: { quantity: item.quantity },
        mode: "onBlur"
    })


    const mutation = useMutation({
        mutationFn: (data: ItemUpdate) => ItemsService.updateItem(item.ID, data),
        onSuccess: () => {
            showToast("Success", "Title quantity", "success" )
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
                <ModalHeader>Edit Quantity</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isInvalid={!!errors.quantity} isRequired>
                        <FormLabel>Quantity</FormLabel>
                        <Input
                            type="number"
                            step="0.01"
                            {...register("quantity", {
                                required: "Quantity is required",
                                valueAsNumber: true,
                                min: {
                                    value: 0,
                                    message: "Quantity cannot be negative"
                                }
                            })}
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

export default EditQuantityModal;