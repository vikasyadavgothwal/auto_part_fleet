import { cookies } from "next/headers"

import { VehiclesPageContent } from "@/components/fleet-dashboard/vehicles/vehicles-page-content"
import type { VehiclesResponse } from "@/components/fleet-dashboard/vehicles/types"
import { requestBackend } from "@/lib/auth/backend"

export default async function FleetVehiclesPage() {
  let payload: VehiclesResponse = { ok: true, vehicles: [], pagination: { page: 1, pageSize: 10, total: 0, totalPages: 1 } }
  let error: string | null = null
  try {
    const response = await requestBackend("/api/v1/fleet/vehicles?page=1&pageSize=10", { cookieHeader: (await cookies()).toString() })
    payload = (await response.json()) as VehiclesResponse
    if (!response.ok || !payload.ok) throw new Error(payload.message ?? "Unable to load vehicles")
  } catch (loadError) {
    error = loadError instanceof Error ? loadError.message : "Unable to load vehicles"
  }
  return <VehiclesPageContent initialVehicles={payload.vehicles ?? []} initialPagination={payload.pagination ?? { page: 1, pageSize: 10, total: 0, totalPages: 1 }} initialError={error} />
}
