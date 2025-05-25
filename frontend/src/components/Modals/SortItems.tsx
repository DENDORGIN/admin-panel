import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react"
import { useState } from "react"

function FilterModal({ isOpen, onClose, onFilterApply }) {
  const [category, setCategory] = useState("")
  const [language, setLanguage] = useState("")

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Filter Items</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Category Select */}
          <Select
            placeholder="Select Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Angels">Angels</option>
            <option value="Demons">Demons</option>
            <option value="Lion">Lion</option>
            {/* More options */}
          </Select>
          {/* Language Select */}
          <Select
            placeholder="Select Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="PL">PL</option>
            <option value="EN">EN</option>
            <option value="DE">DE</option>
            {/* More options */}
          </Select>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={() => onFilterApply(category, language)}
          >
            Apply Filters
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default FilterModal
