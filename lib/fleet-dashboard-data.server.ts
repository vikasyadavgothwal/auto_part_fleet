import { cookies } from "next/headers"

import type {
  AnalyticsOrder,
  AnalyticsRfq,
  AnalyticsVehicle,
  FleetAnalyticsInput,
} from "@/lib/fleet-analytics"
import { requestBackend } from "@/lib/auth/backend"

type OrdersPayload = {
  ok: boolean
  orders?: AnalyticsOrder[]
}

type RfqsPayload = {
  ok: boolean
  rfqs?: AnalyticsRfq[]
}

type VehiclesPayload = {
  ok: boolean
  vehicles?: AnalyticsVehicle[]
}

async function getJson<T>(path: string, cookieHeader: string): Promise<T | null> {
  try {
    const response = await requestBackend(path, { cookieHeader })
    if (!response.ok) return null
    return (await response.json()) as T
  } catch {
    return null
  }
}

export async function getFleetAnalyticsInput(): Promise<FleetAnalyticsInput> {
  const cookieHeader = (await cookies()).toString()
  const [ordersPayload, rfqsPayload, vehiclesPayload] = await Promise.all([
    getJson<OrdersPayload>("/api/v1/orders?page=1&pageSize=50", cookieHeader),
    getJson<RfqsPayload>("/api/v1/rfqs?page=1&pageSize=50", cookieHeader),
    getJson<VehiclesPayload>("/api/v1/fleet/vehicles?page=1&pageSize=50", cookieHeader),
  ])

  return {
    orders: ordersPayload?.ok ? ordersPayload.orders ?? [] : [],
    rfqs: rfqsPayload?.ok ? rfqsPayload.rfqs ?? [] : [],
    vehicles: vehiclesPayload?.ok ? vehiclesPayload.vehicles ?? [] : [],
  }
}
