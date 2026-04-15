import Link from "next/link"
import { Plus, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { appRoutes } from "@/lib/routes"

const vehicleStats = [
  {
    title: "Total Vehicles",
    value: "4",
    icon: Truck,
    valueClass: "text-white",
    withIcon: true,
  },
  {
    title: "Active",
    value: "3",
    valueClass: "text-[#DC2626]",
  },
  {
    title: "In Maintenance",
    value: "1",
    valueClass: "text-yellow-500",
  },
  {
    title: "Avg. Mileage",
    value: "43,870",
    valueClass: "text-white",
  },
]

const vehicles = [
  {
    id: "VEH-F001",
    name: "2020 Ford F-150",
    vin: "1FTFW1EF8LFC12345",
    mileage: "45,234 mi",
    driver: "John Smith",
    status: "Active",
  },
  {
    id: "VEH-F002",
    name: "2019 Chevrolet Silverado",
    vin: "3GCUKREC5KG123456",
    mileage: "67,890 mi",
    driver: "Mike Johnson",
    status: "Active",
  },
  {
    id: "VEH-F003",
    name: "2021 RAM 1500",
    vin: "1C6SRFFT5MN123456",
    mileage: "23,456 mi",
    driver: "Sarah Williams",
    status: "Maintenance",
  },
  {
    id: "VEH-F004",
    name: "2020 Toyota Tacoma",
    vin: "3TMCZ5AN9LM123456",
    mileage: "38,901 mi",
    driver: "David Brown",
    status: "Active",
  },
]

const maintenanceDue = [
  {
    title: "2020 Ford F-150",
    description: "Oil change due in 500 miles",
  },
  {
    title: "2019 Chevy Silverado",
    description: "Tire rotation due",
  },
]

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "Maintenance"
      ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      : "bg-green-500/10 text-green-500 border-green-500/20"

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${styles}`}
    >
      {status}
    </span>
  )
}

export default function FleetVehiclesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-white">
            Fleet Vehicles
          </h1>
          <p className="text-[#9CA3AF]">
            Manage your fleet inventory and assignments.
          </p>
        </div>

        <Button className="gap-2 bg-[#DC2626] text-white hover:bg-[#B91C1C]">
          <Plus className="h-5 w-5" />
          Add Vehicle
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {vehicleStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none"
            >
              <CardContent className="p-6">
                {stat.withIcon && Icon ? (
                  <div className="mb-2 flex items-center gap-3">
                    <Icon className="h-5 w-5 text-[#DC2626]" />
                    <div className="text-sm text-[#9CA3AF]">{stat.title}</div>
                  </div>
                ) : (
                  <div className="mb-2 text-sm text-[#9CA3AF]">
                    {stat.title}
                  </div>
                )}

                <div className={`text-3xl font-bold ${stat.valueClass}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#1A1A1A]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A2A2A] bg-[#0A0A0A]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                  Vehicle
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                  VIN
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                  Mileage
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                  Driver
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
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
                        <div className="font-semibold text-white">
                          {vehicle.name}
                        </div>
                        <div className="text-xs text-[#9CA3AF]">
                          {vehicle.id}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                    {vehicle.vin}
                  </td>

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
            </tbody>
          </table>
        </div>
      </div>

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
    </div>
  )
}
