import {
    AbsoluteCenter,
    Box,
    Button, Divider,
    Flex, IconButton,
    Input,
    Table,
    Tbody,
    Td,
    Tr,
} from "@chakra-ui/react"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type ApiError, PropertyService} from "../../client"
import { handleError } from "../../utils";
import useCustomToast from "../../hooks/useCustomToast";
import {EditIcon} from "@chakra-ui/icons";
import { useTranslation } from "react-i18next"

type EditablePropertiesProps = {
    propertyId: string
    property: Record<string, string>
    onSuccess?: () => void
    onError?: (err: ApiError) => void
    bgColor: string
}





const EditableProperties = ({ propertyId, property, onSuccess, onError, bgColor }: EditablePropertiesProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const { t } = useTranslation()

    const getEditableProps = (props: Record<string, string>) => {
        return Object.fromEntries(
            Object.entries(props).filter(([key]) => key !== "ID" && key !== "content_id")
        )
    }

    const [editedProps, setEditedProps] = useState<Record<string, string>>(
        getEditableProps(property)
    )

    const showToast = useCustomToast()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (data: Record<string, string>) =>
            PropertyService.UpdateProperties(propertyId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["property", propertyId] })
            setIsEditing(false)
            onSuccess?.()
            showToast("Success!", t("properties.success"), "success")
        },
        onError: (err) => {
            if (
                typeof err === "object" &&
                err !== null &&
                "status" in err &&
                "body" in err
            ) {
                handleError(err as ApiError, showToast)
                onError?.(err as ApiError)
            } else {
                showToast("Error", t("properties.error"), "error")
            }
        }
    })

    const handleChange = (key: string, value: string) => {
        setEditedProps((prev) => ({ ...prev, [key]: value }))
    }

    const handleCancel = () => {
        setEditedProps(getEditableProps(property))
        setIsEditing(false)
    }

    const handleSave = () => {
        mutation.mutate(editedProps)
    }

    return (
        <Box mt={4}>
            <Flex justify="space-between" align="center" mb={2}>
                <Box flex="1" position="relative">
                    <Divider />
                    <AbsoluteCenter bg={bgColor} fontWeight="bold" px="4">
                        {t("properties.title")}
                    </AbsoluteCenter>
                </Box>
                {isEditing ? (
                    <Flex gap={2}>
                        <Button size="sm" variant="primary" onClick={handleSave} isLoading={mutation.isPending}>
                            {t("properties.save")}
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                            {t("properties.cancel")}
                        </Button>
                    </Flex>
                ) : (
                    <IconButton
                        icon={<EditIcon />}
                        size="sm"
                        color="orange.500"
                        ml={4}
                        aria-label={t("properties.edit")}
                        onClick={() => setIsEditing(true)}
                    />
                )}
            </Flex>

            <Table size="sm" variant="simple">
                <Tbody>
                    {Object.entries(editedProps).map(([key, value]) => (
                        <Tr key={key}>
                            <Td fontWeight="semibold" w="40%">
                                {t(`properties.keys.${key}`, { defaultValue: key })}
                            </Td>
                            <Td>
                                {isEditing ? (
                                    <Input
                                        size="sm"
                                        value={value}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                    />
                                ) : (
                                    value
                                )}
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    )
}

export default EditableProperties