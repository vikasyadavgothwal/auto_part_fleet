import { NextRequest, NextResponse } from "next/server"

import {
  applySetCookieHeaders,
  FLEET_ACCESS_COOKIE,
  FLEET_REFRESH_COOKIE,
  getSetCookieHeaders,
  requestBackend,
} from "@/lib/auth/backend"

export async function POST(request: NextRequest) {
  let values: string[] = []
  try {
    const backend = await requestBackend("/api/v1/user/auth/logout", {
      method: "POST",
      cookieHeader: request.headers.get("cookie"),
    })
    values = getSetCookieHeaders(backend.headers)
  } catch {}
  const response = NextResponse.json({ ok: true, success: true })
  applySetCookieHeaders(response, values)
  const options = { httpOnly: true, sameSite: "strict" as const, secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 }
  response.cookies.set(FLEET_ACCESS_COOKIE, "", options)
  response.cookies.set(FLEET_REFRESH_COOKIE, "", options)
  return response
}
