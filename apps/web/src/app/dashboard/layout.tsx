import { cookies } from "next/headers";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui-personalizado/dashboard/sidebar-modificada";
import Header from "@/components/ui-personalizado/dashboard/menus/header";
import { AppSidebar } from "@/components/ui-personalizado/dashboard/app-sidebar";

export default async function Page({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = cookies();
  const defaultOpen =
    (await cookieStore).get("sidebar:state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex grow flex-col gap-2 p-2 pt-0">
          <div className="bg-muted/50 flex grow flex-col rounded-xl">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
