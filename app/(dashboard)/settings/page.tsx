import { ChangePasswordCard } from "@/components/fleet-dashboard/settings/change-password-card"
import { FleetSettingsManager } from "@/components/fleet-dashboard/settings/fleet-settings-manager"
import { getFleetSettings } from "@/lib/fleet-settings.server"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const profile = await getFleetSettings()
  return (
    <div className="space-y-8">
      <FleetSettingsManager profile={profile} />
      <ChangePasswordCard />
    </div>
  )
}
