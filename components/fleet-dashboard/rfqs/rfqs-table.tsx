import { Button } from "@/components/ui/button"

import { SectionTable } from "../shared/section-table"
import { StatusBadge } from "../shared/status-badge"
import { rfqs } from "./rfqs-data"

export function RfqsTable() {
  return (
    <SectionTable
      headers={[
        "RFQ ID",
        "Date",
        "Parts",
        "Vehicles",
        "Quotes",
        "Best Price",
        "Status",
        "Expires",
        "",
      ]}
    >
      {rfqs.map((rfq) => (
        <tr
          key={rfq.id}
          className="cursor-pointer border-b border-[#2A2A2A] transition-colors hover:bg-[#2A2A2A]"
        >
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <span className="font-medium text-[#DC2626]">{rfq.id}</span>
          </td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">{rfq.date}</td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">{rfq.parts}</td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            {rfq.vehicles}
          </td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <span className="font-semibold text-[#DC2626]">{rfq.quotes}</span>
          </td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <span className="font-semibold text-white">{rfq.bestPrice}</span>
          </td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <StatusBadge status={rfq.status} />
          </td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">{rfq.expires}</td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <Button
              size="sm"
              className={
                rfq.actionPrimary
                  ? "bg-[#DC2626] text-white hover:bg-[#B91C1C]"
                  : "bg-[#2A2A2A] text-[#9CA3AF] hover:bg-[#2A2A2A]"
              }
            >
              {rfq.action}
            </Button>
          </td>
        </tr>
      ))}
    </SectionTable>
  )
}
