import Link from "next/link"

import { appRoutes } from "@/lib/routes"

import { SectionTable } from "../shared/section-table"
import { StatusBadge } from "../shared/status-badge"
import { orders } from "./dashboard-data"

export function RecentOrdersSection() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Recent Orders</h2>
        <Link
          href={appRoutes.orders}
          className="text-sm font-medium text-[#DC2626] transition-colors hover:text-[#B91C1C]"
        >
          View All
        </Link>
      </div>

      <SectionTable
        headers={[
          "Order ID",
          "Supplier",
          "Items",
          "Vehicles",
          "Amount",
          "Status",
          "ETA",
        ]}
      >
        {orders.map((row) => (
          <tr
            key={row.id}
            className="cursor-pointer border-b border-[#2A2A2A] transition-colors hover:bg-[#2A2A2A]"
          >
            <td className="px-6 py-4 text-sm text-[#9CA3AF]">
              <span className="font-medium text-[#DC2626]">{row.id}</span>
            </td>
            <td className="px-6 py-4 text-sm text-[#9CA3AF]">
              {row.supplier}
            </td>
            <td className="px-6 py-4 text-sm text-[#9CA3AF]">{row.items}</td>
            <td className="px-6 py-4 text-sm text-[#9CA3AF]">
              {row.vehicles}
            </td>
            <td className="px-6 py-4 text-sm text-[#9CA3AF]">
              <span className="font-semibold text-white">{row.amount}</span>
            </td>
            <td className="px-6 py-4 text-sm text-[#9CA3AF]">
              <StatusBadge status={row.status} />
            </td>
            <td className="px-6 py-4 text-sm text-[#9CA3AF]">{row.eta}</td>
          </tr>
        ))}
      </SectionTable>
    </div>
  )
}
