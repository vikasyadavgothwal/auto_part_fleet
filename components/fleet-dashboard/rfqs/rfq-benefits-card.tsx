import { Card, CardContent } from "@/components/ui/card"

import { benefits } from "./rfqs-data"

export function RfqBenefitsCard() {
  return (
    <Card className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none">
      <CardContent className="p-6">
        <h3 className="mb-2 font-semibold text-white">Bulk RFQ Benefits</h3>

        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.title}>
              <div className="mb-2 font-bold text-[#DC2626]">
                {benefit.title}
              </div>
              <p className="text-sm text-[#9CA3AF]">{benefit.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
