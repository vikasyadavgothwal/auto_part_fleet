import { CreateRfqPage } from "@/components/fleet-dashboard/rfqs/create-rfq-page"
import { requireFleetUser } from "@/lib/auth/server"

export default async function FleetBulkRfqPage({
  searchParams,
}: {
  searchParams: Promise<{ vehicleId?: string }>
}) {
  const { vehicleId } = await searchParams
  return <CreateRfqPage user={await requireFleetUser()} initialVehicleId={vehicleId?.trim() || ""} />
}
