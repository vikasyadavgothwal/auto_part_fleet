import {
  Award,
  Clock,
  DollarSign,
  Package,
  Star,
  TrendingUp,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    title: "Active Suppliers",
    value: "5",
    icon: Package,
    iconClass: "text-[#DC2626]",
  },
  {
    title: "Total Spent (YTD)",
    value: "$1014K",
    icon: DollarSign,
    iconClass: "text-green-500",
  },
  {
    title: "Avg Rating",
    value: "4.6",
    icon: Star,
    iconClass: "text-yellow-500",
  },
  {
    title: "Preferred Suppliers",
    value: "2",
    icon: Award,
    iconClass: "text-[#DC2626]",
  },
]

const highlights = [
  {
    title: "Top Performer",
    icon: TrendingUp,
    iconClass: "text-green-500",
    name: "Global Auto Supply",
    rating: "4.9 rating",
    meta: "99% on-time delivery",
    stars: 5,
  },
  {
    title: "Fastest Delivery",
    icon: Clock,
    iconClass: "text-blue-500",
    name: "QuickShip Parts Ltd.",
    rating: "Average: 1.8 days",
    meta: "128 orders completed",
  },
  {
    title: "Highest Volume",
    icon: DollarSign,
    iconClass: "text-green-500",
    name: "Global Auto Supply",
    rating: "$398K total spent",
    meta: "203 orders placed",
  },
]

const suppliers = [
  {
    id: "SUP-001",
    name: "Premium Auto Parts Co.",
    type: "OEM Parts",
    rating: "4.8",
    orders: "156",
    spent: "$245,680",
    delivery: "2.3 days",
    onTime: "98%",
    status: "Preferred",
  },
  {
    id: "SUP-002",
    name: "QuickShip Parts Ltd.",
    type: "Aftermarket",
    rating: "4.6",
    orders: "89",
    spent: "$128,450",
    delivery: "1.8 days",
    onTime: "95%",
    status: "Active",
  },
  {
    id: "SUP-003",
    name: "Global Auto Supply",
    type: "OEM Parts",
    rating: "4.9",
    orders: "203",
    spent: "$398,230",
    delivery: "2.5 days",
    onTime: "99%",
    status: "Preferred",
  },
  {
    id: "SUP-004",
    name: "Budget Parts Direct",
    type: "Economy",
    rating: "4.2",
    orders: "45",
    spent: "$56,780",
    delivery: "3.2 days",
    onTime: "92%",
    status: "Active",
  },
]

const guidance = [
  {
    title: "Select Carefully",
    items: [
      "Compare delivery speed and reliability",
      "Review pricing across multiple categories",
      "Check supplier specialization before onboarding",
    ],
  },
  {
    title: "Set Preferred Suppliers",
    items: [
      "Mark top-performing partners as preferred",
      "Use preferred vendors for recurring orders",
      "Minimum 50 completed orders",
    ],
  },
  {
    title: "Review Periodically",
    items: [
      "Evaluate supplier performance quarterly",
      "Negotiate volume discounts with top suppliers",
      "Maintain diverse supplier network for reliability",
    ],
  },
]

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Preferred: "bg-green-500/10 text-green-500 border-green-500/20",
    Active: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${styles[status] ?? "bg-[#2A2A2A] text-white border-[#2A2A2A]"}`}
    >
      {status}
    </span>
  )
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 fill-yellow-500 text-yellow-500"
        />
      ))}
    </div>
  )
}

export default function FleetSuppliersPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-white">
            Supplier Network
          </h1>
          <p className="text-[#9CA3AF]">
            Manage relationships with your parts suppliers.
          </p>
        </div>

        <Button className="bg-[#DC2626] text-white hover:bg-[#B91C1C]">
          Add Supplier
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card
              key={stat.title}
              className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none"
            >
              <CardContent className="p-6">
                <div className="mb-2 flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${stat.iconClass}`} />
                  <div className="text-sm text-[#9CA3AF]">{stat.title}</div>
                </div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {highlights.map((item) => {
          const Icon = item.icon
          return (
            <Card
              key={item.title}
              className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${item.iconClass}`} />
                  <h3 className="font-semibold text-white">{item.title}</h3>
                </div>

                <div className="space-y-2">
                  <div className="text-xl font-bold text-white">{item.name}</div>

                  {item.stars ? (
                    <div className="flex items-center gap-2">
                      <Stars count={item.stars} />
                      <span className="text-sm text-[#9CA3AF]">
                        {item.rating}
                      </span>
                    </div>
                  ) : (
                    <div className="text-sm text-[#9CA3AF]">{item.rating}</div>
                  )}

                  <div className="text-sm text-[#9CA3AF]">{item.meta}</div>
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
                  Supplier ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                  Supplier Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                  Orders
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                  Total Spent
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                  Avg Delivery
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                  On-Time Rate
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]"></th>
              </tr>
            </thead>

            <tbody>
              {suppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="cursor-pointer border-b border-[#2A2A2A] transition-colors hover:bg-[#2A2A2A]"
                >
                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                    <span className="font-medium text-[#DC2626]">
                      {supplier.id}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                    <div>
                      <div className="font-medium text-white">
                        {supplier.name}
                      </div>
                      <div className="text-sm text-[#9CA3AF]">
                        {supplier.type}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium text-white">
                        {supplier.rating}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                    <span className="text-white">{supplier.orders}</span>
                  </td>

                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                    <span className="font-medium text-white">
                      {supplier.spent}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                    {supplier.delivery}
                  </td>

                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                    <span className="font-medium text-green-500">
                      {supplier.onTime}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                    <StatusBadge status={supplier.status} />
                  </td>

                  <td className="px-6 py-4 text-sm text-[#9CA3AF]">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-[#2A2A2A] text-white hover:bg-[#DC2626]"
                    >
                      View Details
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
          <h3 className="mb-6 font-semibold text-white">
            Supplier Management Tips
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {guidance.map((section) => (
              <div key={section.title}>
                <h4 className="mb-2 text-sm font-medium text-white">
                  {section.title}
                </h4>
                <ul className="space-y-2 text-sm text-[#9CA3AF]">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-[#DC2626]">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}