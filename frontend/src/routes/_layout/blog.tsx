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
} from "@chakra-ui/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { z } from "zod"
import { useTranslation } from "react-i18next"

import { BlogService } from "../../client"
import AddPost from "../../components/Blog/AddPost"
import ActionsMenu from "../../components/Common/ActionsMenu.tsx"
import Navbar from "../../components/Common/Navbar"
import { PaginationFooter } from "../../components/Common/PaginationFooter.tsx"
import ImageGallery from "../../components/Modals/ModalImageGallery"
import ExpandableTd from "../../components/Modals/ModalContent";


const postsSearchSchema = z.object({
  page: z.number().catch(1),
})

export const Route = createFileRoute("/_layout/blog")({
  component: Post,
  validateSearch: (search) => postsSearchSchema.parse(search),
})

const PER_PAGE = 7

function gePostQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      BlogService.readPosts({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["posts", { page }],
  }
}

function PostTable() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { page } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const setPage = (page: number) =>
    navigate({
      // @ts-ignore
      search: (prev: { [key: string]: string }) => ({ ...prev, page }),
    })

  const {
    data: posts,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...gePostQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  })

  const hasNextPage = !isPlaceholderData && Array.isArray(posts?.Data) && posts.Data.length === PER_PAGE;
  const hasPreviousPage = page > 1

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(gePostQueryOptions({ page: page + 1 }))
    }
  }, [page, queryClient, hasNextPage])

  return (
    <>
      <TableContainer>
        <Table size={{ base: "sm", md: "md" }}>
          <Thead>
            <Tr>
              <Th>{t("blog.position")}</Th>
              <Th>{t("blog.title")}</Th>
              <Th>{t("blog.content")}</Th>
              <Th>{t("blog.images")}</Th>
              <Th>{t("blog.status")}</Th>
              <Th>{t("blog.actions")}</Th>
            </Tr>
          </Thead>
          {isPending ? (
            <Tbody>
              <Tr>
                {new Array(7).fill(null).map((_, index) => (
                  <Td key={index}>
                    <SkeletonText noOfLines={1} paddingBlock="16px" />
                  </Td>
                ))}
              </Tr>
            </Tbody>
          ) : (
              <Tbody>
                {Array.isArray(posts?.Data) && posts.Data.length > 0 ? (
                    posts.Data.map((post) => (
                        <Tr key={post.ID} opacity={isPlaceholderData ? 0.5 : 1}>
                          <Td>{post.position}</Td>
                          {/*<Td>{post.ID}</Td>*/}
                          <ExpandableTd content={post.title} />
                          <ExpandableTd content={post.content} />

                          <Td>
                            <ImageGallery images={Array.isArray(post.images) ? post.images : post.images ? [post.images] : []}
                                          title={post.title}
                                          numberOfImages={1}
                            />
                          </Td>
                          <Td>
                            <Flex gap={2}>
                              <Box width="12px" height="12px" borderRadius="full" bg={post.status ? "green.500" : "red.500"} />
                              {post.status ? t("blog.active") : t("blog.inactive")}
                            </Flex>
                          </Td>
                          <Td>
                            <ActionsMenu type={"Post"} value={post} />
                          </Td>
                        </Tr>
                    ))
                ) : (
                    <Tr>
                      <Td colSpan={7} textAlign="center">
                        {t("blog.noPosts")}
                      </Td>
                    </Tr>
                )}
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

function Post() {
    const { t } = useTranslation()
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
        {t("blog.heading")}
      </Heading>

      <Navbar type={t("blog.buttonAdd")} addModalAs={AddPost} />
      <PostTable />
    </Container>
  )
}
