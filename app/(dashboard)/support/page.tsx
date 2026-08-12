import { cookies } from "next/headers"
import { FleetFeatureAccessPage, type BusinessAccess, type SupportContent } from "@/components/fleet-dashboard/subscription/feature-access-page"
import { requestBackend } from "@/lib/auth/backend"

type AccessPayload = { ok: boolean; access?: BusinessAccess[] }
type SupportPayload = { ok: boolean; support?: SupportContent }

export const dynamic = "force-dynamic"

export default async function SupportPage() {
  const cookieHeader = (await cookies()).toString()
  const response = await requestBackend("/api/v1/business/access", { cookieHeader }).catch(() => null)
  const payload = response?.ok ? ((await response.json()) as AccessPayload) : null
  const access = payload?.access?.find((item) => item.businessAccount.type === "Fleet")
  const supportResponse = access
    ? await requestBackend(`/api/v1/business/support-content?businessAccountId=${encodeURIComponent(access.businessAccount.id)}`, { cookieHeader }).catch(() => null)
    : null
  const supportPayload = supportResponse?.ok ? ((await supportResponse.json()) as SupportPayload) : null

  return <FleetFeatureAccessPage access={access} area="support" initialSupport={supportPayload?.support} />
}
