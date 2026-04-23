import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"

import { CategoryDistributionChart } from "@/components/fleet-dashboard/reports/category-distribution-chart"
import { DeliveryPerformanceChart } from "@/components/fleet-dashboard/reports/delivery-performance-chart"
import { MonthlySpendingChart } from "@/components/fleet-dashboard/reports/monthly-spending-chart"
import { ReportsQuickActions } from "@/components/fleet-dashboard/reports/reports-quick-actions"
import { ReportStatCards } from "@/components/fleet-dashboard/reports/report-stat-cards"
import { SupplierSpendCard } from "@/components/fleet-dashboard/reports/supplier-spend-card"
import { PageHeading } from "@/components/fleet-dashboard/shared/page-heading"

export default function FleetReportsPage() {
  return (
    <div className="space-y-8">
      <PageHeading
        title="Fleet Reports & Analytics"
        description="Track spending, performance, and procurement insights."
        action={
          <Button className="gap-2 bg-[#DC2626] text-white hover:bg-[#B91C1C]">
            <Download className="h-5 w-5" />
            Export Report
          </Button>
        }
      />

      <ReportStatCards />
      <MonthlySpendingChart />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <CategoryDistributionChart />
        <DeliveryPerformanceChart />
      </div>

      <SupplierSpendCard />
      <ReportsQuickActions />
    </div>
  )
}
