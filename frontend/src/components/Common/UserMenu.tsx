import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
  Select,
  useBreakpointValue
} from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"
import { FaUserAstronaut } from "react-icons/fa"
import { FiLogOut, FiUser } from "react-icons/fi"
import { useTranslation } from "react-i18next"


import ThemeToggleButton from "../../components/Common/ThemeToggleButton"
import useAuth from "../../hooks/useAuth"

const UserMenu = () => {
  const { user: currentUser, logout } = useAuth()
  const { i18n, t } = useTranslation()

  const handleLogout = async () => {
    logout()
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value)
  }

  const isMobile = useBreakpointValue({ base: true, md: false })

  return (
      <>
        {isMobile && (
            <Box position="fixed" top={4} right={4} zIndex={1000}>
              <Box display="flex" flexDirection="row" alignItems="center" gap={2}>
                <Select
                    onChange={handleLanguageChange}
                    value={i18n.language}
                    size="sm"
                    w="70px"
                    variant="filled"
                >
                  <option value="en">EN</option>
                  <option value="pl">PL</option>
                  <option value="uk">UA</option>
                </Select>

                <ThemeToggleButton />
              </Box>
            </Box>
        )}

        {!isMobile && (
            <>
              {/* Перемикач мови */}
              <Box position="fixed" top={4} right={48} zIndex={1000}>
                <Select
                    onChange={handleLanguageChange}
                    value={i18n.language}
                    size="sm"
                    w="70px"
                    variant="filled"
                >
                  <option value="en">EN</option>
                  <option value="pl">PL</option>
                  <option value="uk">UA</option>
                </Select>
              </Box>

              {/* Перемикач теми */}
              <Box position="fixed" top={4} right={20} zIndex={1000}>
                <ThemeToggleButton />
              </Box>

              {/* Меню користувача */}
              <Box position="fixed" top={4} right={4} zIndex={1000}>
                <Menu>
                  <MenuButton
                      as={IconButton}
                      aria-label="User menu"
                      icon={
                        currentUser?.avatar ? (
                            <Avatar size="md" src={currentUser.avatar} />
                        ) : (
                            <FaUserAstronaut color="white" fontSize="18px" />
                        )
                      }
                      bg="ui.main"
                      isRound
                      data-testid="user-menu"
                  />
                  <MenuList>
                    <MenuItem icon={<FiUser fontSize="18px" />} as={Link} to="settings">
                      {t("userMenu.profile", "My profile")}
                    </MenuItem>
                    <MenuItem
                        icon={<FiLogOut fontSize="18px" />}
                        onClick={handleLogout}
                        color="ui.danger"
                        fontWeight="bold"
                    >
                      {t("userMenu.logout", "Log out")}
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            </>
        )}
      </>
  )
}

export default UserMenu
