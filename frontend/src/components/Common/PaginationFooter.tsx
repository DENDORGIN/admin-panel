import { Button, Flex } from "@chakra-ui/react"
import { useTranslation } from "react-i18next"


type PaginationFooterProps = {
  hasNextPage?: boolean
  hasPreviousPage?: boolean
  onChangePage: (newPage: number) => void
  page: number
}

export function PaginationFooter({
  hasNextPage,
  hasPreviousPage,
  onChangePage,
  page,
}: PaginationFooterProps) {
    const { t } = useTranslation()
  return (
    <Flex
      gap={4}
      alignItems="center"
      mt={4}
      direction="row"
      justifyContent="flex-end"
    >
      <Button
        onClick={() => onChangePage(page - 1)}
        isDisabled={!hasPreviousPage || page <= 1}
      >
        {t("pagination.previous")}
      </Button>
      <span>{t("pagination.page")} {page}</span>
      <Button isDisabled={!hasNextPage} onClick={() => onChangePage(page + 1)}>
        {t("pagination.next")}
      </Button>
    </Flex>
  )
}
