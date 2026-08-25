import { cookies } from "next/headers"

import { requestBackend } from "@/lib/auth/backend"

type AccessResult = { allowed: boolean; reason: string | null }
type AccessPayload = {
  ok: boolean
  access?: Array<{
    businessAccount: { type: string; isOwner?: boolean }
    visibleMenus?: string[]
    actions?: Record<string, AccessResult>
  }>
}

export async function getFleetBusinessAccess() {
  const response = await requestBackend("/api/v1/business/access", {
    cookieHeader: (await cookies()).toString(),
  }).catch(() => null)
  const payload = response?.ok ? ((await response.json()) as AccessPayload) : null
  const access = payload?.access?.find((item) => item.businessAccount.type === "Fleet")
  const visibleMenus = new Set(access?.visibleMenus ?? [])
  return {
    isOwner: Boolean(access?.businessAccount.isOwner),
    visibleMenus,
    canView: (menuKey: string) => visibleMenus.has(menuKey),
    action: (actionKey: string) => access?.actions?.[actionKey] ?? { allowed: false, reason: "You do not have permission for this action" },
  }
}
