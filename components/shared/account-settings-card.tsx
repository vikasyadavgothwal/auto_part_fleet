"use client"

import { useEffect, useState, type FormEvent } from "react"
import { UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast-provider"
import { authenticatedFetch } from "@/lib/auth/client"
import { appPath } from "@/lib/routes"

type Account = {
  firstName: string | null
  lastName: string | null
  email: string | null
}

type AccountResponse = {
  ok?: boolean
  account?: Account
  message?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RequiredAsterisk = () => <span className="text-red-500">*</span>

export function AccountSettingsCard({
  initialAccount,
  allowEmail = true,
}: {
  initialAccount?: Account | null
  allowEmail?: boolean
}) {
  const { showToast } = useToast()
  const [form, setForm] = useState({
    firstName: initialAccount?.firstName ?? "",
    lastName: initialAccount?.lastName ?? "",
    email: initialAccount?.email ?? "",
  })
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (initialAccount) return
    let active = true
    authenticatedFetch(appPath("/api/account"))
      .then((response) => response.json() as Promise<AccountResponse>)
      .then((payload) => {
        if (!active || !payload.account) return
        setForm({
          firstName: payload.account.firstName ?? "",
          lastName: payload.account.lastName ?? "",
          email: payload.account.email ?? "",
        })
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [initialAccount])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const firstName = form.firstName.trim()
    const lastName = form.lastName.trim()
    const email = form.email.trim().toLowerCase()
    setMessage(null)
    setError(null)
    if (!firstName) { const message = "First name is required."; setError(message); showToast({ type: "error", title: "Check account", message }); return }
    if (!lastName) { const message = "Last name is required."; setError(message); showToast({ type: "error", title: "Check account", message }); return }
    if (firstName.length > 100 || lastName.length > 100) { const message = "Names must be 100 characters or fewer."; setError(message); showToast({ type: "error", title: "Check account", message }); return }
    if (allowEmail && (!email || email.length > 254 || !emailPattern.test(email))) { const message = "Enter a valid email address."; setError(message); showToast({ type: "error", title: "Check account", message }); return }

    setIsSaving(true)
    try {
      const response = await authenticatedFetch(appPath("/api/account"), {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ firstName, lastName, ...(allowEmail ? { email } : {}) }),
      })
      const payload = (await response.json().catch(() => null)) as AccountResponse | null
      if (!response.ok || !payload?.ok || !payload.account) {
        throw new Error(payload?.message || "Unable to update account.")
      }
      setForm({
        firstName: payload.account.firstName ?? "",
        lastName: payload.account.lastName ?? "",
        email: payload.account.email ?? "",
      })
      setMessage("Account updated successfully."); showToast({ type: "success", title: "Account updated", message: "Account details saved successfully." })
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Unable to update account."; setError(message); showToast({ type: "error", title: "Unable to update account", message })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="rounded-sm border border-border bg-brand-panel shadow-none">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} noValidate className="grid gap-5 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="account-first-name">First Name <RequiredAsterisk /></Label>
            <Input id="account-first-name" value={form.firstName} onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))} maxLength={100} placeholder="Enter first name" required className="border-border bg-brand-surface" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account-last-name">Last Name <RequiredAsterisk /></Label>
            <Input id="account-last-name" value={form.lastName} onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))} maxLength={100} placeholder="Enter last name" required className="border-border bg-brand-surface" />
          </div>
          {allowEmail ? (
            <div className="space-y-2">
              <Label htmlFor="account-email">Email <RequiredAsterisk /></Label>
              <Input id="account-email" type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} maxLength={254} placeholder="name@company.com" required className="border-border bg-brand-surface" />
            </div>
          ) : null}
          {error ? <p className="text-sm text-destructive md:col-span-3">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-500 md:col-span-3">{message}</p> : null}
          <div className="md:col-span-3">
            <Button type="submit" disabled={isSaving} className="gap-2">
              <UserRound className="size-4" />
              {isSaving ? "Saving..." : "Save Account"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
