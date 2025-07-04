import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  Icon,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  useBoolean,
} from "@chakra-ui/react"
import {
  Link as RouterLink,
  createFileRoute,
  redirect,
} from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"


import Logo from "/assets/images/denborgin-logo.svg"
import type { Body_login_login_access_token as AccessToken } from "../client"
import useAuth, { isLoggedIn } from "../hooks/useAuth"
import { emailPattern } from "../utils"

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({ to: "/" })
    }
  },
})

function Login() {
  const [show, setShow] = useBoolean()
  const { loginMutation, error, resetError } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccessToken & { domain: string }>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<AccessToken & { domain: string }> = async (data) => {
    if (isSubmitting) return

    resetError()


    try {
      await loginMutation.mutateAsync(data)
      console.log("✅ Login successful")
    } catch {
      // handled in useAuth
    }
  }


  return (
      <Container
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          h="100vh"
          maxW="sm"
          alignItems="stretch"
          justifyContent="center"
          gap={4}
          centerContent
      >
        <Image
            src={Logo}
            alt="Denborgin logo"
            height="auto"
            maxW="2xs"
            alignSelf="center"
            mb={4}
        />


        <FormControl id="email" isInvalid={!!errors.email || !!error}>
          <Input
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: emailPattern,
              })}
              placeholder="Email"
              type="email"
              required
          />
          {errors.email && (
              <FormErrorMessage>{errors.email.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl id="password" isInvalid={!!errors.password || !!error}>
          <InputGroup>
            <Input
                {...register("password", {
                  required: "Password is required",
                })}
                type={show ? "text" : "password"}
                placeholder="Password"
                required
            />
            <InputRightElement color="ui.dim" _hover={{ cursor: "pointer" }}>
              <Icon
                  as={show ? ViewOffIcon : ViewIcon}
                  onClick={setShow.toggle}
                  aria-label={show ? "Hide password" : "Show password"}
              />
            </InputRightElement>
          </InputGroup>
          {errors.password && (
              <FormErrorMessage>{errors.password.message}</FormErrorMessage>
          )}
          {error && <FormErrorMessage>{error}</FormErrorMessage>}
        </FormControl>

        <Link as={RouterLink} to="/recover-password" color="blue.500">
          Forgot password?
        </Link>

        <Button variant="primary" type="submit" isLoading={isSubmitting}>
          Log In
        </Button>

        <Text>
          Don't have an account?{" "}
          <Link as={RouterLink} to="/signup" color="blue.500">
            Sign up
          </Link>
        </Text>


      </Container>
  )
}

export default Login


