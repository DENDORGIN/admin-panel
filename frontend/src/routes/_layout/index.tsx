import { Box, Container, Text } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import useAuth from "../../hooks/useAuth"

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
})

function Dashboard() {
  const { user: currentUser } = useAuth()
  const { t } = useTranslation()

  const name = currentUser?.fullName || currentUser?.email || "user"

  return (
      <Container maxW="full">
        <Box pt={12} m={4}>
          <Text fontSize="2xl">{t("dashboard.greeting", { name })}</Text>
          <Text>{t("dashboard.welcome")}</Text>
        </Box>
      </Container>
  )
}
