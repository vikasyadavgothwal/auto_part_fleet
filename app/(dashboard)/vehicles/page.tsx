import { Plus } from "lucide-react"

import { PageHeading } from "@/components/fleet-dashboard/shared/page-heading"
import { VehicleOperationsGrid } from "@/components/fleet-dashboard/vehicles/vehicle-operations-grid"
import { VehicleStatCards } from "@/components/fleet-dashboard/vehicles/vehicle-stat-cards"
import { VehiclesTable } from "@/components/fleet-dashboard/vehicles/vehicles-table"
import { Button } from "@/components/ui/button"

export default function FleetVehiclesPage() {
  return (
    <div className="space-y-8">
      <PageHeading
        title="Fleet Vehicles"
        description="Manage your fleet inventory and assignments."
        action={
          <Button className="gap-2 bg-[#DC2626] text-white hover:bg-[#B91C1C]">
            <Plus className="h-5 w-5" />
            Add Vehicle
          </Button>
        }
      />

      <VehicleStatCards />
      <VehiclesTable />
      <VehicleOperationsGrid />
    </div>
  )
}
