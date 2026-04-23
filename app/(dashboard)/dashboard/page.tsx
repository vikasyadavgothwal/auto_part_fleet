import { ActiveRfqsSection } from "@/components/fleet-dashboard/dashboard/active-rfqs-section"
import { DashboardKpiCards } from "@/components/fleet-dashboard/dashboard/dashboard-kpi-cards"
import { DashboardSummaryCards } from "@/components/fleet-dashboard/dashboard/dashboard-summary-cards"
import { FleetOverviewSection } from "@/components/fleet-dashboard/dashboard/fleet-overview-section"
import { RecentOrdersSection } from "@/components/fleet-dashboard/dashboard/recent-orders-section"
import { TopSuppliersCard } from "@/components/fleet-dashboard/dashboard/top-suppliers-card"
import { PageHeading } from "@/components/fleet-dashboard/shared/page-heading"

export default function FleetDashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeading
        title="Fleet Dashboard"
        description="Manage procurement and vehicle maintenance across your fleet."
      />

      <DashboardKpiCards />
      <DashboardSummaryCards />
      <ActiveRfqsSection />
      <RecentOrdersSection />
      <FleetOverviewSection />
      <TopSuppliersCard />
    </div>
  )
}
