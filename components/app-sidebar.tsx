"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  House,
  Truck,
  FileText,
  ShoppingCart,
  Building2,
  ChartColumn,
  Headphones,
  Plug,
  KeyRound,
  CirclePlus,
  Users,
  ShieldCheck,
  BadgeCheck,
  Settings,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { appRoutes, stripBasePath } from "@/lib/routes"

const items = [
  { title: "Overview", url: appRoutes.overview, icon: House, menuKey: "overview" },
  { title: "Vehicles", url: appRoutes.vehicles, icon: Truck, menuKey: "vehicles" },
  { title: "RFQs", url: appRoutes.rfqs, icon: FileText, menuKey: "rfqs" },
  { title: "Orders", url: appRoutes.orders, icon: ShoppingCart, menuKey: "orders" },
  { title: "Suppliers", url: appRoutes.suppliers, icon: Building2, menuKey: "suppliers" },
  { title: "Integrations", url: appRoutes.integrations, icon: Plug, menuKey: "integrations" },
  { title: "API Keys", url: appRoutes.apiKeys, icon: KeyRound, menuKey: "api-keys" },
  { title: "Paid Add-ons", url: appRoutes.addOns, icon: CirclePlus, menuKey: "add-ons" },
  { title: "Support", url: appRoutes.support, icon: Headphones, menuKey: "support" },
  { title: "Staff", url: appRoutes.staff, icon: Users, menuKey: "staff" },
  { title: "Roles", url: appRoutes.roles, icon: ShieldCheck, menuKey: "roles" },
  { title: "Reports", url: appRoutes.reports, icon: ChartColumn, menuKey: "reports" },
  { title: "Plans", url: appRoutes.plans, icon: BadgeCheck, menuKey: "plans" },
]
const fallbackMenuKeys = items.map((item) => item.menuKey)
const fallbackMenuKeysWithoutApiAccess = fallbackMenuKeys.filter((menuKey) => menuKey !== "api-keys")

export function AppSidebar({
  visibleMenus = [],
  planName,
  planCode,
  isOwner = false,
}: {
  visibleMenus?: string[]
  planName?: string | null
  planCode?: string | null
  isOwner?: boolean
}) {
  const currentPath = stripBasePath(usePathname())
  const effectiveVisibleMenus = visibleMenus.length ? visibleMenus : isOwner || !planName ? fallbackMenuKeysWithoutApiAccess : []
  const visibleMenuSet = new Set(["settings", ...(isOwner ? ["overview", "plans", "add-ons"] : []), ...effectiveVisibleMenus])
  if (planCode === "Enterprise" || /\benterprise\b/i.test(planName ?? "")) visibleMenuSet.delete("add-ons")

  return (
    <Sidebar className="border-sidebar-border bg-[#1A1A1A] text-white">
      <SidebarHeader className="border-b border-[#2A2A2A] px-6 py-6">
        <Link href={appRoutes.overview} className="block">
          <h2 className="text-xl font-bold">AutoPartsPro</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Fleet Manager
          </p>
        </Link>
        {planName && visibleMenuSet.has("plans") ? (
          <Link
            href={appRoutes.plans}
            className="group mt-4 block rounded-lg border border-primary/25 bg-[#0A0A0A] p-3 shadow-[0_14px_34px_rgba(0,0,0,0.22)] transition hover:border-primary/50 hover:bg-[#111111]"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <span className="flex h-7 w-7 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
                  <BadgeCheck className="h-4 w-4" />
                </span>
                {planName}
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.12)]" />
            </div>
          </Link>
        ) : null}
      </SidebarHeader>

      <SidebarContent className="flex-1 overflow-y-auto px-4 py-4">
        <SidebarMenu className="space-y-1">
          {items.filter((item) => visibleMenuSet.has(item.menuKey)).map((item) => {
            const Icon = item.icon

            const isActive =
              item.url === appRoutes.overview
                ? currentPath === appRoutes.overview ||
                  currentPath === appRoutes.legacyOverview
                : currentPath === item.url ||
                  currentPath.startsWith(`${item.url}/`)

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`h-auto  px-4 py-3 transition-all ${
                    isActive
                      ? "rounded-sm bg-primary text-white hover:bg-primary hover:text-white"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Link href={item.url} className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      {visibleMenuSet.has("settings") ? <SidebarFooter className="border-t border-[#2A2A2A] p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={
                currentPath === appRoutes.settings ||
                currentPath.startsWith(`${appRoutes.settings}/`)
              }
              className={`h-auto rounded-md px-4 py-3 transition-all ${
                currentPath === appRoutes.settings ||
                currentPath.startsWith(`${appRoutes.settings}/`)
                  ? "bg-primary rounded-md text-white hover:bg-primary hover:text-white"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Link
                href={appRoutes.settings}
                className="flex items-center gap-3"
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> : null}
    </Sidebar>
  )
}
