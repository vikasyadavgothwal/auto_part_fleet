import { PageHeading } from "@/components/fleet-dashboard/shared/page-heading"
import { SupplierGuidanceCard } from "@/components/fleet-dashboard/suppliers/supplier-guidance-card"
import { SupplierHighlights } from "@/components/fleet-dashboard/suppliers/supplier-highlights"
import { SupplierStatCards } from "@/components/fleet-dashboard/suppliers/supplier-stat-cards"
import { SuppliersTable } from "@/components/fleet-dashboard/suppliers/suppliers-table"
import {
  buildFleetSuppliers,
  buildSupplierHighlights,
  buildSupplierStats,
} from "@/lib/fleet-analytics"
import { getFleetAnalyticsInput } from "@/lib/fleet-dashboard-data.server"

export const dynamic = "force-dynamic"

export default async function FleetSuppliersPage() {
  const analyticsInput = await getFleetAnalyticsInput()
  const suppliers = buildFleetSuppliers(analyticsInput)
  const stats = buildSupplierStats(suppliers)
  const highlights = buildSupplierHighlights(suppliers)

  return (
    <div className="space-y-8">
      <PageHeading
        title="Supplier Network"
        description="Manage relationships with your parts suppliers."
      />

      <SupplierStatCards stats={stats} />
      <SupplierHighlights highlights={highlights} />
      <SuppliersTable suppliers={suppliers} />
      <SupplierGuidanceCard />
    </div>
  )
}
