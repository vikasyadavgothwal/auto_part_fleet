import { cookies } from "next/headers"

import { LiveOrdersPageContent } from "@/components/fleet-dashboard/orders/live-orders-page-content"
import { AccessRestrictedCard } from "@/components/fleet-dashboard/shared/access-restricted-card"
import type { LiveOrder, OrderPagination, OrderSummary } from "@/components/fleet-dashboard/orders/live-types"
import { requestBackend } from "@/lib/auth/backend"
import { getFleetBusinessAccess } from "@/lib/business-access.server"

export default async function FleetOrdersPage() {
  const access = await getFleetBusinessAccess()
  if (!access.canView("orders")) return <AccessRestrictedCard message="You do not have permission to view Fleet orders." />

  let orders: LiveOrder[] = []
  let pagination: OrderPagination = { page: 1, pageSize: 10, total: 0, totalPages: 1 }
  let summary: OrderSummary = { totalOrders: 0, totalAmount: 0, byStatus: {} }
  try {
    const response = await requestBackend("/api/v1/orders?page=1&pageSize=10", { cookieHeader: (await cookies()).toString() })
    const payload = await response.json() as { ok: boolean; orders?: LiveOrder[]; pagination?: OrderPagination; summary?: OrderSummary }
    if (response.ok && payload.ok) {
      orders = payload.orders ?? []
      pagination = payload.pagination ?? pagination
      summary = payload.summary ?? summary
    }
  } catch {}
  return <LiveOrdersPageContent initialOrders={orders} initialPagination={pagination} initialSummary={summary} />
}
