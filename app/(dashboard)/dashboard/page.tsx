import { redirect } from "next/navigation"

import { ActiveRfqsSection } from "@/components/fleet-dashboard/dashboard/active-rfqs-section"
import { DashboardKpiCards } from "@/components/fleet-dashboard/dashboard/dashboard-kpi-cards"
import { DashboardSummaryCards } from "@/components/fleet-dashboard/dashboard/dashboard-summary-cards"
import { FleetOverviewSection } from "@/components/fleet-dashboard/dashboard/fleet-overview-section"
import { RecentOrdersSection } from "@/components/fleet-dashboard/dashboard/recent-orders-section"
import { TopSuppliersCard } from "@/components/fleet-dashboard/dashboard/top-suppliers-card"
import { AccessRestrictedCard } from "@/components/fleet-dashboard/shared/access-restricted-card"
import { PageHeading } from "@/components/fleet-dashboard/shared/page-heading"
import { getFleetBusinessAccess } from "@/lib/business-access.server"
import { buildFleetOverviewData } from "@/lib/fleet-analytics"
import { getFleetAnalyticsInput } from "@/lib/fleet-dashboard-data.server"
import { appPath, appRoutes } from "@/lib/routes"

export const dynamic = "force-dynamic"

const staffLandingRoutes = [
  ["vehicles", appRoutes.vehicles],
  ["rfqs", appRoutes.rfqs],
  ["orders", appRoutes.orders],
  ["suppliers", appRoutes.suppliers],
  ["reports", appRoutes.reports],
] as const

type FleetDashboardPageProps = {
  searchParams?: Promise<{ payment?: string; session_id?: string }>
}

export default async function FleetDashboardPage({ searchParams }: FleetDashboardPageProps) {
  const params = await searchParams
  if (params?.payment) {
    const query = new URLSearchParams({ payment: params.payment })
    if (params.session_id) query.set("session_id", params.session_id)
    redirect(`${appPath(appRoutes.plans)}?${query.toString()}`)
  }

  const access = await getFleetBusinessAccess()
  const canVehicles = access.canView("vehicles")
  const canRfqs = access.canView("rfqs")
  const canOrders = access.canView("orders")
  const canSuppliers = access.canView("suppliers")
  const canReports = access.canView("reports")
  const staffLandingRoute = staffLandingRoutes.find(([menu]) => access.canView(menu))?.[1]
  if (!access.isOwner && staffLandingRoute) {
    redirect(appPath(staffLandingRoute))
  }
  const canSeeOperations = access.isOwner || canVehicles || canRfqs || canOrders || canSuppliers || canReports
  const overview = canSeeOperations ? buildFleetOverviewData(await getFleetAnalyticsInput()) : null

  return (
    <div className="space-y-8">
      <PageHeading
        title="Fleet Dashboard"
        description="Manage procurement and vehicle maintenance across your fleet."
      />

      {!overview ? <AccessRestrictedCard title="No dashboard access" message="Ask the account owner to assign at least one Fleet section to your role." /> : null}
      {overview ? <DashboardKpiCards kpis={overview.kpis.filter((item) => canReports ? true : item.iconKey === "truck" ? canVehicles : item.iconKey === "fileText" ? canRfqs : item.iconKey === "shoppingCart" || item.iconKey === "banknote" ? canOrders : true)} /> : null}
      {overview ? <DashboardSummaryCards summaries={overview.summaries.filter((item) => canReports ? true : item.iconKey === "truck" ? canVehicles : canOrders || canRfqs)} /> : null}
      {overview && canRfqs ? <ActiveRfqsSection rfqs={overview.rfqs} /> : null}
      {overview && canOrders ? <RecentOrdersSection orders={overview.orders} /> : null}
      {overview && canVehicles ? <FleetOverviewSection vehicles={overview.vehicles} /> : null}
      {overview && canSuppliers ? <TopSuppliersCard suppliers={overview.suppliers} /> : null}
    </div>
  )
}
