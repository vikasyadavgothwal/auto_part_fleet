import { Card, CardContent } from "@/components/ui/card"

import { costBreakdown } from "./orders-data"

export function CostBreakdownCard() {
  return (
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
  )
}
