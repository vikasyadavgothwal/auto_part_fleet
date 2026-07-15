"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ShieldCheck } from "lucide-react"
import { FirebaseError } from "firebase/app"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AuthApiPayload } from "@/lib/auth/types"
import { appPath, appRoutes } from "@/lib/routes"
import { createFirebaseLoginPayload, isFirebaseAuthConfigured } from "@/lib/auth/firebase-client"

export function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setPending(true)
    setError("")
    try {
      const email = String(data.get("email") ?? "").trim().toLowerCase()
      const password = String(data.get("password") ?? "")
      const body = isFirebaseAuthConfigured()
        ? await createFirebaseLoginPayload(email, password)
        : { email, password, deviceName: "Fleet dashboard" }
      const response = await fetch(appPath("/api/auth/login"), {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      })
      const payload = (await response.json()) as AuthApiPayload
      if (!response.ok || !payload.ok) throw new Error(payload.ok ? "Unable to sign in" : payload.message)
      router.replace(appRoutes.overview)
      router.refresh()
    } catch (loginError) {
      setError(
        loginError instanceof FirebaseError && loginError.code === "auth/invalid-credential"
          ? "The email or password is incorrect."
          : loginError instanceof Error
            ? loginError.message
            : "Unable to sign in",
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#0A0A0A] px-4 py-10">
      <Card className="w-full max-w-md border border-[#2A2A2A] bg-[#111111] text-white ring-0">
        <CardHeader className="space-y-2">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-1 text-xs text-[#9CA3AF]">
            <ShieldCheck className="size-3.5" /> Secure fleet access
          </div>
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription className="text-[#9CA3AF]">Access and refresh tokens are stored in secure HttpOnly cookies.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={submit}>
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" required className="h-11 border-[#2A2A2A] bg-[#0A0A0A]" /></div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required className="h-11 border-[#2A2A2A] bg-[#0A0A0A] pr-11" />
                <Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword((value) => !value)} className="absolute right-1 top-1/2 size-9 -translate-y-1/2" aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff /> : <Eye />}</Button>
              </div>
            </div>
            {error ? <p role="alert" className="text-sm text-red-500">{error}</p> : null}
            <Button type="submit" disabled={pending} className="h-11 w-full">{pending ? "Signing in..." : "Sign in to fleet dashboard"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
