import type { ComponentType } from "react"
import { Banknote, FileText, ShoppingCart, Truck } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import type { DashboardKpi } from "@/lib/fleet-analytics"

const icons = {
  banknote: Banknote,
  fileText: FileText,
  shoppingCart: ShoppingCart,
  truck: Truck,
} satisfies Record<DashboardKpi["iconKey"], ComponentType<{ className?: string }>>

export function DashboardKpiCards({ kpis }: { kpis: DashboardKpi[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((item) => {
        const Icon = icons[item.iconKey]

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
                <div className="rounded-sm border border-[#DC2626]/20 bg-[#DC2626]/10 p-2">
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
