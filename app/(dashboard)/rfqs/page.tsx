import { cookies } from "next/headers"

import { FleetRfqsPageContent } from "@/components/fleet-dashboard/rfqs/fleet-rfqs-page-content"
import { AccessRestrictedCard } from "@/components/fleet-dashboard/shared/access-restricted-card"
import type { FleetRfq, RfqPagination } from "@/components/fleet-dashboard/rfqs/rfqs-data"
import { requestBackend } from "@/lib/auth/backend"
import { getFleetBusinessAccess } from "@/lib/business-access.server"

export default async function FleetRfqsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>
}) {
  const access = await getFleetBusinessAccess()
  if (!access.canView("rfqs")) return <AccessRestrictedCard message="You do not have permission to view Fleet RFQs." />

  let rfqs: FleetRfq[] = []
  let pagination: RfqPagination = { page: 1, pageSize: 10, total: 0, totalPages: 1 }
  try {
    const response = await requestBackend("/api/v1/rfqs?page=1&pageSize=10", { cookieHeader: (await cookies()).toString() })
    const payload = await response.json() as { ok: boolean; rfqs?: FleetRfq[]; pagination?: RfqPagination }
    if (response.ok && payload.ok) {
      rfqs = payload.rfqs ?? []
      pagination = payload.pagination ?? pagination
    }
  } catch {}
  const { created } = await searchParams
  return <FleetRfqsPageContent initialRfqs={rfqs} initialPagination={pagination} createdRfqId={created || null} />
}
