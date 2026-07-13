import { NextRequest, NextResponse } from "next/server"

import { applySetCookieHeaders, getSetCookieHeaders, mergeCookieHeader, requestBackend } from "@/lib/auth/backend"
import type { AuthApiPayload } from "@/lib/auth/types"

export async function POST(request: NextRequest) {
  const backend = await requestBackend("/api/v1/user/auth/login", {
    method: "POST",
    body: await request.text(),
    contentType: "application/json",
    userAgent: request.headers.get("user-agent"),
  })
  const payload = (await backend.json()) as AuthApiPayload
  const issuedCookies = getSetCookieHeaders(backend.headers)
  if (backend.ok && payload.ok && !payload.user.roles.includes("Fleet")) {
    await requestBackend("/api/v1/user/auth/logout", {
      method: "POST",
      cookieHeader: mergeCookieHeader(null, issuedCookies),
    })
    return NextResponse.json(
      { ok: false, success: false, message: "This account does not have fleet access." },
      { status: 403 },
    )
  }
  const response = NextResponse.json(payload, { status: backend.status })
  if (backend.ok) applySetCookieHeaders(response, issuedCookies)
  return response
}
