import { PageHeading } from "@/components/fleet-dashboard/shared/page-heading"
import { SupplierGuidanceCard } from "@/components/fleet-dashboard/suppliers/supplier-guidance-card"
import { SupplierHighlights } from "@/components/fleet-dashboard/suppliers/supplier-highlights"
import { SupplierStatCards } from "@/components/fleet-dashboard/suppliers/supplier-stat-cards"
import { SuppliersTable } from "@/components/fleet-dashboard/suppliers/suppliers-table"
import { Button } from "@/components/ui/button"

export default function FleetSuppliersPage() {
  return (
    <div className="space-y-8">
      <PageHeading
        title="Supplier Network"
        description="Manage relationships with your parts suppliers."
        action={
          <Button className="bg-[#DC2626] text-white hover:bg-[#B91C1C]">
            Add Supplier
          </Button>
        }
      />

      <SupplierStatCards />
      <SupplierHighlights />
      <SuppliersTable />
      <SupplierGuidanceCard />
    </div>
  )
}
