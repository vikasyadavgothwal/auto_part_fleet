import { CostBreakdownCard } from "@/components/fleet-dashboard/orders/cost-breakdown-card"
import { OrderFilters } from "@/components/fleet-dashboard/orders/order-filters"
import { OrderStatCards } from "@/components/fleet-dashboard/orders/order-stat-cards"
import { OrdersTable } from "@/components/fleet-dashboard/orders/orders-table"
import { PageHeading } from "@/components/fleet-dashboard/shared/page-heading"

export default function FleetOrdersPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="space-y-8">
        <PageHeading
          title="Fleet Orders"
          description="Track bulk orders and deliveries for your fleet."
        />

        <OrderStatCards />
        <OrderFilters />
        <OrdersTable />
        <CostBreakdownCard />
      </div>
    </div>
  )
}
