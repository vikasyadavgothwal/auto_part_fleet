import { cookies } from "next/headers"

import { ChangePasswordCard } from "@/components/fleet-dashboard/settings/change-password-card"
import { FleetSettingsManager } from "@/components/fleet-dashboard/settings/fleet-settings-manager"
import { AccountSettingsCard } from "@/components/shared/account-settings-card"
import { requestBackend } from "@/lib/auth/backend"
import { getFleetSettings } from "@/lib/fleet-settings.server"

export const dynamic = "force-dynamic"

type BusinessAccessPayload = {
  ok: boolean
  access?: Array<{ businessAccount: { type: string; isOwner?: boolean } }>
}

type AccountPayload = {
  ok: boolean
  account?: { firstName: string | null; lastName: string | null; email: string | null }
}

async function getSettingsContext() {
  const cookieHeader = (await cookies()).toString()
  const [accessResponse, accountResponse] = await Promise.all([
    requestBackend("/api/v1/business/access", { cookieHeader }).catch(() => null),
    requestBackend("/api/v1/user/account", { cookieHeader }).catch(() => null),
  ])
  const accessPayload = accessResponse?.ok ? ((await accessResponse.json()) as BusinessAccessPayload) : null
  const accountPayload = accountResponse?.ok ? ((await accountResponse.json()) as AccountPayload) : null
  const account = accessPayload?.access?.find((item) => item.businessAccount.type === "Fleet")
  return {
    hasBusinessAccess: Boolean(account),
    isOwner: account?.businessAccount.isOwner ?? false,
    account: accountPayload?.account ?? null,
  }
}

export default async function SettingsPage() {
  const context = await getSettingsContext()
  const profile = context.hasBusinessAccess && context.isOwner ? await getFleetSettings() : null
  return (
    <div className="space-y-8">
      {profile ? <FleetSettingsManager profile={profile} /> : null}
      <AccountSettingsCard initialAccount={context.account} allowEmail={context.isOwner} />
      <ChangePasswordCard />
    </div>
  )
}
