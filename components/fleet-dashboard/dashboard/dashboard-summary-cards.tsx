import { Card, CardContent } from "@/components/ui/card"
import { summaryCards } from "./dashboard-data"
export function DashboardSummaryCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {summaryCards.map((item) => {
        const Icon = item.icon
        return (
          <Card
            key={item.title}
            className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none"
          >
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-sm text-[#9CA3AF]">{item.title}</div>
                <Icon className="h-5 w-5 text-[#DC2626]" />
              </div>
              <div className="mb-1 text-2xl font-bold text-white">
                {item.value}
              </div>
              <div className={`text-sm ${item.subtextClass}`}>
                {item.subtext}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
