import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Button, FormControl, FormLabel, Input
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import {ItemsService, type ApiError, type ItemUpdate, type ItemPublic} from "../../../client"
import { handleError } from "../../../utils"
import useCustomToast from "../../../hooks/useCustomToast";

interface EditPriceModalProps {
    isOpen: boolean
    onClose: () => void
    item: ItemPublic
    onSuccess: () => void
}

const EditPriceModal = ({ isOpen, onClose, item, onSuccess }: EditPriceModalProps) => {
    const showToast = useCustomToast()
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ItemUpdate>({
        defaultValues: { price: item.price },
        mode: "onBlur"
    })


    const mutation = useMutation({
        mutationFn: (data: ItemUpdate) => ItemsService.updateItem(item.ID, data),
        onSuccess: () => {
            showToast("Success", "Title price", "success" )
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
                <ModalHeader>Edit Price</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl isInvalid={!!errors.price} isRequired>
                        <FormLabel>Price</FormLabel>
                        <Input
                            type="number"
                            step="0.01"
                            {...register("price", {
                                required: "Price is required",
                                valueAsNumber: true,
                                min: {
                                    value: 0,
                                    message: "Price must be 0 or greater"
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

export default EditPriceModal;