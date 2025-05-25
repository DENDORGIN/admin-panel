import {
  Box,
  Container,
  Flex,
  Heading,
  SkeletonText,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Badge,
  useColorModeValue,
  Select
} from "@chakra-ui/react"
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { z } from "zod"

import { ItemsService } from "../../client"
import ActionsMenu from "../../components/Common/ActionsMenu.tsx"
import Navbar from "../../components/Common/Navbar"
import { PaginationFooter } from "../../components/Common/PaginationFooter.tsx"
import AddItem, { type AddItemProps } from "../../components/Items/AddItem"
import ImageGallery from "../../components/Modals/ModalImageGallery.tsx"
import SearchInput from "../../components/Common/SearchInput"
import { UseAvailableLanguages } from "../../hooks/useAvailableLanguages.ts"
import { useTranslation } from "react-i18next"


const itemsSearchSchema = z.object({
  page: z.number().catch(1),
})

export const Route = createFileRoute("/_layout/items")({
  component: Items,
  validateSearch: (search) => itemsSearchSchema.parse(search),
})

const PER_PAGE = 7

interface ItemsTableProps {
  language: string // Визначення типу для 'language'
}

interface ItemsQueryOptions {
  page: number
  language: string
}

function getItemsQueryOptions({ page, language }: ItemsQueryOptions) {
  return {
    queryFn: () =>
      ItemsService.readItems({
        language,
        skip: (page - 1) * PER_PAGE,
        limit: PER_PAGE,
      }),
    queryKey: ["items", language, { page }],
  }
}


function ItemsTable({ language }: ItemsTableProps) {
  const queryClient = useQueryClient()
  const hoverBg = useColorModeValue("gray.50", "gray.700")
  const { t } = useTranslation()

  const { page } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const setPage = (page: number) =>
    navigate({
      // @ts-ignore
      search: (prev: { [key: string]: string }) => ({ ...prev, page }),
    })

  const {
    data: items,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...getItemsQueryOptions({ page, language }),
    placeholderData: (prevData) => prevData,
  })

  const hasNextPage = !isPlaceholderData && Array.isArray(items?.Data) && items.Data.length === PER_PAGE
  const hasPreviousPage = page > 1

  useEffect(() => {
    if (Array.isArray(items?.Data)) {
      console.log("Loaded product Data:", items.Data);
    }
    if (hasNextPage) {
      queryClient.prefetchQuery(
          getItemsQueryOptions({ page: page + 1, language }),
      );
    }
  }, [page, queryClient, hasNextPage, language]);

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")


  const filteredItems = (items?.Data || []).filter((item) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
        item.title.toLowerCase().includes(query) ||
        (item.category?.toLowerCase() || "").includes(query)

    const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory

    return matchesSearch && matchesCategory
  })


  const categories = Array.from(
      new Set((items?.Data || []).map((item) => item.category).filter(Boolean))
  )

  return (
    <>
      <Flex justify="flex-end" mb={4} gap={4} flexWrap="wrap">
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
        <Select
            placeholder={t("items.allCategories")}
            w={{ base: "100%", sm: "200px" }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
          ))}
        </Select>
      </Flex>


      <TableContainer >
        <Table size={{ base: "sm", md: "md" }} fontSize="sm">
          <Thead>
            <Tr>
              <Th>{t("items.position")}</Th>
              <Th>{t("items.title")}</Th>
              <Th>{t("items.images")}</Th>
              <Th>{t("items.category")}</Th>
              <Th>{t("items.price")}</Th>
              <Th>{t("items.quantity")}</Th>
              <Th>{t("items.status")}</Th>
              <Th>{t("items.actions")}</Th>
            </Tr>
          </Thead>
          {isPending ? (
            <Tbody>
              <Tr>
                {new Array(9).fill(null).map(
                  (
                    _,
                    index, // Adjust array length to match column count
                  ) => (
                    <Td key={index}>
                      <SkeletonText noOfLines={1} paddingBlock="16px" />
                    </Td>
                  ),
                )}
              </Tr>
            </Tbody>
          ) : (
              <Tbody>
                {filteredItems.map((item) => {
                  const imageArray = Array.isArray(item.images)
                      ? item.images
                      : item.images
                          ? [item.images]
                          : []

                  return (
                      <Tr
                          key={item.ID}
                          opacity={isPlaceholderData ? 0.5 : 1}
                          cursor="pointer"
                          _hover={{ bg: hoverBg }}
                          onClick={() =>
                              navigate({ to: `/product/$itemId`, params: { itemId: item.ID } })
                          }
                      >
                        <Td>{item.position}</Td>

                        <Td>{item.title}</Td>

                        <Td
                            onClick={(e) => e.stopPropagation()} // 🛑 Зупиняє перехід
                        >
                          {imageArray.length > 0 ? (
                              <ImageGallery
                                  images={imageArray}
                                  title={item.title}
                                  numberOfImages={1}
                              />
                          ) : (
                              <Badge colorScheme="gray" variant="subtle">
                                {t("items.na")}
                              </Badge>
                          )}
                        </Td>

                        <Td>{item.category || t("items.noCategory")}</Td>
                        <Td>{item.price}</Td>
                        <Td>{item.quantity}</Td>

                        <Td py={1} px={2} fontSize="sm">
                          <Flex align="center" gap={1}>
                            <Box
                                w="10px"
                                h="10px"
                                borderRadius="full"
                                bg={item.status ? "green.500" : "red.500"}
                            />
                            {item.status ? t("items.active") : t("items.inactive")}
                          </Flex>
                        </Td>

                        <Td
                            onClick={(e) => e.stopPropagation()} // ⛔, щоб ActionsMenu працював
                        >
                          <ActionsMenu type={"Item"} value={item} />
                        </Td>
                      </Tr>
                  )
                })}
              </Tbody>


          )}
        </Table>
      </TableContainer>
      <PaginationFooter
        page={page}
        onChangePage={setPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />
    </>
  )
}

function Items() {
  const { data: fetchedLanguages = [], isLoading } = UseAvailableLanguages()
  const [languages, setLanguages] = useState<string[]>([])
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const { t } = useTranslation()

  useEffect(() => {
    setLanguages(fetchedLanguages)
  }, [fetchedLanguages])

  const getLanguageLabel = (code: string) => {
    switch (code) {
      case "pl": return "Polish"
      case "en": return "English"
      case "de": return "German"
      case "ua": return "Ukrainian"
      case "it": return "Italian"
      case "es": return "Spanish"
      case "fr": return "France"
      case "lv": return "Latvia"
      case "lt": return "Lithuanian"
      case "ro": return "Romanian"
      case "bg": return "Bulgarian"
      case "tr": return "Turkish"
      case "el": return "Greek"
      case "nl": return "Dutch"
      case "sv": return "Swedish"
      case "cs": return "Czech"
      case "sk": return "Slovak"
      case "hu": return "Hungarian"
      default: return code.toUpperCase()
    }
  }

  return (
      <Container maxW="full" overflow="hidden">
        <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={10} mb={4}>
          {t("items.heading")}
        </Heading>

        <Navbar
            type={t("items.buttonItem")}
            addModalAs={(props: AddItemProps) => (
                <AddItem
                    {...props}
                    onNewLanguage={(lang) => {
                      if (!languages.includes(lang)) {
                        setLanguages((prev) => [...prev, lang])
                        setActiveTabIndex(languages.length)
                      }
                    }}
                />
            )}
        />

        {isLoading ? (
            <Box p={6}>{t("items.loadingLanguages")}</Box>
        ) : languages.length === 0 ? (
            <Box p={6}>{t("items.noLanguages")}</Box>
        ) : (
            <Box w="full" overflowX="auto">
              <Tabs
                  isFitted
                  variant="enclosed"
                  index={activeTabIndex}
                  onChange={setActiveTabIndex}
              >
                <Box overflowX="auto" whiteSpace="nowrap">
                  <TabList mb="1em" minW="max-content">
                    {languages.map((lang) => (
                        <Tab key={lang} _selected={{ color: "white", bg: "#D65A17" }} flexShrink={0}>
                          {getLanguageLabel(lang)}
                        </Tab>
                    ))}
                  </TabList>
                </Box>

                <TabPanels>
                  {languages.map((lang, index) => (
                      <TabPanel key={lang}>
                        {index === activeTabIndex && <ItemsTable language={lang} />}
                      </TabPanel>
                  ))}
                </TabPanels>
              </Tabs>
            </Box>
        )}
      </Container>
  )
}


