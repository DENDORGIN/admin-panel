import {
    Box,
    Container,
    Divider,
    Flex,
    Heading,
    Link,
    Spinner,
    Stack,
    Text,
    Tag,
    IconButton,
    Button,
    Collapse,
    AbsoluteCenter
} from "@chakra-ui/react"
import { useColorModeValue } from "@chakra-ui/react"
import { EditIcon, CloseIcon, ExternalLinkIcon } from "@chakra-ui/icons"
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import {type ApiError, ItemsService} from "../../../client"
import { ArrowBackIcon } from "@chakra-ui/icons"
import { useNavigate } from "@tanstack/react-router"
import ImageGallery from "../../../components/Modals/ModalImageGallery.tsx";
import DOMPurify from "dompurify";
import React, { useState } from "react";
import EditableProperties from "../../../components/Items/EditableProperties.tsx"
import EditableImages from "../../../components/Items/EditableImages"
import EditTitleModal from "../../../components/Items/Modals/EditTitleModal.tsx"
import EditContentModal from "../../../components/Items/Modals/EditContentModal.tsx"
import EditPriceModal from "../../../components/Items/Modals/EditPriceModal.tsx"
import EditQuantityModal from "../../../components/Items/Modals/EditQuantityModal.tsx";
import EditPositionModal from "../../../components/Items/Modals/EditPositionModal.tsx"
import EditUrlModal from "../../../components/Items/Modals/EditUrlModal.tsx"
import ItemStatusSwitch from "../../../components/Items/ItemStatusSwitch"
import EditMetaModal from "../../../components/Items/Modals/EditMetaModal"

import { useTranslation } from "react-i18next"



export const Route = createFileRoute("/_layout/product/$itemId")({
    component: ItemDetails,
})

// Компонент для відображення HTML-контенту
interface SafeHtmlComponentProps {
    htmlContent: string; // Вказуємо, що це рядок
}

const SafeHtmlComponent: React.FC<SafeHtmlComponentProps> = ({ htmlContent }) => {
    return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} />;
};

function ItemDetails() {
    const { itemId } = Route.useParams()
    const { t } = useTranslation()
    const navigate = useNavigate()

    const [isEditingImages, setIsEditingImages] = useState(false)
    const [isEditingTitle, setIsEditingTitle] = useState(false)

    const [isEditingContent, setIsEditingContent] = useState(false)
    const [showFullContent, setShowFullContent] = useState(false)

    const [isEditingPrice, setIsEditingPrice] = useState(false)
    const [isEditingQuantity, setIsEditingQuantity] = useState(false)
    const [isEditingUrl, setIsEditingUrl] = useState(false)
    const [isEditingPosition, setIsEditingPosition] = useState(false)
    const [isEditingMeta, setIsEditingMeta] = useState(false)

    const contentBg = useColorModeValue("white", "#1A202C")

    const { data: item, isLoading, error, refetch: refetchItem } = useQuery({
        queryKey: ["item", itemId],
        queryFn: () => ItemsService.readItemById({ id: itemId }),
        enabled: !!itemId
    })


    const getCurrencySymbol = (lang: string) => {
        switch (lang) {
            case "pl":
                return "zł"
            case "ua":
                return "грн"
            case "en":
                return "$"
            case "de":
                return "€"
            case "fr":
                return "€"
            default:
                return ""
        }
    }


    if (isLoading)
        return (
            <Flex justify="center" align="center" h="50vh">
                <Spinner size="xl" />
            </Flex>
        )

    if (!item || error)
        return <Text textAlign="center">{t("product.notFound")}</Text>

    const imageArray = Array.isArray(item.images)
        ? item.images
        : item.images
            ? [item.images]
            : []


    return (
        <Container maxW="4xl" py={8}>
            <Link
                onClick={() => navigate({ to: "/items" })}
                color="blue.500"
                fontWeight="medium"
                mb={4}
                display="inline-flex"
                alignItems="center"
                px={10}
            >
                <ArrowBackIcon mr={2} />
                {t("product.backToList")}
            </Link>

            <Flex justify="space-between" align="center" mb={1}>
                <Box flex="1" position="relative">
                    <Divider />
                    <AbsoluteCenter bg={contentBg} fontWeight="bold" px="4">
                        {t("product.title")}
                    </AbsoluteCenter>
                </Box>
                <IconButton
                    icon={<EditIcon />}
                    color={isEditingImages? "gray.600" : "orange.500"}
                    size="sm"
                    ml={4}
                    aria-label="Edit title"
                    onClick={() => setIsEditingTitle(true)}
                />
            </Flex>

            <Heading size="lg"  mb={2}>{item.title}</Heading>

            <EditTitleModal
                isOpen={isEditingTitle}
                onClose={() => setIsEditingTitle(false)}
                item={item}
                onSuccess={() => refetchItem()}
            />

            <Flex justify="space-between" align="center" mb={1}>
                <Text color="gray.500">
                    {t("product.category")}: {item.category || t("product.noCategory")} |{" "}
                    {t("product.language")}: {item.language?.toUpperCase()}
                </Text>
                <IconButton
                    icon={<EditIcon />}
                    size="sm"
                    aria-label="Edit meta"
                    color="orange.500"
                    onClick={() => setIsEditingMeta(true)}
                />
            </Flex>

            <EditMetaModal
                isOpen={isEditingMeta}
                onClose={() => setIsEditingMeta(false)}
                item={item}
                onSuccess={() => refetchItem()}
            />



            <Stack spacing={4}>

                <Box py={4}>
                    <Flex align="center" mb={4}>
                        <Box flex="1" position="relative">
                            <Divider />
                            <AbsoluteCenter bg={contentBg} fontWeight="bold" px="4">
                                {t("product.content")}
                            </AbsoluteCenter>
                        </Box>

                        <IconButton
                            icon={<EditIcon />}
                            size="sm"
                            color="orange.500"
                            aria-label="Edit content"
                            ml={4}
                            onClick={() => setIsEditingContent(true)}
                        />
                    </Flex>


                    <Collapse startingHeight={100} in={showFullContent}>
                        <SafeHtmlComponent htmlContent={item.content || "N/A"} />
                    </Collapse>

                    <Button
                        size="sm"
                        onClick={() => setShowFullContent(!showFullContent)}
                        mt="0.5rem"
                        variant="link"
                        colorScheme="blue"
                    >
                        {t(showFullContent ? "product.showLess" : "product.showMore")}
                    </Button>
                </Box>

                <EditContentModal
                    isOpen={isEditingContent}
                    onClose={() => setIsEditingContent(false)}
                    item={item}
                    onSuccess={() => refetchItem()}
                />

                <Box>
                    <Flex align="center" mb={4}>
                        <Box flex="1" position="relative">
                            <Divider />
                            <AbsoluteCenter bg={contentBg} fontWeight="bold" px="4">
                                {t("product.images")}
                            </AbsoluteCenter>
                        </Box>
                        <IconButton
                            icon={isEditingImages ? <CloseIcon /> : <EditIcon />}
                            color={isEditingImages ? "gray.600" : "orange.500"}
                            size="sm"
                            aria-label="Edit images"
                            ml={4}
                            onClick={() => setIsEditingImages(!isEditingImages)}
                        />
                    </Flex>

                    {/* Галерея (режим перегляду) */}
                    <Box display={isEditingImages ? "none" : "block"}>
                        <ImageGallery
                            images={imageArray}
                            title={item.title}
                            numberOfImages={imageArray.length}
                        />
                    </Box>

                    {/* Редагування зображень */}
                    <Box display={isEditingImages ? "block" : "none"}>
                        <EditableImages itemId={item.ID}
                                        initialImages={imageArray}
                                        onImagesUpdated={() => refetchItem()}/>
                    </Box>
                </Box>


                {item.property?.ID && (
                <EditableProperties
                    propertyId={item.property.ID}
                    property={item.property}
                    bgColor={contentBg}
                    onSuccess={() => console.log("Оновлено!")}
                    onError={(err: ApiError) => console.warn("Помилка редагування:", err)}
                />
                )}

                <Box>
                    <Flex justify="space-between" align="center" mb={1}>
                        <Box flex="1" position="relative">
                            <Divider />
                            <AbsoluteCenter bg={contentBg} fontWeight="bold" px="4">
                                {t("product.cost")}
                            </AbsoluteCenter>
                        </Box>
                        <IconButton
                            icon={<EditIcon />}
                            size="sm"
                            color="orange.500"
                            ml={4}
                            aria-label="Edit price"
                            onClick={() => setIsEditingPrice(true)}
                        />
                    </Flex>
                    <Tag size="lg" colorScheme="green">
                        {item.price} {getCurrencySymbol(item.language)}
                    </Tag>
                </Box>

                <EditPriceModal
                    isOpen={isEditingPrice}
                    onClose={() => setIsEditingPrice(false)}
                    item={item}
                    onSuccess={() => refetchItem()}
                />

                <Box>
                    <Flex justify="space-between" align="center" mb={1}>
                        <Box flex="1" position="relative">
                            <Divider />
                            <AbsoluteCenter bg={contentBg} fontWeight="bold" px="4">
                                {t("product.quantity")}
                            </AbsoluteCenter>
                        </Box>
                        <IconButton
                            icon={<EditIcon />}
                            size="sm"
                            color="orange.500"
                            aria-label="Edit quantity"
                            onClick={() => setIsEditingQuantity(true)}
                        />
                    </Flex>
                    <Tag
                        colorScheme={
                            item.quantity === 0
                                ? "red"
                                : item.quantity < 10
                                    ? "yellow"
                                    : "purple"
                        }
                        size="lg"
                    >
                        {item.quantity}
                    </Tag>
                </Box>


                <EditQuantityModal
                    isOpen={isEditingQuantity}
                    onClose={() => setIsEditingQuantity(false)}
                    item={item}
                    onSuccess={() => refetchItem()}
                />

                <Box>
                    <Flex justify="space-between" align="center" mb={1}>
                        <Box flex="1" position="relative">
                            <Divider />
                            <AbsoluteCenter bg={contentBg} fontWeight="bold" px="4">
                                {t("product.url")}
                            </AbsoluteCenter>
                        </Box>
                        <IconButton
                            icon={<EditIcon />}
                            size="sm"
                            color="orange.500"
                            aria-label="Edit Url"
                            onClick={() => setIsEditingUrl(true)}
                        />
                    </Flex>
                    {item.item_url ? (
                        <Link
                            href={item.item_url || "#"}
                            isExternal
                            color="blue.500"
                            textDecoration="underline"
                        >
                            {item.item_url ? formatUrl(item.item_url) : t("product.noUrl")}
                            <ExternalLinkIcon mx='4px' />
                        </Link>
                    ) : (
                        t("product.noUrl")
                    )}
                </Box>

                <EditUrlModal
                    isOpen={isEditingUrl}
                    onClose={() => setIsEditingUrl(false)}
                    item={item}
                    onSuccess={() => refetchItem()}
                />

                <Box>
                    <Flex justify="space-between" align="center" mb={1}>
                        <Box flex="1" position="relative">
                            <Divider />
                            <AbsoluteCenter bg={contentBg} fontWeight="bold" px="4">
                                {t("product.position")}
                            </AbsoluteCenter>
                        </Box>
                        <IconButton
                            icon={<EditIcon />}
                            size="sm"
                            color="orange.500"
                            aria-label="Edit price"
                            onClick={() => setIsEditingPosition(true)}
                        />
                    </Flex>
                    <Tag size="lg" colorScheme="green">
                        {item.position}
                    </Tag>
                </Box>

                <EditPositionModal
                    isOpen={isEditingPosition}
                    onClose={() => setIsEditingPosition(false)}
                    item={item}
                    onSuccess={() => refetchItem()}
                />

                <Divider />

                <ItemStatusSwitch item={item} onUpdated={() => refetchItem()} />


                <Divider />
            </Stack>
        </Container>
    )
}


function formatUrl(url: string) {
  try {
    const { hostname } = new URL(url)
    return hostname // This will display only the domain part of the URL
  } catch (error) {
    return url || "No URL" // Fallback if the URL is invalid or empty
  }
}
