import { Suspense } from "react";

import BotaoHeader from "./menus/botao-header";
import { NavMain } from "./menus/nav-main";
import NavUserPai from "./menus/nav-user-pai";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarRail,
} from "./sidebar-modificada";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <BotaoHeader />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <Suspense fallback={NavegadorSkeleton(4)}>
          <NavMain />
        </Suspense>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <Suspense fallback={NavegadorSkeleton(1)}>
          <NavUserPai />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}

function NavegadorSkeleton(length: number) {
  return (
    <SidebarMenu>
      {Array.from({ length }).map((_, index) => (
        <SidebarMenuItem key={index}>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
