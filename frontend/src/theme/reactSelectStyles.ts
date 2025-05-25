import { useColorModeValue } from "@chakra-ui/react"

export const useReactSelectStyles = () => {
    const bgColor = useColorModeValue("white", "#2D3748") // gray.700
    const textColor = useColorModeValue("black", "white")
    const borderColor = useColorModeValue("#CBD5E0", "#4A5568") // gray.300 / gray.600
    const placeholderColor = useColorModeValue("#A0AEC0", "#718096") // gray.400 / gray.500

    return {
        control: (provided: any) => ({
            ...provided,
            backgroundColor: bgColor,
            color: textColor,
            borderColor: borderColor,
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: textColor,
        }),
        menu: (provided: any) => ({
            ...provided,
            backgroundColor: bgColor,
            color: textColor,
        }),
        option: (provided: any, state: any) => ({
            ...provided,
            backgroundColor: state.isFocused ? borderColor : bgColor,
            color: textColor,
        }),
        placeholder: (provided: any) => ({
            ...provided,
            color: placeholderColor,
        }),
    }
}
