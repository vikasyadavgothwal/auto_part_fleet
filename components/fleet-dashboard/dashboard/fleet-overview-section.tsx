import Link from "next/link"

import { Button } from "@/components/ui/button"
import { appRoutes } from "@/lib/routes"

import { SectionTable } from "../shared/section-table"
import { StatusBadge } from "../shared/status-badge"
import { fleetVehicles } from "./dashboard-data"

export function FleetOverviewSection() {
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
        {fleetVehicles.map((row) => (
          <tr
            key={row.unit}
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
                size="sm"
                variant="secondary"
                className="bg-[#2A2A2A] text-white hover:bg-[#DC2626]"
              >
                View
              </Button>
            </td>
          </tr>
        ))}
      </SectionTable>
    </div>
  )
}
