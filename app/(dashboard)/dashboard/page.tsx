import { redirect } from "next/navigation"

import { ActiveRfqsSection } from "@/components/fleet-dashboard/dashboard/active-rfqs-section"
import { DashboardKpiCards } from "@/components/fleet-dashboard/dashboard/dashboard-kpi-cards"
import { DashboardSummaryCards } from "@/components/fleet-dashboard/dashboard/dashboard-summary-cards"
import { FleetOverviewSection } from "@/components/fleet-dashboard/dashboard/fleet-overview-section"
import { RecentOrdersSection } from "@/components/fleet-dashboard/dashboard/recent-orders-section"
import { TopSuppliersCard } from "@/components/fleet-dashboard/dashboard/top-suppliers-card"
import { PageHeading } from "@/components/fleet-dashboard/shared/page-heading"
import { buildFleetOverviewData } from "@/lib/fleet-analytics"
import { getFleetAnalyticsInput } from "@/lib/fleet-dashboard-data.server"
import { appPath, appRoutes } from "@/lib/routes"

export const dynamic = "force-dynamic"

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

  const overview = buildFleetOverviewData(await getFleetAnalyticsInput())

  return (
    <div className="space-y-8">
      <PageHeading
        title="Fleet Dashboard"
        description="Manage procurement and vehicle maintenance across your fleet."
      />

      <DashboardKpiCards kpis={overview.kpis} />
      <DashboardSummaryCards summaries={overview.summaries} />
      <ActiveRfqsSection rfqs={overview.rfqs} />
      <RecentOrdersSection orders={overview.orders} />
      <FleetOverviewSection vehicles={overview.vehicles} />
      <TopSuppliersCard suppliers={overview.suppliers} />
    </div>
  )
}
