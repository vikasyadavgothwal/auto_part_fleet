"use client"

import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { appPath, appRoutes } from "@/lib/routes"
import type { FleetAddressRecord } from "@/lib/fleet-addresses"
import type { FleetRfq } from "./rfqs-data"

const money = (value: number) => `AED ${value.toLocaleString("en-AE", { minimumFractionDigits: 2 })}`

const deliveryOptionLabel = (value: string | null | undefined) => {
  switch (value) {
    case "24_hours":
      return "24 hours"
    case "48_hours":
      return "48 hours"
    case "72_hours":
      return "72 hours"
    case "one_month":
      return "One month"
    case "more_than_one_month":
      return "More than one month"
    default:
      return "-"
  }
}

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

const quoteCountLabel = (rfq: FleetRfq) => {
  if (rfq.quoteWindowActive) return "Ranking in progress"
  return `${rfq.bids.length} shown`
}

const quoteWindowMessage = (rfq: FleetRfq) => {
  if (!rfq.quoteWindowActive) return null
  const endsAt = rfq.quoteWindowEndsAt
    ? new Date(rfq.quoteWindowEndsAt).toLocaleString("en-AE")
    : "the quote window closes"
  return `Suppliers are quoting. Top six quotes will be shown after ${endsAt}.`
}

const addressOptionLabel = (address: FleetAddressRecord) =>
  `${address.label}${address.isDefault ? " (Default)" : ""} - ${address.city}`

const addressSummary = (address: FleetAddressRecord) =>
  [
    address.recipientName,
    address.phone,
    address.addressLine1,
    address.addressLine2,
    address.landmark,
    address.city,
    address.state,
    address.country,
  ]
    .filter(Boolean)
    .join(", ")

export function RfqsTable({ rfqs, onAccepted }: {
  rfqs: FleetRfq[]
  onAccepted: (rfqId: string, bidId: string, order: NonNullable<FleetRfq["order"]>) => void
}) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [confirmBidId, setConfirmBidId] = React.useState<string | null>(null)
  const [accepting, setAccepting] = React.useState<string | null>(null)
  const [addresses, setAddresses] = React.useState<FleetAddressRecord[]>([])
  const [selectedAddressId, setSelectedAddressId] = React.useState("")
  const [isLoadingAddresses, setIsLoadingAddresses] = React.useState(false)
  const [error, setError] = React.useState("")
  const [createdOrderId, setCreatedOrderId] = React.useState<string | null>(null)
  const selected = rfqs.find((rfq) => rfq.id === selectedId) ?? null
  const confirmBid = selected?.bids.find((bid) => bid.id === confirmBidId) ?? null
  const selectedAddress = addresses.find((address) => address.id === selectedAddressId) ?? null
  const shouldLoadAddresses = Boolean(selected && !selected.order && selected.status === "open")

  const openRfq = (rfq: FleetRfq) => {
    setSelectedId(rfq.id)
    setConfirmBidId(null)
    setAddresses([])
    setSelectedAddressId("")
    setIsLoadingAddresses(!rfq.order && rfq.status === "open")
    setError("")
  }

  const openConfirmBid = (bidId: string) => {
    setError("")
    setConfirmBidId(bidId)
  }

  React.useEffect(() => {
    if (!shouldLoadAddresses) return

    let mounted = true
    authenticatedFetch(appPath("/api/addresses"), {
      method: "GET",
      cache: "no-store",
    })
      .then(async (response) => {
        const payload = (await response.json()) as {
          ok: boolean
          addresses?: FleetAddressRecord[]
          message?: string
        }
        if (!response.ok || !payload.ok) {
          throw new Error(payload.message || "Unable to load delivery addresses")
        }
        if (!mounted) return
        const nextAddresses = payload.addresses ?? []
        setAddresses(nextAddresses)
        setSelectedAddressId(
          (current) =>
            (current && nextAddresses.some((address) => address.id === current)
              ? current
              : "") ||
            nextAddresses.find((address) => address.isDefault)?.id ||
            nextAddresses[0]?.id ||
            "",
        )
      })
      .catch((caught) => {
        if (mounted) {
          setError(
            caught instanceof Error
              ? caught.message
              : "Unable to load delivery addresses",
          )
        }
      })
      .finally(() => {
        if (mounted) setIsLoadingAddresses(false)
      })

    return () => {
      mounted = false
    }
  }, [selectedId, shouldLoadAddresses])

  const acceptBid = async (bidId: string) => {
    if (!selected) return
    const isExistingOrderPayment = selected.order?.bidId === bidId
    if (!isExistingOrderPayment && !selectedAddressId) {
      setError("Select a delivery address before creating an order")
      return
    }
    setAccepting(bidId)
    setError("")
    try {
      const response = await authenticatedFetch(
        appPath(`/api/rfqs/${selected.id}/bids/${bidId}/accept`),
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            ...(selectedAddressId ? { addressId: selectedAddressId } : {}),
            paymentSuccessUrl: `${window.location.origin}${appPath("/payments")}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            paymentCancelUrl: `${window.location.origin}${appPath("/payments")}?payment=cancelled`,
          }),
        },
      )
      const payload = await response.json() as {
        ok: boolean
        order?: NonNullable<FleetRfq["order"]>
        payment?: { checkoutUrl?: string | null; stripeConfigured?: boolean } | null
        message?: string
      }
      if (!response.ok || !payload.ok || !payload.order) throw new Error(payload.message || "Unable to accept quote")
      if (payload.payment?.checkoutUrl) {
        window.location.assign(payload.payment.checkoutUrl)
        return
      }
      if (payload.payment?.stripeConfigured === false) {
        throw new Error("Payment gateway is not configured. Contact support to complete payment.")
      }
      onAccepted(selected.id, bidId, payload.order)
      setCreatedOrderId(payload.order.publicId)
      setConfirmBidId(null)
      setSelectedAddressId("")
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to accept quote")
    } finally {
      setAccepting(null)
    }
  }

  const renderAddressSelector = (inputId: string) => (
    <div className="space-y-2 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-4 text-sm">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <label htmlFor={inputId} className="font-medium">
          Delivery address
        </label>
        <Link href={appRoutes.settings} className="text-xs font-medium text-[#DC2626] hover:text-[#F87171]">
          Manage addresses
        </Link>
      </div>
      {isLoadingAddresses ? (
        <p className="text-[#9CA3AF]">Loading saved addresses...</p>
      ) : addresses.length ? (
        <>
          <select
            id={inputId}
            value={selectedAddressId}
            onChange={(event) => setSelectedAddressId(event.target.value)}
            className="h-11 w-full rounded-sm border border-[#2A2A2A] bg-[#0A0A0A] px-3 text-white outline-none focus-visible:border-[#DC2626]"
          >
            <option value="">Select delivery address</option>
            {addresses.map((address) => (
              <option key={address.id} value={address.id}>
                {addressOptionLabel(address)}
              </option>
            ))}
          </select>
          {selectedAddress ? (
            <p className="break-words text-xs leading-5 text-[#9CA3AF]">
              {addressSummary(selectedAddress)}
            </p>
          ) : null}
        </>
      ) : (
        <div className="space-y-3">
          <p className="text-[#9CA3AF]">
            Add a saved delivery address before creating an order.
          </p>
          <Link href={appRoutes.settings}>
            <Button type="button" variant="outline">
              Add address in Settings
            </Button>
          </Link>
        </div>
      )}
    </div>
  )

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
        const vehicleCount = new Set(rfq.parts.map((part) => part.vehicleVin).filter(Boolean)).size
        const vehicle = vehicleCount > 1 ? `${vehicleCount} vehicles` : [rfq.vehicleYear, rfq.vehicleMake, rfq.vehicleModel].filter(Boolean).join(" ")
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
            <span className="font-semibold text-[#DC2626]">{quoteCountLabel(rfq)}</span>
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
              onClick={() => openRfq(rfq)}
            >
              {rfq.order ? "View" : "View Quotes"}
            </Button>
          </td>
        </tr>
      )})}
    </SectionTable>
    <Dialog
      open={Boolean(selected)}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedId(null)
          setConfirmBidId(null)
          setAddresses([])
          setSelectedAddressId("")
          setIsLoadingAddresses(false)
          setError("")
        }
      }}
    >
      <DialogContent className="max-h-[92vh] overflow-y-auto border-[#2A2A2A] bg-[#151515] text-white sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{selected?.publicId}: {selected?.projectName}</DialogTitle>
          <DialogDescription>{selected?.description || "Review all supplier quotes and select the best offer."}</DialogDescription>
        </DialogHeader>
        {selected ? (
          <div className="space-y-6">
            <div className="grid gap-3 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-4 text-sm md:grid-cols-2">
              {new Set(selected.parts.map((part) => part.vehicleVin).filter(Boolean)).size <= 1 ? <><p><span className="text-[#9CA3AF]">Vehicle:</span> {[selected.vehicleYear, selected.vehicleMake, selected.vehicleModel, selected.vehicleTrim].filter(Boolean).join(" ")}</p><p><span className="text-[#9CA3AF]">VIN:</span> {selected.vehicleVin || "-"}</p></> : null}
              <p><span className="text-[#9CA3AF]">Deadline:</span> {new Date(selected.responseDeadline).toLocaleDateString("en-AE")}</p>
              {selected.order ? <p><span className="text-[#9CA3AF]">Order:</span> <strong className="text-green-500">{selected.order.publicId}</strong></p> : null}
              {selected.order ? <p><span className="text-[#9CA3AF]">Payment:</span> <span className={selected.order.paymentStatus === "succeeded" ? "text-green-400" : "text-yellow-400"}>{selected.order.paymentStatus === "succeeded" ? "Paid" : selected.order.paymentStatus}</span></p> : null}
            </div>
            {selected.order?.paymentStatus === "pending" ? (
              <div className="flex flex-col gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-100 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Order {selected.order.publicId} is created but payment is still pending.
                </p>
                <Button
                  type="button"
                  disabled={accepting === selected.order.bidId}
                  onClick={() => void acceptBid(selected.order!.bidId)}
                  className="bg-[#DC2626] text-white hover:bg-[#B91C1C]"
                >
                  {accepting === selected.order.bidId ? "Opening payment..." : "Pay Now"}
                </Button>
              </div>
            ) : null}
            <div>
              <div className="mb-3 flex items-center justify-between gap-3"><h3 className="font-semibold">Requested parts</h3><span className="text-sm text-[#9CA3AF]">Supplier quotations ({quoteCountLabel(selected)})</span></div>
              {quoteWindowMessage(selected) ? <p className="mb-3 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-3 text-sm text-[#9CA3AF]">{quoteWindowMessage(selected)}</p> : null}
              <div className="overflow-x-auto rounded-lg border border-[#2A2A2A]">
                <table className="w-full min-w-[760px] text-sm">
                  <thead className="bg-[#0A0A0A] text-[#9CA3AF]"><tr><th rowSpan={2} className="p-3 text-left">VIN</th><th rowSpan={2} className="p-3 text-left">Part</th><th rowSpan={2} className="p-3 text-left">Number</th><th rowSpan={2} className="p-3 text-left">Qty</th><th rowSpan={2} className="p-3 text-left">Target</th>{selected.bids.map((bid, index) => { const name = bid.supplier.companyName || [bid.supplier.firstName, bid.supplier.lastName].filter(Boolean).join(" ") || bid.supplier.email || "Supplier"; return <th key={bid.id} colSpan={4} className="border-l border-[#2A2A2A] p-3 text-left"><div className="flex min-w-[410px] items-center justify-between gap-3"><div><div className="mb-1 flex items-center gap-2"><p className="font-semibold text-white">Vendor {index + 1}</p>{bid.featuredSupplier ? <Badge className="rounded-full bg-[#DC2626] px-2 py-0.5 text-[11px] text-white">Featured supplier</Badge> : null}</div><p className="text-xs font-normal">{name} · {money(bid.totalAmount)} · up to {bid.deliveryDays} days</p></div>{selected.status === "open" && bid.status === "submitted" ? <Button size="sm" disabled={Boolean(accepting)} onClick={() => openConfirmBid(bid.id)} className="bg-[#DC2626] text-white hover:bg-[#B91C1C]">Accept Bid</Button> : <span className="text-xs capitalize">{bid.status}</span>}</div></th> })}</tr><tr>{selected.bids.map((bid) => <React.Fragment key={bid.id}><th className="border-l border-t border-[#2A2A2A] p-2 text-left">Condition</th><th className="border-t border-[#2A2A2A] p-2 text-left">Delivery</th><th className="border-t border-[#2A2A2A] p-2 text-right">Unit Price</th><th className="border-t border-[#2A2A2A] p-2 text-right">Line Total</th></React.Fragment>)}</tr></thead>
                  <tbody>{selected.parts.map((part) => <tr key={part.id} className="border-t border-[#2A2A2A]"><td className="p-3 font-mono text-xs">{part.vehicleVin || selected.vehicleVin || "-"}</td><td className="p-3 font-medium text-white">{part.partName}</td><td className="p-3">{part.partNumber || "-"}</td><td className="p-3">{part.quantity}</td><td className="p-3">{part.targetPrice === null ? "-" : money(part.targetPrice)}</td>{selected.bids.map((bid) => { const item = bid.items.find((entry) => entry.rfqPartId === part.id); return <React.Fragment key={bid.id}><td className="border-l border-[#2A2A2A] p-3">{item?.partType || "Pending"}</td><td className="p-3">{item ? deliveryOptionLabel(item.deliveryOption) : "-"}</td><td className="p-3 text-right">{item ? money(item.unitPrice) : "-"}</td><td className="p-3 text-right font-medium text-white">{item ? money(item.lineTotal) : "-"}</td></React.Fragment> })}</tr>)}</tbody>
                </table>
              </div>
              {!selected.bids.length ? <p className="border-x border-b border-[#2A2A2A] p-4 text-sm text-[#9CA3AF]">{quoteWindowMessage(selected) ?? "No ranked supplier quotations are available yet."}</p> : null}
            </div>
            {!selected.order && selected.status === "open" ? renderAddressSelector("fleet-rfq-order-address") : null}
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
          <div className="space-y-4">
          <div className="space-y-3 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-4 text-sm">
            <div className="flex justify-between gap-4"><span className="text-[#9CA3AF]">Supplier</span><span className="text-right font-medium">{confirmBid.supplier.companyName || [confirmBid.supplier.firstName, confirmBid.supplier.lastName].filter(Boolean).join(" ") || confirmBid.supplier.email || "Supplier"}</span></div>
            <div className="flex justify-between gap-4"><span className="text-[#9CA3AF]">Total quote</span><strong>{money(confirmBid.totalAmount)}</strong></div>
            {selected?.parts.map((part) => { const item = confirmBid.items.find((entry) => entry.rfqPartId === part.id); return item ? <div key={part.id} className="border-t border-[#2A2A2A] pt-3"><div className="flex justify-between gap-4"><span>{part.partName} × {part.quantity}</span><strong>{money(item.lineTotal)}</strong></div><p className="mt-1 text-xs text-[#9CA3AF]">{item.partType} · {deliveryOptionLabel(item.deliveryOption)} · {money(item.unitPrice)} each</p></div> : null })}
            <div className="flex justify-between gap-4"><span className="text-[#9CA3AF]">Delivery</span><span>{confirmBid.deliveryDays} days</span></div>
          </div>
          {renderAddressSelector("fleet-confirm-order-address")}
          </div>
        ) : null}
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        <DialogFooter>
          <Button variant="outline" disabled={Boolean(accepting)} onClick={() => setConfirmBidId(null)}>Cancel</Button>
          <Button disabled={!confirmBid || Boolean(accepting) || !selectedAddressId} onClick={() => confirmBid && void acceptBid(confirmBid.id)} className="bg-[#DC2626] text-white hover:bg-[#B91C1C]">{accepting ? "Creating payment..." : "Accept Bid & Pay"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <Dialog open={Boolean(createdOrderId)} onOpenChange={(open) => { if (!open) setCreatedOrderId(null) }}>
      <DialogContent className="border-[#2A2A2A] bg-[#151515] text-white sm:max-w-md">
        <DialogHeader>
              <DialogTitle>Order created</DialogTitle>
              <DialogDescription>Your order is waiting for payment.</DialogDescription>
        </DialogHeader>
        {createdOrderId ? <p className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-4 text-sm">Order: <span className="font-semibold text-green-400">{createdOrderId}</span></p> : null}
        <DialogFooter>
          <Button type="button" onClick={() => setCreatedOrderId(null)} className="bg-[#DC2626] text-white hover:bg-[#B91C1C]">Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}
