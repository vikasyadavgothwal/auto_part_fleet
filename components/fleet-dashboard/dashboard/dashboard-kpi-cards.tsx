import { Card, CardContent } from "@/components/ui/card"

import { kpis } from "./dashboard-data"

export function DashboardKpiCards() {
  return (
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
  )
}
