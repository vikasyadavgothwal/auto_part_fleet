import { redirect } from "next/navigation"

import { appPath, appRoutes } from "@/lib/routes"

import DashboardOverviewPage from "./dashboard/page"

export const dynamic = "force-dynamic"

type FleetHomePageProps = {
  searchParams?: Promise<{ payment?: string; session_id?: string }>
}

export default async function FleetHomePage({ searchParams }: FleetHomePageProps) {
  const params = await searchParams
  if (params?.payment) {
    const query = new URLSearchParams({ payment: params.payment })
    if (params.session_id) query.set("session_id", params.session_id)
    redirect(`${appPath(appRoutes.plans)}?${query.toString()}`)
  }

  return <DashboardOverviewPage />
}
