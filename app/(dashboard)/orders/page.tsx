import { Bell, ChevronDown, Menu, Search, User } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const stats = [
  { title: "Total Orders", value: "3", valueClass: "text-white" },
  { title: "Processing", value: "1", valueClass: "text-yellow-500" },
  { title: "In Transit", value: "1", valueClass: "text-blue-500" },
  { title: "Total Spent", value: "$1,636.90", valueClass: "text-[#DC2626]" },
]

const filters = ["All Orders", "Processing", "Shipped", "Delivered"]

const orders = [
  {
    id: "ORD-F001",
    date: "2024-01-22",
    parts: "Brake Pads (x4)",
    vehicles: "4 vehicles",
    supplier: "Acme Auto Parts",
    total: "$359.96",
    status: "Processing",
  },
  {
    id: "ORD-F002",
    date: "2024-01-20",
    parts: "Oil Filters (x6)",
    vehicles: "6 vehicles",
    supplier: "Premium Parts Co",
    total: "$77.94",
    status: "Shipped",
  },
  {
    id: "ORD-F003",
    date: "2024-01-18",
    parts: "Tires (Full Set x2)",
    vehicles: "2 vehicles",
    supplier: "QuickParts Supply",
    total: "$1,199.00",
    status: "Delivered",
  },
]

const costBreakdown = [
  { label: "Brake Systems", amount: "$359.96", width: "22%" },
  { label: "Oil & Filters", amount: "$77.94", width: "5%" },
  { label: "Tires", amount: "$1,199.00", width: "73%" },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Processing: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Shipped: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Delivered: "bg-green-500/10 text-green-500 border-green-500/20",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${styles[status] ?? "bg-[#2A2A2A] text-white border-[#2A2A2A]"}`}
    >
      {status}
    </span>
  )
}

export default function FleetOrdersPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">


            <div className="space-y-8">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-white">
                  Fleet Orders
                </h1>
                <p className="text-[#9CA3AF]">
                  Track bulk orders and deliveries for your fleet.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                {stats.map((stat) => (
                  <Card
                    key={stat.title}
                    className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none"
                  >
                    <CardContent className="p-6">
                      <div className="mb-2 text-sm text-[#9CA3AF]">
                        {stat.title}
                      </div>
                      <div className={`text-3xl font-bold ${stat.valueClass}`}>
                        {stat.value}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[#9CA3AF]">
                  <Search className="h-5 w-5" />
                  <span className="font-medium">Filter:</span>
                </div>

                <div className="flex gap-2">
                  {filters.map((filter, index) => (
                    <Button
                      key={filter}
                      variant="outline"
                      className={
                        index === 0
                          ? "bg-[#DC2626] text-white hover:bg-[#DC2626] hover:text-white border-[#DC2626]"
                          : "border-[#2A2A2A] bg-[#1A1A1A] text-[#9CA3AF] hover:border-[#DC2626] hover:bg-[#1A1A1A] hover:text-white"
                      }
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#1A1A1A]">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#2A2A2A] bg-[#0A0A0A]">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                          Order ID
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                          Parts
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                          Vehicles
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                          Supplier
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                          Total
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
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="cursor-pointer border-b border-[#2A2A2A] transition-colors hover:bg-[#2A2A2A]"
                        >
                          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                            <span className="font-medium text-[#DC2626]">
                              {order.id}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                            {order.parts}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                            {order.vehicles}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                            {order.supplier}
                          </td>
                          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                            <span className="font-semibold text-white">
                              {order.total}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                            <StatusBadge status={order.status} />
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
                    </tbody>
                  </table>
                </div>
              </div>

              <Card className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none">
                <CardContent className="p-6">
                  <h3 className="mb-4 font-semibold text-white">
                    Monthly Cost Breakdown
                  </h3>

                  <div className="space-y-3">
                    {costBreakdown.map((item) => (
                      <div key={item.label}>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm text-white">{item.label}</span>
                          <span className="text-sm font-semibold text-white">
                            {item.amount}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[#0A0A0A]">
                          <div
                            className="h-2 rounded-full bg-[#DC2626]"
                            style={{ width: item.width }}
                          />
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