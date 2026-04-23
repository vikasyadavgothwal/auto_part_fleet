import Link from "next/link"

import { Button } from "@/components/ui/button"
import { appRoutes } from "@/lib/routes"

import { SectionTable } from "../shared/section-table"
import { StatusBadge } from "../shared/status-badge"
import { rfqs } from "./dashboard-data"

export function ActiveRfqsSection() {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Active RFQs</h2>
        <div className="flex items-center gap-4">
          <Link
            href={appRoutes.rfqs}
            className="text-sm font-medium text-[#DC2626] transition-colors hover:text-[#B91C1C]"
          >
            View All
          </Link>
          <Link href={appRoutes.createRfq}>
            <Button className="bg-[#DC2626] text-white hover:bg-[#B91C1C]">
              Create RFQ
            </Button>
          </Link>
        </div>
      </div>

      <SectionTable
        headers={[
          "RFQ ID",
          "Vehicles",
          "Parts Requested",
          "Quotes",
          "Status",
          "Expires",
        ]}
      >
        {rfqs.map((row) => (
          <tr
            key={row.id}
            className="cursor-pointer border-b border-[#2A2A2A] transition-colors hover:bg-[#2A2A2A]"
          >
            <td className="px-6 py-4 text-sm text-[#9CA3AF]">
              <span className="font-medium text-[#DC2626]">{row.id}</span>
            </td>
            <td className="px-6 py-4 text-sm text-[#9CA3AF]">
              {row.vehicles}
            </td>
            <td className="px-6 py-4 text-sm text-[#9CA3AF]">{row.parts}</td>
            <td className="px-6 py-4 text-sm text-[#9CA3AF]">
              <span className="font-semibold text-[#DC2626]">
                {row.quotes}
              </span>
            </td>
            <td className="px-6 py-4 text-sm text-[#9CA3AF]">
              <StatusBadge status={row.status} />
            </td>
            <td className="px-6 py-4 text-sm text-[#9CA3AF]">
              {row.expires}
            </td>
          </tr>
        ))}
      </SectionTable>
    </div>
  )
}
