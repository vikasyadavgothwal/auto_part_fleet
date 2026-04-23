import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"

import { SectionTable } from "../shared/section-table"
import { StatusBadge } from "../shared/status-badge"
import { suppliers } from "./suppliers-data"

export function SuppliersTable() {
  return (
    <SectionTable
      headers={[
        "Supplier ID",
        "Supplier Name",
        "Rating",
        "Orders",
        "Total Spent",
        "Avg Delivery",
        "On-Time Rate",
        "Status",
        "",
      ]}
    >
      {suppliers.map((supplier) => (
        <tr
          key={supplier.id}
          className="cursor-pointer border-b border-[#2A2A2A] transition-colors hover:bg-[#2A2A2A]"
        >
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <span className="font-medium text-[#DC2626]">{supplier.id}</span>
          </td>

          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <div>
              <div className="font-medium text-white">{supplier.name}</div>
              <div className="text-sm text-[#9CA3AF]">{supplier.type}</div>
            </div>
          </td>

          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span className="font-medium text-white">{supplier.rating}</span>
            </div>
          </td>

          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <span className="text-white">{supplier.orders}</span>
          </td>

          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <span className="font-medium text-white">{supplier.spent}</span>
          </td>

          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            {supplier.delivery}
          </td>

          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <span className="font-medium text-green-500">
              {supplier.onTime}
            </span>
          </td>

          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <StatusBadge status={supplier.status} />
          </td>

          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <Button
              size="sm"
              variant="secondary"
              className="bg-[#2A2A2A] text-white hover:bg-[#DC2626]"
            >
              View Details
            </Button>
          </td>
        </tr>
      ))}
    </SectionTable>
  )
}
