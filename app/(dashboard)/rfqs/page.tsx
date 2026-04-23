import Link from "next/link"
import { Plus } from "lucide-react"

import { PageHeading } from "@/components/fleet-dashboard/shared/page-heading"
import { RfqBenefitsCard } from "@/components/fleet-dashboard/rfqs/rfq-benefits-card"
import { RfqStatCards } from "@/components/fleet-dashboard/rfqs/rfq-stat-cards"
import { RfqsTable } from "@/components/fleet-dashboard/rfqs/rfqs-table"
import { Button } from "@/components/ui/button"
import { appRoutes } from "@/lib/routes"

export default function FleetRfqsPage() {
  return (
    <div className="space-y-8">
      <PageHeading
        title="Fleet RFQs"
        description="Manage bulk procurement requests for your fleet."
        action={
          <Link href={appRoutes.createRfq}>
            <Button className="gap-2 bg-[#DC2626] text-white hover:bg-[#B91C1C]">
              <Plus className="h-5 w-5" />
              Create Bulk RFQ
            </Button>
          </Link>
        }
      />

      <RfqStatCards />
      <RfqsTable />
      <RfqBenefitsCard />
    </div>
  )
}
