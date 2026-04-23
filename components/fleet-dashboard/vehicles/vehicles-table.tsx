import Link from "next/link"
import { Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { appRoutes } from "@/lib/routes"

import { SectionTable } from "../shared/section-table"
import { StatusBadge } from "../shared/status-badge"
import { vehicles } from "./vehicles-data"

export function VehiclesTable() {
  return (
    <SectionTable
      headers={["Vehicle", "VIN", "Mileage", "Driver", "Status", "Actions"]}
    >
      {vehicles.map((vehicle) => (
        <tr
          key={vehicle.id}
          className="cursor-pointer border-b border-[#2A2A2A] transition-colors hover:bg-[#2A2A2A]"
        >
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-[#DC2626]/20 bg-[#DC2626]/10 p-2">
                <Truck className="h-5 w-5 text-[#DC2626]" />
              </div>
              <div>
                <div className="font-semibold text-white">{vehicle.name}</div>
                <div className="text-xs text-[#9CA3AF]">{vehicle.id}</div>
              </div>
            </div>
          </td>

          <td className="px-6 py-4 text-sm text-[#9CA3AF]">{vehicle.vin}</td>

          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            {vehicle.mileage}
          </td>

          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            {vehicle.driver}
          </td>

          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <StatusBadge status={vehicle.status} />
          </td>

          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-[#2A2A2A] text-white hover:bg-[#DC2626]"
              >
                View
              </Button>

              <Link href={appRoutes.createRfq}>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#DC2626]/20 bg-[#DC2626]/10 text-[#DC2626] hover:bg-[#DC2626] hover:text-white"
                >
                  Order Parts
                </Button>
              </Link>
            </div>
          </td>
        </tr>
      ))}
    </SectionTable>
  )
}
