import Link from "next/link"

import { Card, CardContent } from "@/components/ui/card"
import type { DashboardTopSupplier } from "@/lib/fleet-analytics"
import { appRoutes } from "@/lib/routes"

export function TopSuppliersCard({
  suppliers,
}: {
  suppliers: DashboardTopSupplier[]
}) {
  return (
    <Card className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">
            Top Suppliers This Month
          </h2>
          <Link
            href={appRoutes.suppliers}
            className="text-sm font-medium text-[#DC2626] transition-colors hover:text-[#B91C1C]"
          >
            View All
          </Link>
        </div>

        {suppliers.length ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {suppliers.map((supplier) => (
              <div
                key={supplier.name}
                className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-4"
              >
                <div className="mb-3 font-semibold text-white">
                  {supplier.name}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Orders:</span>
                    <span className="font-medium text-white">
                      {supplier.orders}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Total Spend:</span>
                    <span className="font-medium text-white">
                      {supplier.spend}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9CA3AF]">Rating:</span>
                    <span className="font-medium text-[#DC2626]">
                      {supplier.rating}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-6 text-center text-sm text-[#9CA3AF]">
            Top suppliers will appear here after supplier quotes or orders are created.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
