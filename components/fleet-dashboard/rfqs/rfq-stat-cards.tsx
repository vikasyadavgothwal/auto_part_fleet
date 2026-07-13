import { Card, CardContent } from "@/components/ui/card"

import type { FleetRfq } from "./rfqs-data"

export function RfqStatCards({ rfqs }: { rfqs: FleetRfq[] }) {
  const stats = [
    { title: "Total RFQs", value: String(rfqs.length), valueClass: "text-white" },
    { title: "Active", value: String(rfqs.filter((rfq) => rfq.status === "open").length), valueClass: "text-[#DC2626]" },
    { title: "Total Quotes", value: String(rfqs.reduce((sum, rfq) => sum + rfq.bids.length, 0)), valueClass: "text-white" },
    { title: "Orders Created", value: String(rfqs.filter((rfq) => rfq.order).length), valueClass: "text-white" },
  ]
  return (
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
  )
}
