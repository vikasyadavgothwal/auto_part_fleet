import { forwardBackendRequest } from "@/lib/auth/backend"

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, context: RouteContext) {
  return forwardBackendRequest(
    request,
    `/api/v1/fleet/vehicles/${(await context.params).id}`,
  )
}

export async function DELETE(request: Request, context: RouteContext) {
  return forwardBackendRequest(
    request,
    `/api/v1/fleet/vehicles/${(await context.params).id}`,
  )
}
