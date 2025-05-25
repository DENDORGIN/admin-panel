import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import {
  FiBookOpen,
  FiBriefcase,
  FiCalendar,
  FiHome,
  FiSettings,
  FiUsers
} from "react-icons/fi"
import { useTranslation } from "react-i18next"

import type { UserPublic } from "../../client"

const SidebarItems = ({ onClose }: { onClose?: () => void }) => {
  const queryClient = useQueryClient()
  const textColor = useColorModeValue("ui.main", "ui.light")
  const bgActive = useColorModeValue("#F8E6E0", "#4A5568")
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])
  const { t } = useTranslation()

  const items = [
    { icon: FiHome, titleKey: "dashboard", path: "/" },
    { icon: FiBriefcase, titleKey: "items", path: "/items" },
    { icon: FiBookOpen, titleKey: "blog", path: "/blog" },
    { icon: FiCalendar, titleKey: "calendar", path: "/calendar" },
    { icon: FiSettings, titleKey: "settings", path: "/settings" },
  ]

  const finalItems = currentUser?.isSuperUser
      ? [...items, { icon: FiUsers, titleKey: "admin", path: "/admin" }]
      : items

  return (
      <Box>
        {finalItems.map(({ icon, titleKey, path }) => (
            <Flex
                as={Link}
                to={path}
                w="100%"
                p={2}
                key={titleKey}
                activeProps={{
                  style: {
                    background: bgActive,
                    borderRadius: "12px",
                  },
                }}
                color={textColor}
                onClick={onClose}
            >
              <Icon as={icon} alignSelf="center" />
              <Text ml={2}>{t(`sidebar.${titleKey}`)}</Text>
            </Flex>
        ))}
      </Box>
  )
}

export default SidebarItems
