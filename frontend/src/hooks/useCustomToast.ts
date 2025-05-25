import { useToast } from "@chakra-ui/react"
import { useCallback } from "react"

const useCustomToast = () => {
  const toast = useToast()

  return useCallback(
    (title: string, description: string, status: "success" | "error") => {

      // Відтворюємо звук
      const audio = new Audio("/assets/sounds/notification.wav")
      audio.play().catch((e) => {
        console.warn("🔇 Не вдалося відтворити звук:", e)
      })
      toast({
        title,
        description,
        status,
        isClosable: true,
        duration: 5000,
        position: "bottom-right",
      })
    },
    [toast],
  )

}

export default useCustomToast
