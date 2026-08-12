import { NextRequest, NextResponse } from "next/server"

import { applySetCookieHeaders, getSetCookieHeaders, mergeCookieHeader, requestBackend } from "@/lib/auth/backend"
import type { AuthApiPayload } from "@/lib/auth/types"

async function readBackendJson(response: Response): Promise<AuthApiPayload | null> {
  const contentType = response.headers.get("content-type") ?? ""
  if (!contentType.toLowerCase().includes("application/json")) {
    return null
  }

  try {
    return (await response.json()) as AuthApiPayload
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  const backend = await requestBackend("/api/v1/user/auth/login", {
    method: "POST",
    body: await request.text(),
    contentType: "application/json",
    userAgent: request.headers.get("user-agent"),
  })
  const payload = await readBackendJson(backend)
  const issuedCookies = getSetCookieHeaders(backend.headers)
  if (!payload) {
    return NextResponse.json(
      {
        ok: false,
        success: false,
        message:
          "Backend login endpoint did not return JSON. Check ADMIN_API_BASE_URL points to auto_parts_admin.",
      },
      { status: 502 },
    )
  }
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
