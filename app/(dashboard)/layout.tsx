import type { ReactNode } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/app-header"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-h-svh bg-[#0A0A0A]">
        <DashboardHeader />
        <div className="flex flex-1 flex-col p-4 lg:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
