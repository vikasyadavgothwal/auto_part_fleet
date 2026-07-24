import type { ReactNode } from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/app-header"
import { SessionKeepalive } from "@/components/auth/session-keepalive"
import { requireFleetUser } from "@/lib/auth/server"

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await requireFleetUser()
  return (
    <SidebarProvider>
      <SessionKeepalive />
      <AppSidebar />
      <SidebarInset className="min-h-svh bg-[#0A0A0A]">
        <DashboardHeader user={user} />
        <div className="flex flex-1 flex-col p-4 lg:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
