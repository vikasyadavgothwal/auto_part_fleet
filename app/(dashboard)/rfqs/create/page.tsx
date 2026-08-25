import { CreateRfqPage } from "@/components/fleet-dashboard/rfqs/create-rfq-page"
import { AccessRestrictedCard } from "@/components/fleet-dashboard/shared/access-restricted-card"
import { requireFleetUser } from "@/lib/auth/server"
import { getFleetBusinessAccess } from "@/lib/business-access.server"

export default async function FleetBulkRfqPage({
  searchParams,
}: {
  searchParams: Promise<{ vehicleId?: string }>
}) {
  const { vehicleId } = await searchParams
  const access = await getFleetBusinessAccess()
  const createAction = access.action("rfqs.create")
  if (!access.canView("rfqs") || !createAction.allowed) {
    return <AccessRestrictedCard message={createAction.reason || "You do not have permission to create Fleet RFQs."} />
  }
  return <CreateRfqPage user={await requireFleetUser()} initialVehicleId={vehicleId?.trim() || ""} />
}
