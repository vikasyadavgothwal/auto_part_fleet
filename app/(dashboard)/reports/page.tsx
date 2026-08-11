import { cookies } from "next/headers"

import { CategoryDistributionChart } from "@/components/fleet-dashboard/reports/category-distribution-chart"
import { DeliveryPerformanceChart } from "@/components/fleet-dashboard/reports/delivery-performance-chart"
import { ExportReportButton } from "@/components/fleet-dashboard/reports/export-report-button"
import { MonthlySpendingChart } from "@/components/fleet-dashboard/reports/monthly-spending-chart"
import { ReportsQuickActions } from "@/components/fleet-dashboard/reports/reports-quick-actions"
import { ReportStatCards } from "@/components/fleet-dashboard/reports/report-stat-cards"
import { SupplierSpendCard } from "@/components/fleet-dashboard/reports/supplier-spend-card"
import { PageHeading } from "@/components/fleet-dashboard/shared/page-heading"
import { Card, CardContent } from "@/components/ui/card"
import { requestBackend } from "@/lib/auth/backend"
import { buildFleetReportData } from "@/lib/fleet-analytics"
import { getFleetAnalyticsInput } from "@/lib/fleet-dashboard-data.server"

export const dynamic = "force-dynamic"

type AccessResult = { allowed: boolean; reason: string | null }
type BusinessAccessPayload = {
  access?: Array<{
    businessAccount: { type: string; plan?: { name?: string } }
    actions?: Record<string, AccessResult>
  }>
}

async function getFleetReportAccess() {
  const response = await requestBackend("/api/v1/business/access", {
    cookieHeader: (await cookies()).toString(),
  }).catch(() => null)
  const payload = response?.ok ? await response.json() as BusinessAccessPayload : null
  const access = payload?.access?.find((item) => item.businessAccount.type === "Fleet")
  const unavailable = { allowed: false, reason: "Reports are not enabled for this plan or staff role." }
  return {
    planName: access?.businessAccount.plan?.name ?? null,
    dashboard: access?.actions?.["reports.view"] ?? unavailable,
    usage: access?.actions?.["reports.usage"] ?? unavailable,
    activity: access?.actions?.["reports.activity"] ?? unavailable,
  }
}

export default async function FleetReportsPage() {
  const access = await getFleetReportAccess()

  if (!access.dashboard.allowed) {
    return (
      <div className="space-y-8">
        <PageHeading title="Fleet Reports & Analytics" description="Track spending, performance, and procurement insights." />
        <Card className="border-amber-500/30 bg-amber-500/10">
          <CardContent className="pt-6 text-sm text-amber-700 dark:text-amber-200">
            {access.dashboard.reason}
          </CardContent>
        </Card>
      </div>
    )
  }

  const report = buildFleetReportData(await getFleetAnalyticsInput())

  return (
    <div className="space-y-8">
      <PageHeading
        title="Fleet Reports & Analytics"
        description={`Track spending, performance, and procurement insights${access.planName ? ` on ${access.planName}` : ""}.`}
        action={<ExportReportButton report={report} />}
      />

      <ReportStatCards stats={report.stats} />
      {access.usage.allowed ? (
        <>
          <MonthlySpendingChart data={report.spendingTrend} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <CategoryDistributionChart data={report.categoryDistribution} />
            <DeliveryPerformanceChart data={report.deliveryData} />
          </div>
        </>
      ) : null}
      {access.activity.allowed ? (
        <>
          <SupplierSpendCard supplierSpend={report.supplierSpend} />
          <ReportsQuickActions />
        </>
      ) : null}
    </div>
  )
}
