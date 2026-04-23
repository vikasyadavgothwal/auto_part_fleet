import { Button } from "@/components/ui/button"

import { SectionTable } from "../shared/section-table"
import { StatusBadge } from "../shared/status-badge"
import { orders } from "./orders-data"

export function OrdersTable() {
  return (
    <SectionTable
      headers={[
        "Order ID",
        "Date",
        "Parts",
        "Vehicles",
        "Supplier",
        "Total",
        "Status",
        "Actions",
      ]}
    >
      {orders.map((order) => (
        <tr
          key={order.id}
          className="cursor-pointer border-b border-[#2A2A2A] transition-colors hover:bg-[#2A2A2A]"
        >
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <span className="font-medium text-[#DC2626]">{order.id}</span>
          </td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">{order.date}</td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">{order.parts}</td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            {order.vehicles}
          </td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            {order.supplier}
          </td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <span className="font-semibold text-white">{order.total}</span>
          </td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <StatusBadge status={order.status} />
          </td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <Button
              size="sm"
              variant="secondary"
              className="bg-[#2A2A2A] text-white hover:bg-[#DC2626]"
            >
              View
            </Button>
          </td>
        </tr>
      ))}
    </SectionTable>
  )
}
