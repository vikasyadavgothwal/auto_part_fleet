import type { ReactNode } from "react"
import { cookies } from "next/headers"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/app-header"
import { SessionKeepalive } from "@/components/auth/session-keepalive"
import { ToastProvider } from "@/components/ui/toast-provider"
import { requireFleetUser } from "@/lib/auth/server"
import { requestBackend } from "@/lib/auth/backend"

type BusinessAccessPayload = {
  ok: boolean
  access?: Array<{
    businessAccount: { type: string; isOwner?: boolean; plan: { name: string; code: string } }
    visibleMenus: string[]
  }>
}

async function getBusinessAccess() {
  const response = await requestBackend("/api/v1/business/access", {
    cookieHeader: (await cookies()).toString(),
  }).catch(() => null)
  if (!response?.ok) return { visibleMenus: [], planName: null }
  const payload = (await response.json()) as BusinessAccessPayload
  const access = payload.access?.find((item) => item.businessAccount.type === "Fleet")
  return {
    visibleMenus: access?.visibleMenus ?? [],
    planName: access?.businessAccount.plan.name ?? null,
    isOwner: access?.businessAccount.isOwner ?? false,
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const [user, businessAccess] = await Promise.all([requireFleetUser(), getBusinessAccess()])
  return (
    <SidebarProvider>
      <ToastProvider>
        <SessionKeepalive />
        <AppSidebar visibleMenus={businessAccess.visibleMenus} planName={businessAccess.planName} isOwner={businessAccess.isOwner} />
        <SidebarInset className="min-h-svh bg-[#0A0A0A]">
          <DashboardHeader user={user} />
          <div className="flex flex-1 flex-col p-4 lg:p-6">
            {children}
          </div>
        </SidebarInset>
      </ToastProvider>
    </SidebarProvider>
  )
}
