import { getSession } from "@repo/authweb/session";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../sidebar-modificada";
import { Menu, MenusExistentes, MenusTodos } from "./menus-e-seus-tipos";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export async function NavMain() {
  const utilizadorActual = await getSession();

  if (!utilizadorActual) return redirect("/auth/logout");

  const menusMapeados = utilizadorActual.papeis
    .map((papel) => MenusExistentes[papel as keyof MenusTodos])
    .filter((menu): menu is Menu => !!menu);

  if (menusMapeados.length === 0) redirect("/");

  //console.log("menusMapeados : ", JSON.stringify(menusMapeados, null, 2));
  //await espera(3);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menus</SidebarGroupLabel>
      <SidebarMenu>
        {menusMapeados.map((item) => (
          <Collapsible
            key={item.nome}
            asChild
            defaultOpen={item.isActive || item.isActive}
          >
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.nome}>
                <Link href={item.path}>
                  {item.icon && <item.icon />}
                  <span>{item.nome}</span>
                </Link>
              </SidebarMenuButton>
              {item.subMenuItems?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
                    <SidebarMenuSub>
                      {item.subMenuItems?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.nome}>
                          <SidebarMenuSubButton asChild>
                            <Link href={subItem.path}>
                              <span>{subItem.nome}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
