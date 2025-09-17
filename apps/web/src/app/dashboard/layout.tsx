import { cookies } from "next/headers";

import { AppSidebar } from "@/components/ui-personalizado/dashboard/app-sidebar";
import Header from "@/components/ui-personalizado/dashboard/menus/header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui-personalizado/dashboard/sidebar-modificada";

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

            {process.env.NODE_ENV !== "production" && (
              <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1 rounded text-sm">
                <span className="sm:hidden">Mobile</span>
                <span className="hidden sm:inline md:hidden">SM</span>
                <span className="hidden md:inline lg:hidden">MD</span>
                <span className="hidden lg:inline xl:hidden">LG</span>
                <span className="hidden xl:inline">XL</span>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
