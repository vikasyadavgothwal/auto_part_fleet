import { PlansPage } from "@/components/fleet-dashboard/plans/plans-page"
import { refreshPaymentReturn } from "@/lib/payments.server"

export const dynamic = "force-dynamic"

type PlansRouteProps = { searchParams: Promise<{ payment?: string; session_id?: string }> }

export default async function FleetPlansRoute({ searchParams }: PlansRouteProps) {
  const params = await searchParams
  return <PlansPage paymentStatus={await refreshPaymentReturn(params.session_id, params.payment)} />
}
