import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import { appRoutes } from "@/lib/routes"

import { maintenanceDue } from "./vehicles-data"

export function VehicleOperationsGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none">
        <CardContent className="p-6">
          <h3 className="mb-4 font-semibold text-white">Bulk Operations</h3>

          <div className="space-y-3">
            <Link
              href={appRoutes.createRfq}
              className="block rounded-lg bg-[#0A0A0A] p-3 transition-all hover:border hover:border-[#DC2626]"
            >
              <div className="mb-1 font-medium text-white">
                Create Bulk RFQ
              </div>
              <div className="text-sm text-[#9CA3AF]">
                Request quotes for multiple vehicles
              </div>
            </Link>

            <button className="w-full rounded-lg bg-[#0A0A0A] p-3 text-left transition-all hover:border hover:border-[#DC2626]">
              <div className="mb-1 font-medium text-white">
                Import Vehicles
              </div>
              <div className="text-sm text-[#9CA3AF]">
                Upload CSV with vehicle data
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none">
        <CardContent className="p-6">
          <h3 className="mb-4 font-semibold text-white">Maintenance Due</h3>

          <div className="space-y-3">
            {maintenanceDue.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3"
              >
                <div className="mb-1 font-medium text-white">{item.title}</div>
                <div className="text-sm text-[#9CA3AF]">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
