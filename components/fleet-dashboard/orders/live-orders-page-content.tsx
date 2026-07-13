"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { authenticatedFetch } from "@/lib/auth/client"
import { appPath } from "@/lib/routes"
import { PageHeading } from "../shared/page-heading"
import { StatusBadge } from "../shared/status-badge"
import type { LiveOrder, OrderPagination, OrderSummary } from "./live-types"

const money = (amount: number) => `AED ${amount.toLocaleString("en-AE", { minimumFractionDigits: 2 })}`
const supplierName = (order: LiveOrder) => order.supplier.companyName || [order.supplier.firstName, order.supplier.lastName].filter(Boolean).join(" ") || order.supplier.email || "Supplier"
const labelStatus = (status: LiveOrder["status"]) => status.charAt(0).toUpperCase() + status.slice(1)

export function LiveOrdersPageContent({ initialOrders, initialPagination, initialSummary }: {
  initialOrders: LiveOrder[]
  initialPagination: OrderPagination
  initialSummary: OrderSummary
}) {
  const [orders, setOrders] = React.useState(initialOrders)
  const [pagination, setPagination] = React.useState(initialPagination)
  const [summary, setSummary] = React.useState(initialSummary)
  const [search, setSearch] = React.useState("")
  const [selected, setSelected] = React.useState<LiveOrder | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const load = async (page: number, query = search) => {
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: "10", search: query.trim() })
      const response = await authenticatedFetch(appPath(`/api/orders?${params}`))
      const payload = await response.json() as { ok: boolean; orders?: LiveOrder[]; pagination?: OrderPagination; summary?: OrderSummary; message?: string }
      if (!response.ok || !payload.ok || !payload.orders || !payload.pagination || !payload.summary) throw new Error(payload.message || "Unable to load orders")
      setOrders(payload.orders)
      setPagination(payload.pagination)
      setSummary(payload.summary)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load orders")
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { title: "Total Orders", value: String(summary.totalOrders), valueClass: "text-white" },
    { title: "Processing", value: String((summary.byStatus.pending ?? 0) + (summary.byStatus.confirmed ?? 0) + (summary.byStatus.processing ?? 0)), valueClass: "text-yellow-500" },
    { title: "Shipped", value: String(summary.byStatus.shipped ?? 0), valueClass: "text-blue-500" },
    { title: "Total Spent", value: money(summary.totalAmount), valueClass: "text-[#DC2626]" },
  ]

  return <div className="min-h-screen bg-[#0A0A0A]"><div className="space-y-8">
    <PageHeading title="Fleet Orders" description="Track RFQ and direct orders for your fleet." />
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">{stats.map((stat) => <Card key={stat.title} className="border-[#2A2A2A] bg-[#1A1A1A]"><CardContent className="p-6"><p className="mb-2 text-sm text-[#9CA3AF]">{stat.title}</p><p className={`text-3xl font-bold ${stat.valueClass}`}>{stat.value}</p></CardContent></Card>)}</div>
    <form className="flex max-w-2xl gap-2" onSubmit={(event) => { event.preventDefault(); void load(1) }}><div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order ID, RFQ, supplier, or part..." className="border-[#2A2A2A] bg-[#1A1A1A] pl-9 text-white" /></div><Button type="submit" disabled={loading} className="bg-[#DC2626] text-white hover:bg-[#B91C1C]">Search</Button>{search ? <Button type="button" variant="outline" onClick={() => { setSearch(""); void load(1, "") }}>Clear</Button> : null}</form>
    {error ? <p className="text-sm text-red-400">{error}</p> : null}
    <div className="overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#1A1A1A]"><div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-sm"><thead className="bg-[#0A0A0A] text-[#9CA3AF]"><tr><th className="p-4 text-left">Order ID</th><th className="p-4 text-left">Date</th><th className="p-4 text-left">Supplier</th><th className="p-4 text-left">Type</th><th className="p-4 text-left">Parts</th><th className="p-4 text-left">Vehicle</th><th className="p-4 text-left">Total</th><th className="p-4 text-left">Status</th><th className="p-4 text-left">Actions</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id} className="border-t border-[#2A2A2A] text-[#9CA3AF] hover:bg-[#242424]"><td className="p-4 font-semibold text-[#DC2626]">{order.publicId}</td><td className="p-4">{new Date(order.createdAt).toLocaleDateString("en-AE")}</td><td className="p-4 text-white">{supplierName(order)}</td><td className="p-4">{order.source === "rfq" ? "RFQ" : "Direct"}</td><td className="p-4">{order.items[0]?.partName || "-"}{order.items.length > 1 ? ` +${order.items.length - 1}` : ""}</td><td className="p-4">{order.rfq ? [order.rfq.vehicleYear, order.rfq.vehicleMake, order.rfq.vehicleModel].filter(Boolean).join(" ") : "-"}</td><td className="p-4 font-semibold text-white">{money(order.totalAmount)}</td><td className="p-4"><StatusBadge status={labelStatus(order.status)} /></td><td className="p-4"><Button size="sm" variant="secondary" className="bg-[#2A2A2A] text-white hover:bg-[#DC2626]" onClick={() => setSelected(order)}>View</Button></td></tr>)}</tbody></table></div>{!orders.length && !loading ? <p className="p-8 text-center text-[#9CA3AF]">No orders found.</p> : null}</div>
    <div className="flex flex-col gap-3 text-sm text-[#9CA3AF] sm:flex-row sm:items-center sm:justify-between"><p>Showing {orders.length ? (pagination.page - 1) * pagination.pageSize + 1 : 0}-{Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}</p><div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled={loading || pagination.page <= 1} onClick={() => void load(pagination.page - 1)}>Previous</Button><span>Page {pagination.page} of {pagination.totalPages}</span><Button variant="outline" size="sm" disabled={loading || pagination.page >= pagination.totalPages} onClick={() => void load(pagination.page + 1)}>Next</Button></div></div>
  </div>
  <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}><DialogContent className="max-h-[92vh] overflow-y-auto border-[#2A2A2A] bg-[#151515] text-white sm:max-w-3xl"><DialogHeader><DialogTitle>{selected?.publicId}</DialogTitle><DialogDescription>{selected?.source === "rfq" ? `${selected.rfq?.publicId}: ${selected.rfq?.projectName}` : "Direct supplier order"}</DialogDescription></DialogHeader>{selected ? <div className="space-y-5"><div className="grid gap-2 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-4 text-sm sm:grid-cols-2"><p><span className="text-[#9CA3AF]">Supplier:</span> {supplierName(selected)}</p><p><span className="text-[#9CA3AF]">Total:</span> {money(selected.totalAmount)}</p><p><span className="text-[#9CA3AF]">Status:</span> {labelStatus(selected.status)}</p><p><span className="text-[#9CA3AF]">Created:</span> {new Date(selected.createdAt).toLocaleString("en-AE")}</p>{selected.rfq ? <><p><span className="text-[#9CA3AF]">Delivery:</span> {selected.rfq.deliveryRequirement}</p><p><span className="text-[#9CA3AF]">Payment:</span> {selected.rfq.paymentTerms}</p><p><span className="text-[#9CA3AF]">VIN:</span> {selected.rfq.vehicleVin || "-"}</p></> : null}</div><div><h3 className="mb-2 font-semibold">Items</h3>{selected.items.map((item) => <div key={item.id} className="flex justify-between gap-4 border-t border-[#2A2A2A] py-3 text-sm"><div><p>{item.partName}</p><p className="text-[#9CA3AF]">{item.partNumber || "No part number"}</p></div><div className="text-right"><p>Qty {item.quantity}</p><p>{item.lineTotal === null ? "Included in quote" : money(item.lineTotal)}</p></div></div>)}</div></div> : null}</DialogContent></Dialog>
  </div>
}
