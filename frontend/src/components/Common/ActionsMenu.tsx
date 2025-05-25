import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { FiTrash } from "react-icons/fi"
import { useTranslation } from "react-i18next"


import type { ItemPublic, PostPublic, UserPublic } from "../../client"
import EditUser from "../Admin/EditUser"
import EditPost from "../Blog/EditPost"
import Delete from "./DeleteAlert"
import useAuth from "../../hooks/useAuth.ts";

interface ActionsMenuProps {
  type: "User" | "Item" | "Post"
  value: ItemPublic | PostPublic | UserPublic
  disabled?: boolean
  isDisabled?: boolean
}

const ActionsMenu = ({ type, value, disabled }: ActionsMenuProps) => {
  const { t } = useTranslation()
  const editModal = useDisclosure()
  const deleteModal = useDisclosure()
  const { user } = useAuth()

  const ownerId = "owner_id" in value ? value.owner_id : ("ID" in value ? value.ID : null)

  // Дозволяємо дію, якщо користувач — власник або суперюзер
  const isAllowed = user?.isSuperUser || user?.ID === ownerId
  const translatedType = t(`actionsMenu.types.${type}`)


  return (
      <>
        <Menu>
          <MenuButton
              isDisabled={disabled}
              as={Button}
              rightIcon={<BsThreeDotsVertical />}
              variant="unstyled"
          />
          <MenuList>
            <MenuItem
                onClick={deleteModal.onOpen}
                icon={<FiTrash fontSize="16px" />}
                color="red.500"
                isDisabled={!isAllowed}
            >
              {t("actionsMenu.delete", { type: translatedType })}
            </MenuItem>
          </MenuList>
        </Menu>

        {type === "User" && (
            <EditUser
                user={value as UserPublic}
                isOpen={editModal.isOpen}
                onClose={editModal.onClose}
            />
        )}
        {type === "Post" && (
            <EditPost
                post={value as PostPublic}
                isOpen={editModal.isOpen}
                onClose={editModal.onClose}
                isDisabled={!isAllowed}
            />
        )}

        <Delete
            type={type}
            id={("ID" in value && value.ID) ? String(value.ID) : ""}
            isOpen={deleteModal.isOpen}
            onClose={deleteModal.onClose}
            isDisabled={!isAllowed}
        />
      </>
  )
}


export default ActionsMenu
