import { Card, CardContent } from "@/components/ui/card"

import { stats } from "./rfqs-data"

export function RfqStatCards() {
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
