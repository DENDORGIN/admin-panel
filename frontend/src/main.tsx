// Polyfill for 'global' object in browser environments
if (typeof global === "undefined") {
  window.global = window
}

import { ChakraProvider } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider, createRouter } from "@tanstack/react-router"
// @ts-ignore
import ReactDOM from "react-dom/client"
import { routeTree } from "./routeTree.gen"

import { StrictMode } from "react"
import { OpenAPI } from "./client"
import theme from "./theme"

import "./i18n"


// @ts-ignore
OpenAPI.BASE = import.meta.env.VITE_API_DOMAIN

OpenAPI.TOKEN = async () => {
  return localStorage.getItem("access_token") || ""
}



const queryClient = new QueryClient()

// @ts-ignore
const router = createRouter({ routeTree })
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

// Get the root container from the document
const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Failed to find the root element")

// Create a React root instance and render your application
ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ChakraProvider>
  </StrictMode>,
)
