import { FleetSettingsManager } from "@/components/fleet-dashboard/settings/fleet-settings-manager"
import { getFleetSettings } from "@/lib/fleet-settings.server"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const profile = await getFleetSettings()
  return <FleetSettingsManager profile={profile} />
}
