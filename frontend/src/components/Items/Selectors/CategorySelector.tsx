import { useState, useMemo } from "react"
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
} from "@chakra-ui/react"
import CreatableSelect from "react-select/creatable"
import { Controller } from "react-hook-form"
import { useReactSelectStyles } from "../../../theme/reactSelectStyles.ts"

type Option = { label: string; value: string }

interface CategorySelectorProps {
    control: any
    name: string
    error?: any
    options: string[]
    label?: string
    placeholder?: string
}

const normalizeLabel = (label: string) =>
    label
        .trim()
        .toLowerCase()
        .replace(/^\w/, (c) => c.toUpperCase())

const CategorySelector = ({
                              control,
                              name,
                              error,
                              options,
                              label = "Category",
                              placeholder = "Select or create category",
                          }: CategorySelectorProps) => {
    const styles = useReactSelectStyles()
    const [createdOptions, setCreatedOptions] = useState<Option[]>([])

    const categoryOptions: Option[] = useMemo(() => {
        const base = options.map((cat) => ({
            label: normalizeLabel(cat),
            value: cat,
        }))
        return [...base, ...createdOptions]
    }, [options, createdOptions])

    return (
        <FormControl isInvalid={!!error} mt={4}>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <Controller
                name={name}
                control={control}
                rules={{ required: "Please select or enter a category" }}
                render={({ field }) => {
                    const selectedValue =
                        categoryOptions.find((opt) => opt.value === field.value) ?? null

                    return (
                        <CreatableSelect
                            {...field}
                            value={selectedValue}
                            options={categoryOptions}
                            placeholder={placeholder}
                            styles={styles}
                            formatCreateLabel={(val) =>
                                `Create "${normalizeLabel(val)}"`
                            }
                            onChange={(val) => {
                                const newVal = val?.value.trim()
                                field.onChange(newVal)

                                const alreadyExists = categoryOptions.some(
                                    (opt) => opt.value === newVal
                                )
                                if (!alreadyExists && newVal) {
                                    setCreatedOptions((prev) => [
                                        ...prev,
                                        {
                                            value: newVal,
                                            label: normalizeLabel(newVal),
                                        },
                                    ])
                                }
                            }}
                            onBlur={field.onBlur}
                        />
                    )
                }}
            />
            {error && (
                <FormErrorMessage>{error.message}</FormErrorMessage>
            )}
        </FormControl>
    )
}

export default CategorySelector
