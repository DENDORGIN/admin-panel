import type { ComponentType, ElementType } from "react"

import { Button, Flex, Icon, useDisclosure } from "@chakra-ui/react"
import { FaPlus } from "react-icons/fa"
import {useTranslation} from "react-i18next";

interface NavbarProps {
  type: string
  addModalAs: ComponentType | ElementType
}

const Navbar = ({ type, addModalAs }: NavbarProps) => {
  const addModal = useDisclosure()

  const AddModal = addModalAs
  const { t } = useTranslation()
  return (
    <>
      <Flex py={8} gap={4}>
        <Button
          variant="primary"
          gap={1}
          fontSize={{ base: "sm", md: "inherit" }}
          onClick={addModal.onOpen}
        >
          <Icon as={FaPlus} /> {t("admin.buttonAdd")} {type}
        </Button>
        <AddModal isOpen={addModal.isOpen} onClose={addModal.onClose} />
      </Flex>

    </>
  )
}

export default Navbar
