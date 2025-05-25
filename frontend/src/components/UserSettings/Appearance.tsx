import {
  Badge,
  Container,
  Heading,
  Radio,
  RadioGroup,
  Select,
  Stack,
  useColorMode,
} from "@chakra-ui/react"
import { useTranslation } from "react-i18next"

const Appearance = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { i18n, t } = useTranslation()

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value)
  }

  return (
      <Container maxW="full">
        <Heading size="sm" py={4}>
          {t("appearance.title", "Appearance")}
        </Heading>

        {/* Темна/світла тема */}
        <RadioGroup onChange={toggleColorMode} value={colorMode}>
          <Stack>
            <Radio value="light" colorScheme="teal">
              {t("appearance.light", "Light Mode")}
              <Badge ml="1" colorScheme="teal">
                {t("appearance.default", "Default")}
              </Badge>
            </Radio>
            <Radio value="dark" colorScheme="teal">
              {t("appearance.dark", "Dark Mode")}
            </Radio>
          </Stack>
        </RadioGroup>

        {/* Мова */}
        <Select
            onChange={handleLanguageChange}
            value={i18n.language}
            maxW="200px"
            mb={4}
            mt={4}
        >
          <option value="en">English</option>
          <option value="pl">Polski</option>
          <option value="ua">Українська</option>

        </Select>
      </Container>
  )
}

export default Appearance
