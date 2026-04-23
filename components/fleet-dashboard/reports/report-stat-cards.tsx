import { TrendingDown, TrendingUp } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

import { stats } from "./reports-data"

export function ReportStatCards() {
  return (
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

              {stat.footerType === "trend-up" && (
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">{stat.footerValue}</span>
                  <span className="text-[#9CA3AF]">{stat.footerLabel}</span>
                </div>
              )}

              {stat.footerType === "trend-down" && (
                <div className="mt-2 flex items-center gap-1 text-sm">
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  <span className="text-green-500">{stat.footerLabel}</span>
                </div>
              )}

              {stat.footerType === "text" && (
                <div className="mt-2 text-sm text-[#9CA3AF]">
                  {stat.footerLabel}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
