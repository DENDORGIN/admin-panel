import {
  Box,
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  useColorModeValue,
} from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"

import { type ApiError, type UpdatePassword, UsersService } from "../../client"
import useCustomToast from "../../hooks/useCustomToast"
import { confirmPasswordRules, handleError, passwordRules } from "../../utils"
import { useTranslation } from "react-i18next"

interface UpdatePasswordForm extends UpdatePassword {
  confirm_password: string
}

const ChangePassword = () => {
  const { t } = useTranslation()
  const color = useColorModeValue("inherit", "ui.light")
  const showToast = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordForm>({
    mode: "onBlur",
    criteriaMode: "all",
  })

  const mutation = useMutation({
    mutationFn: (data: UpdatePassword) =>
      UsersService.updatePasswordMe({ requestBody: data }),
    onSuccess: () => {
      showToast("Success!", t("changePassword.success"), "success")
      reset()
    },
    onError: (err: ApiError) => {
      handleError(err, showToast)
    },
  })

  const onSubmit: SubmitHandler<UpdatePasswordForm> = async (data) => {
    mutation.mutate(data)
  }

  return (
    <>
      <Container maxW="full">
        <Heading size="sm" py={4}>
          {t("changePassword.heading")}
        </Heading>
        <Box
          w={{ sm: "full", md: "50%" }}
          as="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormControl isRequired isInvalid={!!errors.currentPassword}>
            <FormLabel color={color} htmlFor="currentPassword">
              {t("changePassword.currentPassword")}
            </FormLabel>
            <Input
              id="current_password"
              {...register("currentPassword")}
              placeholder={t("changePassword.placeholder")}
              type="password"
              w="auto"
            />
            {errors.currentPassword && (
              <FormErrorMessage>
                {errors.currentPassword.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <FormControl mt={4} isRequired isInvalid={!!errors.newPassword}>
            <FormLabel htmlFor="password">{t("changePassword.newPassword")}</FormLabel>
            <Input
              id="password"
              {...register("newPassword", passwordRules())}
              placeholder={t("changePassword.placeholder")}
              type="password"
              w="auto"
            />
            {errors.newPassword && (
              <FormErrorMessage>{errors.newPassword.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mt={4} isRequired isInvalid={!!errors.confirm_password}>
            <FormLabel htmlFor="confirm_password">{t("changePassword.confirmPassword")}</FormLabel>
            <Input
              id="confirm_password"
              {...register("confirm_password", confirmPasswordRules(getValues))}
              placeholder={t("changePassword.placeholder")}
              type="password"
              w="auto"
            />
            {errors.confirm_password && (
              <FormErrorMessage>
                {errors.confirm_password.message}
              </FormErrorMessage>
            )}
          </FormControl>
          <Button
            variant="primary"
            mt={4}
            type="submit"
            isLoading={isSubmitting}
          >
            {t("changePassword.save")}
          </Button>
        </Box>
      </Container>
    </>
  )
}
export default ChangePassword
