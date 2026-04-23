import { Card, CardContent } from "@/components/ui/card"

import { guidance } from "./suppliers-data"

export function SupplierGuidanceCard() {
  return (
    <Card className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none">
      <CardContent className="p-6">
        <h3 className="mb-6 font-semibold text-white">
          Supplier Management Tips
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {guidance.map((section) => (
            <div key={section.title}>
              <h4 className="mb-2 text-sm font-medium text-white">
                {section.title}
              </h4>
              <ul className="space-y-2 text-sm text-[#9CA3AF]">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-[#DC2626]">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
