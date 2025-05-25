import {
  Badge,
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
  useColorModeValue,
} from "@chakra-ui/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { z } from "zod"
import { useTranslation } from "react-i18next"

import { type UserPublic, UsersService } from "../../client"
import AddUser from "../../components/Admin/AddUser"
import ActionsMenuItems from "../../components/Common/ActionsMenu.tsx"
import Navbar from "../../components/Common/Navbar"
import { PaginationFooter } from "../../components/Common/PaginationFooter.tsx"

const usersSearchSchema = z.object({
  page: z.number().catch(1),
})

export const Route = createFileRoute("/_layout/admin")({
  component: Admin,
  validateSearch: (search) => usersSearchSchema.parse(search),
})

const PER_PAGE = 10

function getUsersQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
        UsersService.readUsers({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["users", { page }],
  }
}

function UsersTable() {
  const hoverBg = useColorModeValue("gray.50", "gray.700")
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])
  const { page } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const { t } = useTranslation()

  const setPage = (page: number) =>
      navigate({
        // @ts-ignore
        search: (prev: { [key: string]: string }) => ({ ...prev, page }),
      })

  const {
    data: users,
    isPending,
    isPlaceholderData,
  } = useQuery({
    ...getUsersQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  })

  const hasNextPage = !isPlaceholderData && users?.data.length === PER_PAGE
  const hasPreviousPage = page > 1

  useEffect(() => {
    if (hasNextPage) {
      queryClient.prefetchQuery(getUsersQueryOptions({ page: page + 1 }))
    }
  }, [page, queryClient, hasNextPage])

  return (
      <>
        <TableContainer>
          <Table size={{ base: "sm", md: "md" }}>
            <Thead>
              <Tr>
                <Th width="20%">{t("admin.fullName")}</Th>
                <Th width="20%" isTruncated>
                  {t("admin.acronym")}</Th>
                <Th width="50%">{t("admin.email")}</Th>
                <Th width="10%">{t("admin.role")}</Th>
                <Th width="10%">{t("admin.status")}</Th>
                <Th width="10%">{t("admin.actions")}</Th>
              </Tr>
            </Thead>
            {isPending ? (
                <Tbody>
                  <Tr>
                    {new Array(5).fill(null).map((_, index) => (
                        <Td key={index}>
                          <SkeletonText noOfLines={1} paddingBlock="16px" />
                        </Td>
                    ))}
                  </Tr>
                </Tbody>
            ) : (
                <Tbody>
                  {users?.data.map((user) => (
                      <Tr
                          key={user.ID}
                          opacity={isPlaceholderData ? 0.5 : 1}
                          cursor="pointer"
                          _hover={{ bg: hoverBg }}
                          onClick={() =>
                              navigate({
                                to: "/user/$userId",
                                params: { userId: user.ID },
                              })
                          }
                      >
                        <Td
                            color={!user.fullName ? "ui.dim" : "inherit"}
                            isTruncated
                            maxWidth="150px"
                        >
                          {user.fullName || t("admin.noName")}
                          {currentUser?.ID === user.ID && (
                              <Badge ml="1" colorScheme="teal">
                                You
                              </Badge>
                          )}
                        </Td>
                        <Td isTruncated maxWidth="150px">
                          {user.acronym}
                        </Td>

                        <Td isTruncated maxWidth="150px">
                          {user.email}
                        </Td>
                        <Td>
                          {user.isSuperUser
                              ? t("admin.superUser")
                              : user.isAdmin
                                  ? t("admin.admin")
                                  : t("admin.user")}
                        </Td>
                        <Td>
                          <Flex gap={2}>
                            <Box
                                w="2"
                                h="2"
                                borderRadius="50%"
                                bg={user.isActive ? "ui.success" : "ui.danger"}
                                alignSelf="center"
                            />
                            {user.isActive ? t("admin.active") : t("admin.inactive")}
                          </Flex>
                        </Td>
                        <Td onClick={(e) => e.stopPropagation()}>
                          <ActionsMenuItems
                              type="User"
                              value={user}
                              disabled={currentUser?.ID === user.ID}
                          />
                        </Td>
                      </Tr>
                  ))}
                </Tbody>
            )}
          </Table>
        </TableContainer>
        <PaginationFooter
            onChangePage={setPage}
            page={page}
            hasNextPage={hasNextPage}
            hasPreviousPage={hasPreviousPage}
        />
      </>
  )
}

function Admin() {
  const { t } = useTranslation()
  return (
      <Container maxW="full">
        <Heading size="lg" textAlign={{ base: "center", md: "left" }} pt={12}>
          {t("admin.heading")}
        </Heading>

        <Navbar type={t("admin.buttonUser")} addModalAs={AddUser} />
        <UsersTable />
      </Container>
  )
}
