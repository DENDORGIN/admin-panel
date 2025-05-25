import {
  Container,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react"
import { useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import type { UserPublic } from "../../client"
import Appearance from "../../components/UserSettings/Appearance"
import ChangePassword from "../../components/UserSettings/ChangePassword"
/*import DeleteAccount from "../../components/UserSettings/DeleteAccount"*/
import UserInformation from "../../components/UserSettings/UserInformation"
import { useTranslation } from "react-i18next";

const tabsConfig = [
  { titleKey: "settings.tabs.profile", component: UserInformation },
{ titleKey: "settings.tabs.password", component: ChangePassword },
{ titleKey: "settings.tabs.appearance", component: Appearance },
 /* { title: "Danger zone", component: DeleteAccount },*/
]

export const Route = createFileRoute("/_layout/settings")({
  component: UserSettings,
})

function UserSettings() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])
  const finalTabs = currentUser?.isSuperUser
    ? tabsConfig.slice(0, 3)
    : tabsConfig

  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} py={12}>
        {t("settings.heading")}
      </Heading>
      <Tabs variant="enclosed">
        <TabList>
          {finalTabs.map((tab, index) => (
              <Tab key={index}>{t(tab.titleKey)}</Tab>
          ))}
        </TabList>
        <TabPanels>
          {finalTabs.map((tab, index) => (
            <TabPanel key={index}>
              <tab.component />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  )
}
