import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid
} from "@chakra-ui/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type SubmitHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { type UserCreate, UsersService } from "../../client"
import type { ApiError } from "../../client"
import useCustomToast from "../../hooks/useCustomToast"
import { emailPattern, handleError } from "../../utils"

interface AddUserProps {
  isOpen: boolean
  onClose: () => void
}

interface UserCreateForm extends UserCreate {
  confirm_password: string
}

const AddUser = ({ isOpen, onClose }: AddUserProps) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const showToast = useCustomToast()
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UserCreateForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      email: "",
      fullName: "",
      acronym: "",
      password: "",
      avatar: "",
      confirm_password: "",
      isSuperUser: false,
      isAdmin: false,
      isActive: false,
    },
  })

  const mutation = useMutation({
    mutationFn: (data: UserCreate) =>
      UsersService.createUser({ requestBody: data }),
    onSuccess: () => {
      showToast("Success!", t("addUser.success"), "success")
      reset()
      onClose()
    },
    onError: (err: ApiError) => {
      handleError(err, showToast)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const onSubmit: SubmitHandler<UserCreateForm> = (data) => {
    mutation.mutate(data)
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "sm", md: "md" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>{t("addUser.title")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isRequired isInvalid={!!errors.email}>
              <FormLabel htmlFor="email">{t("addUser.email")}</FormLabel>
              <Input
                id="email"
                {...register("email", {
                  required: t("addUser.errors.emailRequired"),
                  pattern: emailPattern,
                })}
                placeholder={t("addUser.emailPlaceholder")}
                type="email"
              />
              {errors.email && (
                <FormErrorMessage>{errors.email.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4} isRequired isInvalid={!!errors.fullName}>
              <FormLabel htmlFor="name">{t("addUser.fullName")}</FormLabel>
              <Input
                id="name"
                {...register("fullName")}
                placeholder={t("addUser.fullNamePlaceholder")}
                type="text"
              />
              {errors.fullName && (
                <FormErrorMessage>{errors.fullName.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4} isRequired isInvalid={!!errors.acronym}>
              <FormLabel htmlFor="name">{t("addUser.acronym")}</FormLabel>
              <Input
                  id="name"
                  {...register("acronym")}
                  placeholder={t("addUser.acronymPlaceholder")}
                  type="text"
                  textTransform="uppercase"
                  {...register("acronym", {
                    setValueAs: (v) => v.toUpperCase() // 🔁 зберігає у верхньому регістрі
                  })}
              />
              {errors.acronym && (
                  <FormErrorMessage>{errors.acronym.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl mt={4} isRequired isInvalid={!!errors.password}>
              <FormLabel htmlFor="password">{t("addUser.password")}</FormLabel>
              <Input
                id="password"
                {...register("password", {
                  required: t("addUser.errors.passwordRequired"),
                  minLength: {
                    value: 8,
                    message: t("addUser.errors.passwordMin"),
                  },
                })}
                placeholder={t("addUser.passwordPlaceholder")}
                type="password"
              />
              {errors.password && (
                <FormErrorMessage>{errors.password.message}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              mt={4}
              isRequired
              isInvalid={!!errors.confirm_password}
            >
              <FormLabel htmlFor="confirm_password">{t("addUser.confirmPassword")}</FormLabel>
              <Input
                id="confirm_password"
                {...register("confirm_password", {
                  required: t("addUser.errors.confirmRequired"),
                  validate: (value) =>
                    value === getValues().password ||
                      t("addUser.errors.passwordMismatch"),
                })}
                placeholder={t("addUser.confirmPasswordPlaceholder")}
                type="password"
              />
              {errors.confirm_password && (
                <FormErrorMessage>
                  {errors.confirm_password.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} mt={5}>
              <FormControl>
                <Checkbox {...register("isSuperUser")} colorScheme="orange">
                  {t("addUser.isSuperUser")}
                </Checkbox>
              </FormControl>
              <FormControl>
                <Checkbox {...register("isAdmin")} colorScheme="orange">
                  {t("addUser.isAdmin")}
                </Checkbox>
              </FormControl>
              <FormControl>
                <Checkbox {...register("isActive")} colorScheme="orange">
                  {t("addUser.isActive")}
                </Checkbox>
              </FormControl>
            </SimpleGrid>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              {t("addUser.save")}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddUser
