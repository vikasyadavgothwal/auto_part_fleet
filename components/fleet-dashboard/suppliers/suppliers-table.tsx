"use client"

import * as React from "react"
import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { AnalyticsSupplier } from "@/lib/fleet-analytics"

import { SectionTable } from "../shared/section-table"
import { StatusBadge } from "../shared/status-badge"

const money = (amount: number) =>
  `AED ${amount.toLocaleString("en-AE", { maximumFractionDigits: 0 })}`

export function SuppliersTable({ suppliers }: { suppliers: AnalyticsSupplier[] }) {
  const [selected, setSelected] = React.useState<AnalyticsSupplier | null>(null)

  return (
    <>
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
              <span className="font-medium text-[#DC2626]">{supplier.publicId}</span>
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
                <span className="font-medium text-white">{supplier.rating.toFixed(1)}</span>
              </div>
            </td>

            <td className="px-6 py-4 text-sm text-[#9CA3AF]">
              <span className="text-white">{supplier.orders}</span>
            </td>

            <td className="px-6 py-4 text-sm text-[#9CA3AF]">
              <span className="font-medium text-white">{money(supplier.spent)}</span>
            </td>

            <td className="px-6 py-4 text-sm text-[#9CA3AF]">
              {supplier.avgDeliveryDays === null ? "-" : `${supplier.avgDeliveryDays.toFixed(1)} days`}
            </td>

            <td className="px-6 py-4 text-sm text-[#9CA3AF]">
              <span className="font-medium text-green-500">
                {Math.round(supplier.onTimeRate)}%
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
                onClick={() => setSelected(supplier)}
              >
                View Details
              </Button>
            </td>
          </tr>
        ))}
        {!suppliers.length ? (
          <tr>
            <td colSpan={9} className="px-6 py-10 text-center text-sm text-[#9CA3AF]">
              Supplier activity will appear after RFQ quotes or orders are created.
            </td>
          </tr>
        ) : null}
      </SectionTable>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-[#2A2A2A] bg-[#151515] text-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
            <DialogDescription>
              {selected?.publicId} supplier performance from live RFQs and orders.
            </DialogDescription>
          </DialogHeader>
          {selected ? (
            <div className="grid gap-3 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-4 text-sm sm:grid-cols-2">
              <p><span className="text-[#9CA3AF]">Email:</span> {selected.email || "-"}</p>
              <p><span className="text-[#9CA3AF]">Type:</span> {selected.type}</p>
              <p><span className="text-[#9CA3AF]">Rating:</span> {selected.rating.toFixed(1)}</p>
              <p><span className="text-[#9CA3AF]">Status:</span> {selected.status}</p>
              <p><span className="text-[#9CA3AF]">Orders:</span> {selected.orders}</p>
              <p><span className="text-[#9CA3AF]">Total spent:</span> {money(selected.spent)}</p>
              <p><span className="text-[#9CA3AF]">Avg delivery:</span> {selected.avgDeliveryDays === null ? "-" : `${selected.avgDeliveryDays.toFixed(1)} days`}</p>
              <p><span className="text-[#9CA3AF]">On-time score:</span> {Math.round(selected.onTimeRate)}%</p>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  )
}
