import { Card, CardContent } from "@/components/ui/card"

import { supplierSpend } from "./reports-data"

export function SupplierSpendCard() {
  return (
    <div>
      <Card className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none">
        <CardContent className="p-6">
          <h3 className="mb-6 font-semibold text-white">
            Supplier Spend Distribution
          </h3>

          <div className="overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#0A0A0A]">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2A2A2A]">
                    <th className="px-4 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                      Supplier
                    </th>
                    <th className="px-4 py-4 text-right text-sm font-semibold text-[#9CA3AF]">
                      Total orders
                    </th>
                    <th className="px-4 py-4 text-right text-sm font-semibold text-[#9CA3AF]">
                      Total value
                    </th>
                    <th className="px-4 py-4 text-right text-sm font-semibold text-[#9CA3AF]">
                      Avg Order Value
                    </th>
                    <th className="px-4 py-4 text-right text-sm font-semibold text-[#9CA3AF]">
                      % of value
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {supplierSpend.map((supplier) => (
                    <tr
                      key={supplier.name}
                      className="border-b border-[#2A2A2A] transition-colors hover:bg-[#0A0A0A]"
                    >
                      <td className="px-4 py-4 font-medium text-white">
                        {supplier.name}
                      </td>
                      <td className="px-4 py-4 text-right text-white">
                        {supplier.orders}
                      </td>
                      <td className="px-4 py-4 text-right text-white">
                        {supplier.spent}
                      </td>
                      <td className="px-4 py-4 text-right text-[#9CA3AF]">
                        {supplier.avgOrder}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-2 w-20 rounded-full bg-[#0A0A0A]">
                            <div
                              className="h-2 rounded-full bg-[#DC2626]"
                              style={{ width: `${supplier.share}%` }}
                            />
                          </div>
                          <span className="w-12 text-right text-white">
                            {supplier.share.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
