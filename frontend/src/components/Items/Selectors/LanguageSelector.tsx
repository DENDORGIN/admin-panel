import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react"
import CreatableSelect from "react-select/creatable"
import { Controller } from "react-hook-form"
import { useReactSelectStyles } from "../../../theme/reactSelectStyles.ts"
import { useState, useMemo } from "react"

type Option = { label: string; value: string }

interface LanguageSelectorProps {
    control: any
    name: string
    error?: any
    options: string[]
    label?: string
    placeholder?: string
}

const LanguageSelector = ({
                              control,
                              name,
                              error,
                              options,
                              label = "Language",
                              placeholder = "Select or type language",
                          }: LanguageSelectorProps) => {
    const styles = useReactSelectStyles()

    const [createdOptions, setCreatedOptions] = useState<Option[]>([])

    const languageOptions: Option[] = useMemo(() => {
        const base = options.map((lang) => ({
            label: lang.toUpperCase(),
            value: lang,
        }))
        return [...base, ...createdOptions]
    }, [options, createdOptions])

    return (
        <FormControl isInvalid={!!error} mt={4}>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <Controller
                name={name}
                control={control}
                rules={{ required: "Please select or enter a language" }}
                render={({ field }) => {
                    const selectedValue =
                        languageOptions.find((opt) => opt.value === field.value) ?? null

                    return (
                        <CreatableSelect
                            {...field}
                            value={selectedValue}
                            options={languageOptions}
                            placeholder={placeholder}
                            styles={styles}
                            onChange={(val) => {
                                const newVal = val?.value.toLowerCase()
                                field.onChange(newVal)

                                const alreadyExists = languageOptions.some(
                                    (opt) => opt.value === newVal
                                )
                                if (!alreadyExists && newVal) {
                                    setCreatedOptions((prev) => [
                                        ...prev,
                                        { value: newVal, label: newVal.toUpperCase() },
                                    ])
                                }
                            }}
                            onBlur={field.onBlur}
                        />
                    )
                }}
            />
            {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
        </FormControl>
    )
}

export default LanguageSelector
