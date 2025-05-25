import { Box, Image, Badge } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

interface ModalImageGalleryProps {
  images: string[] // Масив посилань на зображення
  title: string // Опціональна назва
  numberOfImages: number
}

const ModalImageGallery = ({
  images: initialImages,
  title,
   numberOfImages,
}: ModalImageGalleryProps) => {
  const [images, setImages] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Синхронізуємо зображення, якщо `initialImages` змінюється
  useEffect(() => {
    setImages(initialImages || [])
  }, [initialImages])

  const openLightbox = (index: number) => {
    if (images.length > 0) {
      setCurrentIndex(index)
      setIsOpen(true)
    }
  }

  const closeLightbox = () => {
    setIsOpen(false)
  }

  return (
      <Box display="flex" flexWrap="wrap" justifyContent="left" gap="2">
          {images.slice(0, numberOfImages).map((src, index) => (
              <Box key={src} position="relative">
                  <Image
                      src={src}
                      alt={title || `Image ${index + 1}`}
                      maxW="100px"
                      maxH="100px"
                      cursor="pointer"
                      borderRadius="md"
                      onClick={() => openLightbox(index)}
                      onError={(e) => {
                          console.error("Failed to load image:", e.currentTarget.src)
                          e.currentTarget.src = "/path/to/placeholder.jpg"
                      }}
                  />
                  {index === numberOfImages - 1 && images.length > numberOfImages && (
                      <Badge
                          position="absolute"
                          top="2"
                          right="2"
                          bg="blackAlpha.700"
                          color="white"
                          borderRadius="md"
                          fontSize="0.65rem"
                          px={2}
                          zIndex={1}
                      >
                          +{images.length - numberOfImages}
                      </Badge>
                  )}
              </Box>
          ))}
      <Lightbox
        open={isOpen}
        close={closeLightbox}
        index={currentIndex}
        slides={images.map((src) => ({ src }))}
        controller={{ closeOnBackdropClick: true }}
      />
    </Box>
  )
}

export default ModalImageGallery
