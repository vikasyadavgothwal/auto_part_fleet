"use client"

import * as React from "react"
import Link from "next/link"
import { CheckCircle2, Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authenticatedFetch } from "@/lib/auth/client"
import { appPath, appRoutes } from "@/lib/routes"
import { PageHeading } from "../shared/page-heading"
import { RfqBenefitsCard } from "./rfq-benefits-card"
import { RfqStatCards } from "./rfq-stat-cards"
import { RfqsTable } from "./rfqs-table"
import type { FleetRfq, RfqPagination } from "./rfqs-data"

export function FleetRfqsPageContent({ initialRfqs, initialPagination, createdRfqId }: {
  initialRfqs: FleetRfq[]
  initialPagination: RfqPagination
  createdRfqId: string | null
}) {
  const [rfqs, setRfqs] = React.useState(initialRfqs)
  const [pagination, setPagination] = React.useState(initialPagination)
  const [search, setSearch] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState("")

  const load = async (page: number, query = search) => {
    setLoading(true)
    setError("")
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: "10", search: query.trim() })
      const response = await authenticatedFetch(appPath(`/api/rfqs?${params}`))
      const payload = await response.json() as { ok: boolean; rfqs?: FleetRfq[]; pagination?: RfqPagination; message?: string }
      if (!response.ok || !payload.ok || !payload.rfqs || !payload.pagination) throw new Error(payload.message || "Unable to load RFQs")
      setRfqs(payload.rfqs)
      setPagination(payload.pagination)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load RFQs")
    } finally {
      setLoading(false)
    }
  }

  return <div className="space-y-8">
    <PageHeading title="Fleet RFQs" description="Manage bulk procurement requests for your fleet." action={<Link href={appRoutes.createRfq}><Button className="gap-2 bg-[#DC2626] text-white hover:bg-[#B91C1C]"><Plus className="h-5 w-5" />Create Bulk RFQ</Button></Link>} />
    {createdRfqId ? <div role="status" className="flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400"><CheckCircle2 className="h-5 w-5" /><span><strong>{createdRfqId === "1" ? "RFQ" : createdRfqId}</strong> created successfully. It is now available for supplier quotes.</span></div> : null}
    <RfqStatCards rfqs={rfqs} />
    <form className="flex max-w-2xl gap-2" onSubmit={(event) => { event.preventDefault(); void load(1) }}>
      <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search RFQ ID, project, vehicle, VIN, or part..." className="border-[#2A2A2A] bg-[#1A1A1A] pl-9 text-white" /></div>
      <Button type="submit" disabled={loading} className="bg-[#DC2626] text-white hover:bg-[#B91C1C]">Search</Button>
      {search ? <Button type="button" variant="outline" onClick={() => { setSearch(""); void load(1, "") }}>Clear</Button> : null}
    </form>
    {error ? <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{error}</p> : null}
    <RfqsTable rfqs={rfqs} onAccepted={(rfqId, bidId, order) => setRfqs((current) => current.map((rfq) => rfq.id === rfqId ? { ...rfq, status: "closed", order, bids: rfq.bids.map((bid) => ({ ...bid, status: bid.id === bidId ? "accepted" : bid.status === "submitted" ? "rejected" : bid.status })) } : rfq))} />
    <div className="flex flex-col gap-3 text-sm text-[#9CA3AF] sm:flex-row sm:items-center sm:justify-between">
      <p>Showing {rfqs.length ? (pagination.page - 1) * pagination.pageSize + 1 : 0}-{Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total} RFQs</p>
      <div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled={loading || pagination.page <= 1} onClick={() => void load(pagination.page - 1)}>Previous</Button><span>Page {pagination.page} of {pagination.totalPages}</span><Button variant="outline" size="sm" disabled={loading || pagination.page >= pagination.totalPages} onClick={() => void load(pagination.page + 1)}>Next</Button></div>
    </div>
    <RfqBenefitsCard />
  </div>
}
