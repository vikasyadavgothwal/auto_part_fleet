import Link from "next/link"
import {
  BarChart3,
  DollarSign,
  FileText,
  ShoppingCart,
  TrendingDown,
  Truck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { appRoutes } from "@/lib/routes"

const kpis = [
  {
    title: "Monthly Spend",
    value: "$48,920",
    subtext: "↓ 15% vs last month",
    icon: DollarSign,
  },
  {
    title: "Active RFQs",
    value: "12",
    subtext: "42 quotes received",
    icon: FileText,
  },
  {
    title: "Orders in Progress",
    value: "8",
    subtext: "3 arriving today",
    icon: ShoppingCart,
  },
  {
    title: "Total Vehicles",
    value: "247",
    subtext: "234 active, 13 maintenance",
    icon: Truck,
  },
]

const summaryCards = [
  {
    title: "Cost Per Vehicle",
    value: "$198",
    subtext: "↓ 8% this month",
    icon: TrendingDown,
    subtextClass: "text-[#DC2626]",
  },
  {
    title: "Avg Parts Delivery",
    value: "2.3 days",
    subtext: "Within target",
    icon: BarChart3,
    subtextClass: "text-[#9CA3AF]",
  },
  {
    title: "Maintenance Due",
    value: "18 vehicles",
    subtext: "Next 30 days",
    icon: Truck,
    subtextClass: "text-[#9CA3AF]",
  },
]

const rfqs = [
  {
    id: "RFQ-701",
    vehicles: "5 vehicles",
    parts: "Brake Pads, Oil Filters",
    quotes: "8 received",
    status: "Active",
    expires: "3 days",
  },
  {
    id: "RFQ-702",
    vehicles: "10 vehicles",
    parts: "Air Filters, Spark Plugs",
    quotes: "12 received",
    status: "Active",
    expires: "5 days",
  },
]

const orders = [
  {
    id: "ORD-801",
    supplier: "Acme Auto Parts",
    items: "24 parts",
    vehicles: "6 vehicles",
    amount: "$2,450",
    status: "In Transit",
    eta: "Jan 25",
  },
  {
    id: "ORD-802",
    supplier: "Premium Parts Co",
    items: "18 parts",
    vehicles: "4 vehicles",
    amount: "$1,890",
    status: "Processing",
    eta: "Jan 26",
  },
]

const fleetVehicles = [
  {
    unit: "Unit 101",
    vehicle: "2020 Ford F-150",
    status: "Active",
    mileage: "45,234",
    maintenance: "Due in 2 weeks",
    maintenanceClass: "text-[#9CA3AF]",
  },
  {
    unit: "Unit 102",
    vehicle: "2019 Chevrolet Silverado",
    status: "Maintenance",
    mileage: "67,890",
    maintenance: "In progress",
    maintenanceClass: "text-yellow-500 font-semibold",
  },
]

const suppliers = [
  {
    name: "Acme Auto Parts",
    orders: "24",
    spend: "$12,450",
    rating: "4.9 / 5.0",
  },
  {
    name: "Premium Parts Co",
    orders: "18",
    spend: "$9,860",
    rating: "4.8 / 5.0",
  },
  {
    name: "QuickParts Supply",
    orders: "15",
    spend: "$7,230",
    rating: "4.7 / 5.0",
  },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-green-500/10 text-green-500 border-green-500/20",
    "In Transit": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    Processing: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    Maintenance: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${styles[status] ?? "bg-[#2A2A2A] text-white border-[#2A2A2A]"}`}
    >
      {status}
    </span>
  )
}

function SectionTable({
  headers,
  children,
}: {
  headers: string[]
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#1A1A1A]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2A2A2A] bg-[#0A0A0A]">
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  )
}

export default function FleetDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-white">Fleet Dashboard</h1>
        <p className="text-[#9CA3AF]">
          Manage procurement and vehicle maintenance across your fleet.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((item) => {
          const Icon = item.icon
          return (
            <Card
              key={item.title}
              className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none transition-all hover:border-[#DC2626]"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="text-sm font-medium text-[#9CA3AF]">
                    {item.title}
                  </div>
                  <div className="rounded-lg border border-[#DC2626]/20 bg-[#DC2626]/10 p-2">
                    <Icon className="h-5 w-5 text-[#DC2626]" />
                  </div>
                </div>
                <div className="mb-2 text-3xl font-bold text-white">
                  {item.value}
                </div>
                <div className="text-sm text-[#9CA3AF]">{item.subtext}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {summaryCards.map((item) => {
          const Icon = item.icon
          return (
            <Card
              key={item.title}
              className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm text-[#9CA3AF]">{item.title}</div>
                  <Icon className="h-5 w-5 text-[#DC2626]" />
                </div>
                <div className="mb-1 text-2xl font-bold text-white">
                  {item.value}
                </div>
                <div className={`text-sm ${item.subtextClass}`}>
                  {item.subtext}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Active RFQs</h2>
          <div className="flex items-center gap-4">
            <Link
              href={appRoutes.rfqs}
              className="text-sm font-medium text-[#DC2626] transition-colors hover:text-[#B91C1C]"
            >
              View All
            </Link>
            <Link href={appRoutes.createRfq}>
              <Button className="bg-[#DC2626] text-white hover:bg-[#B91C1C]">
                Create RFQ
              </Button>
            </Link>
          </div>
        </div>

        <SectionTable
          headers={[
            "RFQ ID",
            "Vehicles",
            "Parts Requested",
            "Quotes",
            "Status",
            "Expires",
          ]}
        >
          {rfqs.map((row) => (
            <tr
              key={row.id}
              className="cursor-pointer border-b border-[#2A2A2A] transition-colors hover:bg-[#2A2A2A]"
            >
              <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                <span className="font-medium text-[#DC2626]">{row.id}</span>
              </td>
              <td className="px-6 py-4 text-sm text-[#9CA3AF]">{row.vehicles}</td>
              <td className="px-6 py-4 text-sm text-[#9CA3AF]">{row.parts}</td>
              <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                <span className="font-semibold text-[#DC2626]">{row.quotes}</span>
              </td>
              <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-6 py-4 text-sm text-[#9CA3AF]">{row.expires}</td>
            </tr>
          ))}
        </SectionTable>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Recent Orders</h2>
          <Link
            href={appRoutes.orders}
            className="text-sm font-medium text-[#DC2626] transition-colors hover:text-[#B91C1C]"
          >
            View All
          </Link>
        </div>

        <SectionTable
          headers={[
            "Order ID",
            "Supplier",
            "Items",
            "Vehicles",
            "Amount",
            "Status",
            "ETA",
          ]}
        >
          {orders.map((row) => (
            <tr
              key={row.id}
              className="cursor-pointer border-b border-[#2A2A2A] transition-colors hover:bg-[#2A2A2A]"
            >
              <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                <span className="font-medium text-[#DC2626]">{row.id}</span>
              </td>
              <td className="px-6 py-4 text-sm text-[#9CA3AF]">{row.supplier}</td>
              <td className="px-6 py-4 text-sm text-[#9CA3AF]">{row.items}</td>
              <td className="px-6 py-4 text-sm text-[#9CA3AF]">{row.vehicles}</td>
              <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                <span className="font-semibold text-white">{row.amount}</span>
              </td>
              <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-6 py-4 text-sm text-[#9CA3AF]">{row.eta}</td>
            </tr>
          ))}
        </SectionTable>
      </div>

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
              <td className="px-6 py-4 text-sm text-[#9CA3AF]">{row.vehicle}</td>
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

      <Card className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">
              Top Suppliers This Month
            </h2>
            <Link
              href={appRoutes.suppliers}
              className="text-sm font-medium text-[#DC2626] transition-colors hover:text-[#B91C1C]"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {suppliers.map((supplier) => (
              <div
                key={supplier.name}
                className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-4"
              >
                <div className="mb-3 font-semibold text-white">
                  {supplier.name}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Orders:</span>
                    <span className="font-medium text-white">{supplier.orders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Total Spend:</span>
                    <span className="font-medium text-white">{supplier.spend}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Rating:</span>
                    <span className="font-medium text-[#DC2626]">
                      {supplier.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
