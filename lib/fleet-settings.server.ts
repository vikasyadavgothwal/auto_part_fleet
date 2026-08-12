import { cookies } from "next/headers"

import { requestBackend } from "@/lib/auth/backend"
import {
  emptyFleetProfile,
  type FleetProfileRecord,
} from "@/lib/fleet-settings"

type FleetSettingsPayload = {
  ok: boolean
  profile?: FleetProfileRecord
}

export async function getFleetSettings() {
  const response = await requestBackend("/api/v1/fleet/settings", {
    cookieHeader: (await cookies()).toString(),
  })

  if (!response.ok) {
    return emptyFleetProfile
  }

  const payload = (await response.json()) as FleetSettingsPayload
  return payload.profile ?? emptyFleetProfile
}
