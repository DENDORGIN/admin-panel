// EditMetaModal.tsx — оновлений з отриманням динамічних мов і категорій

import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, Button
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import useCustomToast from "../../../hooks/useCustomToast";
import { ItemsService, type ItemPublic, type ItemUpdate, type ApiError } from "../../../client"
import { handleError } from "../../../utils"
import LanguageSelector from "../Selectors/LanguageSelector.tsx"
import CategorySelector from "../Selectors/CategorySelector.tsx"
import { UseAvailableLanguages } from "../../../hooks/useAvailableLanguages"
import { useAvailableCategories } from "../../../hooks/useAvailableCategories"

interface EditMetaModalProps {
    isOpen: boolean
    onClose: () => void
    item: ItemPublic
    onSuccess: () => void
}

const EditMetaModal = ({ isOpen, onClose, item, onSuccess }: EditMetaModalProps) => {
    const showToast = useCustomToast()
    const {
        control,
        handleSubmit,
        formState: { isSubmitting, errors }
    } = useForm<ItemUpdate>({
        defaultValues: {
            category: item.category,
            language: item.language,
        }
    })

    const { data: languages = [] } = UseAvailableLanguages()
    const { data: categories = [] } = useAvailableCategories()

    const mutation = useMutation({
        mutationFn: (data: ItemUpdate) => ItemsService.updateItem(item.ID, data),
        onSuccess: () => {
            showToast("Success", "Category & Language updated", "success")
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
                <ModalHeader>Edit Category & Language</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <CategorySelector
                        control={control}
                        name="category"
                        error={errors.category}
                        options={categories}
                    />

                    <LanguageSelector
                        control={control}
                        name="language"
                        error={errors.language}
                        options={languages}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button type="submit" variant="primary" isLoading={isSubmitting} colorScheme="blue">Save</Button>
                    <Button onClick={onClose} ml={3}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default EditMetaModal
