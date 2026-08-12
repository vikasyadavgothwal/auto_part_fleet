import { Banknote, Clock, TrendingUp } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import type { SupplierHighlight } from "@/lib/fleet-analytics"

import { SupplierStars } from "./supplier-stars"

const icons = {
  banknote: Banknote,
  clock: Clock,
  trending: TrendingUp,
}

export function SupplierHighlights({ highlights }: { highlights: SupplierHighlight[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {highlights.map((item) => {
        const Icon = icons[item.iconKey]

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
                    <SupplierStars count={item.stars} />
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
  )
}
