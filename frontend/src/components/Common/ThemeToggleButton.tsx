import { IconButton, useColorMode } from "@chakra-ui/react"
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggleButton = () => {
    const { colorMode, toggleColorMode } = useColorMode()

    return (
        <IconButton
            size="md"
            fontSize="lg"
            variant="ghost"
            color="orange.500"
            onClick={toggleColorMode}
            icon={colorMode === "light" ? <FaMoon /> : <FaSun />}
            aria-label="Toggle color mode"
        />
    )
}

export default ThemeToggleButton
