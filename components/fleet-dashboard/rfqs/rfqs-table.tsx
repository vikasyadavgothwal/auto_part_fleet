"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { SectionTable } from "../shared/section-table"
import { StatusBadge } from "../shared/status-badge"
import { authenticatedFetch } from "@/lib/auth/client"
import { appPath } from "@/lib/routes"
import type { FleetRfq } from "./rfqs-data"

const money = (value: number) => `AED ${value.toLocaleString("en-AE", { minimumFractionDigits: 2 })}`

const expiryLabel = (rfq: FleetRfq) => {
  if (rfq.status !== "open") return "Completed"
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const deadline = new Date(rfq.responseDeadline)
  deadline.setHours(0, 0, 0, 0)
  const days = Math.ceil((deadline.getTime() - today.getTime()) / 86_400_000)
  if (days < 0) return "Expired"
  if (days === 0) return "Today"
  return `${days} day${days === 1 ? "" : "s"}`
}

export function RfqsTable({ rfqs, onAccepted }: {
  rfqs: FleetRfq[]
  onAccepted: (rfqId: string, bidId: string, order: NonNullable<FleetRfq["order"]>) => void
}) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [confirmBidId, setConfirmBidId] = React.useState<string | null>(null)
  const [accepting, setAccepting] = React.useState<string | null>(null)
  const [error, setError] = React.useState("")
  const selected = rfqs.find((rfq) => rfq.id === selectedId) ?? null
  const confirmBid = selected?.bids.find((bid) => bid.id === confirmBidId) ?? null

  const acceptBid = async (bidId: string) => {
    if (!selected) return
    setAccepting(bidId)
    setError("")
    try {
      const response = await authenticatedFetch(
        appPath(`/api/rfqs/${selected.id}/bids/${bidId}/accept`),
        { method: "POST" },
      )
      const payload = await response.json() as { ok: boolean; order?: NonNullable<FleetRfq["order"]>; message?: string }
      if (!response.ok || !payload.ok || !payload.order) throw new Error(payload.message || "Unable to accept quote")
      onAccepted(selected.id, bidId, payload.order)
      setConfirmBidId(null)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to accept quote")
    } finally {
      setAccepting(null)
    }
  }

  return (
    <>
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
      {rfqs.map((rfq) => {
        const bestBid = rfq.bids.filter((bid) => bid.status === "submitted" || bid.status === "accepted")[0]
        const vehicle = [rfq.vehicleYear, rfq.vehicleMake, rfq.vehicleModel].filter(Boolean).join(" ")
        return (
        <tr
          key={rfq.id}
          className="cursor-pointer border-b border-[#2A2A2A] transition-colors hover:bg-[#2A2A2A]"
        >
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <span className="font-medium text-[#DC2626]">{rfq.publicId}</span>
          </td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">{new Date(rfq.createdAt).toLocaleDateString("en-AE")}</td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">{rfq.parts.length} part{rfq.parts.length === 1 ? "" : "s"}</td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            {vehicle || "Not specified"}
          </td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <span className="font-semibold text-[#DC2626]">{rfq.bids.length} received</span>
          </td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <span className="font-semibold text-white">{bestBid ? money(bestBid.totalAmount) : "-"}</span>
          </td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <StatusBadge status={rfq.order ? "Accepted" : rfq.status === "open" ? "Active" : rfq.status} />
          </td>
          <td className="px-6 py-4 text-sm font-medium text-[#9CA3AF]">{expiryLabel(rfq)}</td>
          <td className="px-6 py-4 text-sm text-[#9CA3AF]">
            <Button
              size="sm"
              className="rounded-sm bg-[#DC2626] text-white hover:bg-[#B91C1C]"
              onClick={() => { setSelectedId(rfq.id); setError("") }}
            >
              {rfq.order ? "View" : "View Quotes"}
            </Button>
          </td>
        </tr>
      )})}
    </SectionTable>
    <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelectedId(null)}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-[#2A2A2A] bg-[#151515] text-white sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{selected?.publicId}: {selected?.projectName}</DialogTitle>
          <DialogDescription>{selected?.description || "Review all supplier quotes and select the best offer."}</DialogDescription>
        </DialogHeader>
        {selected ? (
          <div className="space-y-6">
            <div className="grid gap-3 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-4 text-sm md:grid-cols-2">
              <p><span className="text-[#9CA3AF]">Vehicle:</span> {[selected.vehicleYear, selected.vehicleMake, selected.vehicleModel, selected.vehicleTrim].filter(Boolean).join(" ")}</p>
              <p><span className="text-[#9CA3AF]">VIN:</span> {selected.vehicleVin || "-"}</p>
              <p><span className="text-[#9CA3AF]">Delivery:</span> {selected.deliveryRequirement}</p>
              <p><span className="text-[#9CA3AF]">Payment:</span> {selected.paymentTerms}</p>
              <p><span className="text-[#9CA3AF]">Deadline:</span> {new Date(selected.responseDeadline).toLocaleString("en-AE")}</p>
              {selected.order ? <p><span className="text-[#9CA3AF]">Order:</span> <strong className="text-green-500">{selected.order.publicId}</strong></p> : null}
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Requested parts</h3>
              <div className="overflow-x-auto rounded-lg border border-[#2A2A2A]">
                <table className="w-full min-w-[600px] text-sm">
                  <thead className="bg-[#0A0A0A] text-[#9CA3AF]"><tr><th className="p-3 text-left">Part</th><th className="p-3 text-left">Number</th><th className="p-3 text-left">Qty</th><th className="p-3 text-left">Target</th></tr></thead>
                  <tbody>{selected.parts.map((part) => <tr key={part.id} className="border-t border-[#2A2A2A]"><td className="p-3">{part.partName}</td><td className="p-3">{part.partNumber || "-"}</td><td className="p-3">{part.quantity}</td><td className="p-3">{part.targetPrice === null ? "-" : money(part.targetPrice)}</td></tr>)}</tbody>
                </table>
              </div>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Supplier quotes ({selected.bids.length})</h3>
              {selected.bids.length === 0 ? <p className="rounded-lg border border-[#2A2A2A] p-5 text-[#9CA3AF]">No supplier quotes received yet.</p> : (
                <div className="space-y-3">{selected.bids.map((bid) => {
                  const supplierName = bid.supplier.companyName || [bid.supplier.firstName, bid.supplier.lastName].filter(Boolean).join(" ") || bid.supplier.email || "Supplier"
                  return <div key={bid.id} className="flex flex-col gap-4 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-4 md:flex-row md:items-center md:justify-between">
                    <div><p className="font-semibold">{supplierName}</p><p className="mt-1 text-sm text-[#9CA3AF]">Delivery in {bid.deliveryDays} days{bid.notes ? ` · ${bid.notes}` : ""}</p><p className="mt-1 text-xs capitalize text-[#9CA3AF]">{bid.status}</p></div>
                    <div className="flex items-center gap-4"><strong className="text-lg">{money(bid.totalAmount)}</strong>{selected.status === "open" && bid.status === "submitted" ? <Button disabled={Boolean(accepting)} onClick={() => { setError(""); setConfirmBidId(bid.id) }} className="bg-[#DC2626] text-white hover:bg-[#B91C1C]">Accept Bid</Button> : null}</div>
                  </div>
                })}</div>
              )}
            </div>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
    <Dialog open={Boolean(confirmBid)} onOpenChange={(open) => { if (!open && !accepting) setConfirmBidId(null) }}>
      <DialogContent className="border-[#2A2A2A] bg-[#151515] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Accept supplier bid?</DialogTitle>
          <DialogDescription>
            This creates an order and rejects all other supplier bids for {selected?.publicId}.
          </DialogDescription>
        </DialogHeader>
        {confirmBid ? (
          <div className="space-y-3 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-4 text-sm">
            <div className="flex justify-between gap-4"><span className="text-[#9CA3AF]">Supplier</span><span className="text-right font-medium">{confirmBid.supplier.companyName || [confirmBid.supplier.firstName, confirmBid.supplier.lastName].filter(Boolean).join(" ") || confirmBid.supplier.email || "Supplier"}</span></div>
            <div className="flex justify-between gap-4"><span className="text-[#9CA3AF]">Total quote</span><strong>{money(confirmBid.totalAmount)}</strong></div>
            <div className="flex justify-between gap-4"><span className="text-[#9CA3AF]">Delivery</span><span>{confirmBid.deliveryDays} days</span></div>
          </div>
        ) : null}
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <DialogFooter>
          <Button variant="outline" disabled={Boolean(accepting)} onClick={() => setConfirmBidId(null)}>Cancel</Button>
          <Button disabled={!confirmBid || Boolean(accepting)} onClick={() => confirmBid && void acceptBid(confirmBid.id)} className="bg-[#DC2626] text-white hover:bg-[#B91C1C]">{accepting ? "Creating order..." : "Accept Bid & Create Order"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}
