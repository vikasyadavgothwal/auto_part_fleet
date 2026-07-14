import { CategoryDistributionChart } from "@/components/fleet-dashboard/reports/category-distribution-chart"
import { DeliveryPerformanceChart } from "@/components/fleet-dashboard/reports/delivery-performance-chart"
import { ExportReportButton } from "@/components/fleet-dashboard/reports/export-report-button"
import { MonthlySpendingChart } from "@/components/fleet-dashboard/reports/monthly-spending-chart"
import { ReportsQuickActions } from "@/components/fleet-dashboard/reports/reports-quick-actions"
import { ReportStatCards } from "@/components/fleet-dashboard/reports/report-stat-cards"
import { SupplierSpendCard } from "@/components/fleet-dashboard/reports/supplier-spend-card"
import { PageHeading } from "@/components/fleet-dashboard/shared/page-heading"
import { buildFleetReportData } from "@/lib/fleet-analytics"
import { getFleetAnalyticsInput } from "@/lib/fleet-dashboard-data.server"

export const dynamic = "force-dynamic"

export default async function FleetReportsPage() {
  const report = buildFleetReportData(await getFleetAnalyticsInput())

  return (
    <div className="space-y-8">
      <PageHeading
        title="Fleet Reports & Analytics"
        description="Track spending, performance, and procurement insights."
        action={<ExportReportButton report={report} />}
      />

      <ReportStatCards stats={report.stats} />
      <MonthlySpendingChart data={report.spendingTrend} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <CategoryDistributionChart data={report.categoryDistribution} />
        <DeliveryPerformanceChart data={report.deliveryData} />
      </div>

      <SupplierSpendCard supplierSpend={report.supplierSpend} />
      <ReportsQuickActions />
    </div>
  )
}
