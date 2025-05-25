import { Container, Heading } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"
import { z } from "zod"
import Calendar from "../../components/Calendar/Calendar.tsx"

const AdminCalendar = () => {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} py={12}>
        Calendar
      </Heading>
      <Calendar />
    </Container>
  )
}

const calendarSearchSchema = z.object({
  page: z.number().catch(1),
})
// Додаємо експорт Route (якщо це потрібно для маршрутизації)
export const Route = createFileRoute("/_layout/calendar")({
  component: AdminCalendar,
  validateSearch: (search) => calendarSearchSchema.parse(search),
})
