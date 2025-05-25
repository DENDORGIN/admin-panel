import {
    Input,
    InputGroup,
    InputLeftElement,
    Icon,
} from "@chakra-ui/react"
import { FaSearch } from "react-icons/fa"
import { useTranslation } from "react-i18next"

interface SearchInputProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

const SearchInput = ({ value, onChange }: SearchInputProps) => {
    const { t } = useTranslation()
    return (
        <InputGroup w={{ base: "100%", md: "auto" }}>
            <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="ui.dim" />
            </InputLeftElement>
            <Input
                type="text"
                placeholder={t("items.searchPlaceholder")}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                fontSize={{ base: "sm", md: "inherit" }}
                borderRadius="8px"
            />
        </InputGroup>
    )
}

export default SearchInput
