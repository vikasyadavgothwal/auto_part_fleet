import Link from "next/link"

import { Button } from "@/components/ui/button"
import type { DashboardVehicleRow } from "@/lib/fleet-analytics"
import { appRoutes } from "@/lib/routes"

import { SectionTable } from "../shared/section-table"
import { StatusBadge } from "../shared/status-badge"

export function FleetOverviewSection({
  vehicles,
}: {
  vehicles: DashboardVehicleRow[]
}) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Fleet Overview</h2>
        <Link
          href={appRoutes.vehicles}
          className="text-sm font-medium text-[#DC2626] transition-colors hover:text-[#B91C1C]"
        >
          View All Vehicles
        </Link>
      </div>

      <SectionTable
        headers={[
          "Unit #",
          "Vehicle",
          "Status",
          "Mileage",
          "Next Maintenance",
          "Actions",
        ]}
      >
        {vehicles.length ? (
          vehicles.map((row) => (
            <tr
              key={row.id}
              className="cursor-pointer border-b border-[#2A2A2A] transition-colors hover:bg-[#2A2A2A]"
            >
              <td className="px-6 py-4 text-sm text-[#9CA3AF]">{row.unit}</td>
              <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                {row.vehicle}
              </td>
              <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-6 py-4 text-sm text-[#9CA3AF]">{row.mileage}</td>
              <td className="px-6 py-4 text-sm">
                <span className={row.maintenanceClass}>{row.maintenance}</span>
              </td>
              <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="bg-[#2A2A2A] text-white hover:bg-[#DC2626]"
                >
                  <Link href={appRoutes.vehicles}>View</Link>
                </Button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="px-6 py-8 text-center text-sm text-[#9CA3AF]">
              Fleet vehicles will appear here after you add your first vehicle.
            </td>
          </tr>
        )}
      </SectionTable>
    </div>
  )
}
