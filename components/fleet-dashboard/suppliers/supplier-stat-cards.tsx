import { Award, Banknote, Package, Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import type { SupplierStat } from "@/lib/fleet-analytics"

const icons = {
  award: Award,
  banknote: Banknote,
  package: Package,
  star: Star,
}

export function SupplierStatCards({ stats }: { stats: SupplierStat[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      {stats.map((stat) => {
        const Icon = icons[stat.iconKey]

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
  )
}
