import { Sidebar, SidebarHeader, SidebarFooter, SidebarRail } from "@/components/ui/sidebar"
import AppSidebarMenu from "@/components/layout/admin/sidebar/AppSidebarMenu"
import { OrgProfile } from "@/components/layout/admin/sidebar/OrgProfile"
import { UserSidebar } from "@/components/layout/admin/sidebar/UserSidebar"
import { dataOrg } from "@/constants/dataOrg"
import { dataUser } from "@/constants/dataUser"
import { SidebarMenudata } from "@/data/sidebarData"

export default function AppSidebar() {
    return (
        <Sidebar
            variant="sidebar"
            side="left"
            collapsible="icon"
        >
            <SidebarHeader>
                <OrgProfile dataOrg={dataOrg} />
            </SidebarHeader>

            {/* AppSidebarMenu now includes SidebarContent internally */}
            <AppSidebarMenu data={SidebarMenudata} />

            <SidebarFooter>
                <UserSidebar user={dataUser} triggerVariant="sidebar" />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}