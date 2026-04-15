import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { appRoutes } from "@/lib/routes"

const stats = [
  { title: "Total RFQs", value: "3", valueClass: "text-white" },
  { title: "Active", value: "2", valueClass: "text-[#DC2626]" },
  { title: "Total Quotes", value: "25", valueClass: "text-white" },
  { title: "Potential Savings", value: "$324", valueClass: "text-white" },
]
    
const rfqs = [
  {
    id: "RFQ-F001",
    date: "2024-01-22",
    parts: "Brake Pads (Multiple)",
    vehicles: "4 units",
    quotes: "8 received",
    bestPrice: "$359.96",
    status: "Active",
    expires: "3 days",
    action: "View Quotes",
    actionPrimary: true,
  },
  {
    id: "RFQ-F002",
    date: "2024-01-20",
    parts: "Oil Filters",
    vehicles: "6 units",
    quotes: "12 received",
    bestPrice: "$77.94",
    status: "Active",
    expires: "5 days",
    action: "View Quotes",
    actionPrimary: true,
  },
  {
    id: "RFQ-F003",
    date: "2024-01-18",
    parts: "Tires (Full Set)",
    vehicles: "2 units",
    quotes: "5 received",
    bestPrice: "$1,199.00",
    status: "Accepted",
    expires: "Completed",
    action: "View",
    actionPrimary: false,
  },
]

const benefits = [
  {
    title: "Volume Discounts",
    description:
      "Get better pricing when ordering parts for multiple vehicles at once.",
  },
  {
    title: "Simplified Ordering",
    description:
      "Submit one RFQ for all your vehicles instead of individual requests.",
  },
  {
    title: "Better Visibility",
    description:
      "Track procurement across your entire fleet from one dashboard.",
  },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Active: "bg-green-500/10 text-green-500 border-green-500/20",
    Accepted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${styles[status] ?? "bg-[#2A2A2A] text-white border-[#2A2A2A]"}`}
    >
      {status}
    </span>
  )
}

export default function FleetRfqsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-white">Fleet RFQs</h1>
          <p className="text-[#9CA3AF]">
            Manage bulk procurement requests for your fleet.
          </p>
        </div>

        <Link href={appRoutes.createRfq}>
          <Button className="gap-2 bg-[#DC2626] text-white hover:bg-[#B91C1C]">
            <Plus className="h-5 w-5" />
            Create Bulk RFQ
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none"
          >
            <CardContent className="p-6">
              <div className="mb-2 text-sm text-[#9CA3AF]">{stat.title}</div>
              <div className={`text-3xl font-bold ${stat.valueClass}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#1A1A1A]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2A2A2A] bg-[#0A0A0A]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                  RFQ ID
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
                  Quotes
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                  Best Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                  Expires
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]"></th>
              </tr>
            </thead>

            <tbody>
              {rfqs.map((rfq) => (
                <tr
                  key={rfq.id}
                  className="cursor-pointer border-b border-[#2A2A2A] transition-colors hover:bg-[#2A2A2A]"
                >
                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                    <span className="font-medium text-[#DC2626]">{rfq.id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">{rfq.date}</td>
                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">{rfq.parts}</td>
                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                    {rfq.vehicles}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                    <span className="font-semibold text-[#DC2626]">
                      {rfq.quotes}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                    <span className="font-semibold text-white">
                      {rfq.bestPrice}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                    <StatusBadge status={rfq.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                    {rfq.expires}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                    <Button
                      size="sm"
                      className={
                        rfq.actionPrimary
                          ? "bg-[#DC2626] text-white hover:bg-[#B91C1C]"
                          : "bg-[#2A2A2A] text-[#9CA3AF] hover:bg-[#2A2A2A]"
                      }
                    >
                      {rfq.action}
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
          <h3 className="mb-2 font-semibold text-white">Bulk RFQ Benefits</h3>

          <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <div key={benefit.title}>
                <div className="mb-2 font-bold text-[#DC2626]">
                  {benefit.title}
                </div>
                <p className="text-sm text-[#9CA3AF]">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
