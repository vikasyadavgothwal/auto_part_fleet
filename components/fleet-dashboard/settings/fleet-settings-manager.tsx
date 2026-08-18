"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { FirebaseError } from "firebase/app"
import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
} from "firebase/auth"
import { CheckCircle2, Mail, MessageSquareText, Save } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast-provider"
import { authenticatedFetch } from "@/lib/auth/client"
import {
  ensureFirebaseAuthConfigured,
  getFirebaseAuthDiagnostics,
  getFirebaseAuth,
} from "@/lib/auth/firebase-client"
import {
  formFromProfile,
  payloadFromForm,
  type FleetProfileFormValues,
  type FleetProfileRecord,
} from "@/lib/fleet-settings"
import { appPath } from "@/lib/routes"
import { FleetSavedAddressesManager } from "./fleet-saved-addresses-manager"

type SettingsPayload = {
  ok: boolean
  profile?: FleetProfileRecord
  message?: string
  verificationLink?: string
}

type FleetSettingsManagerProps = {
  profile: FleetProfileRecord
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MOBILE_PATTERN = /^\+\d{8,18}$/
const POSTAL_CODE_PATTERN = /^[A-Za-z0-9 -]*$/
const MOBILE_COUNTRY_CODES = [
  { code: "+971", label: "UAE" },
  { code: "+91", label: "India" },
  { code: "+966", label: "Saudi Arabia" },
  { code: "+1", label: "United States" },
  { code: "+44", label: "United Kingdom" },
  { code: "+974", label: "Qatar" },
  { code: "+965", label: "Kuwait" },
  { code: "+968", label: "Oman" },
  { code: "+973", label: "Bahrain" },
  { code: "+92", label: "Pakistan" },
] as const
const DEFAULT_MOBILE_COUNTRY_CODE = "+971"

const normalizeDigits = (value: string, maxLength = 14) =>
  value.replace(/\D/g, "").slice(0, maxLength)

const parseMobileNumber = (value: string) => {
  const compact = value.replace(/[^\d+]/g, "")
  const countryCode =
    [...MOBILE_COUNTRY_CODES]
      .sort((first, second) => second.code.length - first.code.length)
      .find((country) => compact.startsWith(country.code))?.code ??
    DEFAULT_MOBILE_COUNTRY_CODE
  const localNumber = normalizeDigits(
    compact.startsWith(countryCode)
      ? compact.slice(countryCode.length)
      : compact.replace(/^\+/, ""),
  )

  return { countryCode, localNumber }
}

const buildMobileNumber = (countryCode: string, localNumber: string) => {
  const digits = normalizeDigits(localNumber)
  return digits ? `${countryCode}${digits}` : ""
}

const normalizeMobileValue = (value: string) => {
  const parsed = parseMobileNumber(value)
  return buildMobileNumber(parsed.countryCode, parsed.localNumber)
}

const getFirebasePhoneErrorMessage = (error: unknown) => {
  const diagnostics = getFirebaseAuthDiagnostics()
  const origin =
    diagnostics.origin === "server" ? "this domain" : diagnostics.origin

  if (!(error instanceof FirebaseError)) {
    return error instanceof Error
      ? error.message
      : "Unable to verify mobile number"
  }

  const messages: Record<string, string> = {
    "auth/captcha-check-failed": "Phone verification failed. Try again.",
    "auth/credential-already-in-use":
      "This mobile number is already linked to another account.",
    "auth/invalid-phone-number": "Enter a valid mobile number.",
    "auth/invalid-app-credential":
      `Phone verification is blocked for ${origin}. Add this domain in Firebase Auth Authorized domains and, if your Firebase API key is restricted, add ${origin}/* in Google Cloud API key HTTP referrers.`,
    "auth/invalid-verification-code": "The OTP is incorrect.",
    "auth/missing-verification-code": "Enter the OTP.",
    "auth/operation-not-allowed":
      "Phone authentication is not enabled in Firebase.",
    "auth/quota-exceeded": "Firebase SMS quota is exceeded. Try again later.",
    "auth/too-many-requests": "Too many OTP attempts. Try again later.",
  }

  return messages[error.code] ?? "Unable to verify mobile number"
}

const logFirebasePhoneError = (error: unknown) => {
  if (
    error instanceof FirebaseError &&
    error.code === "auth/invalid-app-credential"
  ) {
    console.warn("Firebase phone auth app verifier rejected", {
      ...getFirebaseAuthDiagnostics(),
      code: error.code,
      message: error.message,
    })
  }
}

export function FleetSettingsManager({ profile }: FleetSettingsManagerProps) {
  const { showToast } = useToast()
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null)
  const initialForm = {
    ...formFromProfile(profile),
    phone: normalizeMobileValue(profile.phone ?? ""),
  }
  const initialMobile = parseMobileNumber(initialForm.phone)
  const [currentProfile, setCurrentProfile] = useState(profile)
  const [form, setForm] = useState<FleetProfileFormValues>(initialForm)
  const [mobileCountryCode, setMobileCountryCode] = useState<string>(
    initialMobile.countryCode,
  )
  const [mobileLocalNumber, setMobileLocalNumber] = useState(
    initialMobile.localNumber,
  )
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [otp, setOtp] = useState("")
  const [mobileVerificationId, setMobileVerificationId] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)

  useEffect(() => {
    return () => {
      recaptchaVerifier.current?.clear()
      recaptchaVerifier.current = null
    }
  }, [])

  const setField = <Key extends keyof FleetProfileFormValues>(
    key: Key,
    value: FleetProfileFormValues[Key],
  ) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const clearRecaptchaVerifier = () => {
    recaptchaVerifier.current?.clear()
    recaptchaVerifier.current = null
    document.getElementById("fleet-mobile-recaptcha")?.replaceChildren()
  }

  const getRecaptchaVerifier = () => {
    clearRecaptchaVerifier()
    const verifier = new RecaptchaVerifier(
      getFirebaseAuth(),
      "fleet-mobile-recaptcha",
      { size: "invisible" },
    )
    recaptchaVerifier.current = verifier
    return verifier
  }

  const syncProfileForm = (nextProfile: FleetProfileRecord) => {
    const nextForm = {
      ...formFromProfile(nextProfile),
      phone: normalizeMobileValue(nextProfile.phone ?? ""),
    }
    const nextMobile = parseMobileNumber(nextForm.phone)
    setForm(nextForm)
    setMobileCountryCode(nextMobile.countryCode)
    setMobileLocalNumber(nextMobile.localNumber)
  }

  const setMobileNumber = (countryCode: string, localNumber: string) => {
    const digits = normalizeDigits(localNumber)
    setMobileCountryCode(countryCode)
    setMobileLocalNumber(digits)
    setField("phone", buildMobileNumber(countryCode, digits))
  }

  const validateForm = () => {
    if (!form.companyName.trim()) return "Company name is required"
    if (form.companyName.trim().length > 160) {
      return "Company name must be 160 characters or fewer"
    }
    if (form.firstName.trim().length > 100 || form.lastName.trim().length > 100) {
      return "Name fields must be 100 characters or fewer"
    }
    if (form.email && !EMAIL_PATTERN.test(form.email)) {
      return "Enter a valid email address"
    }
    if (form.phone && !MOBILE_PATTERN.test(form.phone)) {
      return "Enter a valid mobile number"
    }
    if (form.postalCode && !POSTAL_CODE_PATTERN.test(form.postalCode)) {
      return "Postal code contains invalid characters"
    }
    return ""
  }

  const persistSettings = async () => {
    const response = await authenticatedFetch(appPath("/api/settings"), {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payloadFromForm(form)),
    })
    const payload = (await response.json()) as SettingsPayload
    if (!response.ok || !payload.ok || !payload.profile) {
      throw new Error(payload.message || "Unable to save settings")
    }
    setCurrentProfile(payload.profile)
    syncProfileForm(payload.profile)
    return payload.profile
  }

  const saveSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setMessage("")
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      showToast({ type: "error", title: "Check settings", message: validationError })
      return
    }

    setIsSaving(true)
    try {
      const pendingEmail = form.email
      const pendingPhone = form.phone
      const pendingMobileCountryCode = mobileCountryCode
      const pendingMobileLocalNumber = mobileLocalNumber
      const emailChanged =
        pendingEmail.trim().toLowerCase() !== (currentProfile.email ?? "")
      const phoneChanged =
        normalizeMobileValue(pendingPhone) !==
        normalizeMobileValue(currentProfile.phone ?? "")
      await persistSettings()
      if (emailChanged || phoneChanged) {
        setForm((current) => ({
          ...current,
          ...(emailChanged ? { email: pendingEmail } : {}),
          ...(phoneChanged ? { phone: pendingPhone } : {}),
        }))
        if (phoneChanged) {
          setMobileCountryCode(pendingMobileCountryCode)
          setMobileLocalNumber(pendingMobileLocalNumber)
        }
      }
      const message = emailChanged || phoneChanged
        ? "Profile saved. Verify changed email or mobile before it becomes active on your account."
        : "Settings saved"
      showToast({ type: "success", title: "Settings saved", message })
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Unable to save settings"
      setError(message)
      showToast({ type: "error", title: "Unable to save settings", message })
    } finally {
      setIsSaving(false)
    }
  }

  const sendEmailVerification = async () => {
    setError("")
    setMessage("")
    const email = form.email.trim().toLowerCase()
    if (!email) {
      const message = "Enter an email before verification"
      setError(message)
      showToast({ type: "error", title: "Check email", message })
      return
    }
    if (!EMAIL_PATTERN.test(email)) {
      const message = "Enter a valid email address"
      setError(message)
      showToast({ type: "error", title: "Check email", message })
      return
    }

    setIsSendingEmail(true)
    try {
      const response = await authenticatedFetch(
        appPath("/api/settings/email-verification"),
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email }),
        },
      )
      const payload = (await response.json()) as SettingsPayload
      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || "Unable to send verification link")
      }
      const message =
        payload.verificationLink
          ? `${payload.message} ${payload.verificationLink}`
          : payload.message || "Verification link sent"
      setMessage(message)
      showToast({ type: "success", title: "Verification link sent", message })
    } catch (sendError) {
      const message = sendError instanceof Error ? sendError.message : "Unable to send verification link"
      setError(message)
      showToast({ type: "error", title: "Unable to send verification link", message })
    } finally {
      setIsSendingEmail(false)
    }
  }

  const sendMobileOtp = async () => {
    setError("")
    setMessage("")
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      showToast({ type: "error", title: "Check settings", message: validationError })
      return
    }
    const normalizedPhone = normalizeMobileValue(form.phone)
    if (!normalizedPhone) {
      const message = "Enter a mobile number before verification"
      setError(message)
      showToast({ type: "error", title: "Check mobile", message })
      return
    }
    setIsSendingOtp(true)
    try {
      if (!(await ensureFirebaseAuthConfigured())) {
        const message = "Firebase phone authentication is not configured"
        setError(message)
        showToast({ type: "error", title: "Unable to send OTP", message })
        return
      }

      const checkResponse = await authenticatedFetch(
        appPath("/api/settings/mobile-otp/check"),
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ phone: normalizedPhone }),
        },
      )
      const checkPayload = (await checkResponse.json().catch(() => null)) as {
        message?: string
      } | null
      if (!checkResponse.ok) {
        throw new Error(checkPayload?.message || "Unable to check mobile number")
      }

      const provider = new PhoneAuthProvider(getFirebaseAuth())
      let verificationId: string
      try {
        verificationId = await provider.verifyPhoneNumber(
          normalizedPhone,
          getRecaptchaVerifier(),
        )
      } catch (error) {
        clearRecaptchaVerifier()
        throw error
      }
      setMobileVerificationId(verificationId)
      setOtp("")
      showToast({ type: "success", title: "OTP sent", message: "OTP sent by Firebase" })
    } catch (sendError) {
      logFirebasePhoneError(sendError)
      const message = getFirebasePhoneErrorMessage(sendError)
      setError(message)
      showToast({ type: "error", title: "Unable to send OTP", message })
    } finally {
      setIsSendingOtp(false)
    }
  }

  const verifyMobileOtp = async () => {
    setError("")
    setMessage("")
    setIsVerifyingOtp(true)

    try {
      if (!mobileVerificationId) throw new Error("Send OTP first")
      if (!(await ensureFirebaseAuthConfigured())) {
        throw new Error("Firebase phone authentication is not configured")
      }
      const credential = PhoneAuthProvider.credential(mobileVerificationId, otp)
      const phoneCredential = await signInWithCredential(
        getFirebaseAuth(),
        credential,
      )
      const firebaseIdToken = await phoneCredential.user.getIdToken(true)

      const response = await authenticatedFetch(
        appPath("/api/settings/mobile-otp/verify"),
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ firebaseIdToken }),
        },
      )
      const payload = (await response.json()) as SettingsPayload
      if (!response.ok || !payload.ok || !payload.profile) {
        throw new Error(payload.message || "Unable to verify OTP")
      }

      setCurrentProfile(payload.profile)
      syncProfileForm(payload.profile)
      setOtp("")
      setMobileVerificationId("")
      showToast({ type: "success", title: "Mobile verified", message: "Mobile number verified" })
    } catch (verifyError) {
      const message = getFirebasePhoneErrorMessage(verifyError)
      setError(message)
      showToast({ type: "error", title: "Unable to verify OTP", message })
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const emailVerified =
    Boolean(currentProfile.emailVerifiedAt) &&
    form.email.trim().toLowerCase() === (currentProfile.email ?? "")
  const mobileVerified =
    Boolean(currentProfile.mobileVerifiedAt) &&
    normalizeMobileValue(form.phone) ===
      normalizeMobileValue(currentProfile.phone ?? "")
  const emailChanged =
    form.email.trim().toLowerCase() !== (currentProfile.email ?? "")
  const phoneChanged =
    normalizeMobileValue(form.phone) !==
    normalizeMobileValue(currentProfile.phone ?? "")

  return (
    <div className="space-y-8">
    <form noValidate className="space-y-8" onSubmit={saveSettings}>
      <div>
        <h1 className="mb-2 text-3xl font-bold text-white">
          Workspace Settings
        </h1>
        <p className="text-sm text-[#9CA3AF]">
          Manage fleet profile details and verified account contact information.
        </p>
      </div>
      <div id="fleet-mobile-recaptcha" />

      {message ? (
        <p className="break-words rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {message}
        </p>
      ) : null}
      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          {error}
        </p>
      ) : null}

      <Card className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none">
        <CardHeader>
          <CardTitle className="text-white">Contact Verification</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="fleet-email">Email</Label>
              {emailVerified ? (
                <Badge className="bg-green-500/10 text-green-400">
                  Verified
                </Badge>
              ) : emailChanged ? (
                <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                  Needs verification
                </Badge>
              ) : null}
            </div>
            <Input
              id="fleet-email"
              type="email"
              maxLength={180}
              value={form.email}
              onChange={(event) => setField("email", event.target.value)}
              className="h-11 border-[#2A2A2A] bg-[#0A0A0A]"
            />
            {!emailVerified ? (
              <Button
                type="button"
                variant="outline"
                onClick={sendEmailVerification}
                disabled={isSendingEmail}
                className="gap-2"
              >
                <Mail className="size-4" />
                {isSendingEmail ? "Sending..." : "Send verification link"}
              </Button>
            ) : null}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="fleet-mobile">Mobile</Label>
              {mobileVerified ? (
                <Badge className="bg-green-500/10 text-green-400">
                  Verified
                </Badge>
              ) : phoneChanged ? (
                <Badge variant="outline" className="border-yellow-500/30 text-yellow-400">
                  Needs verification
                </Badge>
              ) : null}
            </div>
            <div className="flex min-w-0">
              <select
                aria-label="Mobile country code"
                value={mobileCountryCode}
                onChange={(event) =>
                  setMobileNumber(event.target.value, mobileLocalNumber)
                }
                className="h-11 w-36 shrink-0 rounded-l-sm border border-[#2A2A2A] bg-[#0A0A0A] px-3 text-sm text-white outline-none transition-colors focus-visible:border-[#DC2626]"
              >
                {MOBILE_COUNTRY_CODES.map((country) => (
                  <option
                    key={`${country.code}-${country.label}`}
                    value={country.code}
                  >
                    {country.code}
                  </option>
                ))}
              </select>
              <Input
                id="fleet-mobile"
                type="tel"
                value={mobileLocalNumber}
                onChange={(event) =>
                  setMobileNumber(mobileCountryCode, event.target.value)
                }
                inputMode="numeric"
                maxLength={14}
                autoComplete="tel-national"
                placeholder="Mobile number"
                className="h-11 min-w-0 rounded-l-none border-l-0 border-[#2A2A2A] bg-[#0A0A0A]"
              />
            </div>
            {!mobileVerified ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={sendMobileOtp}
                  disabled={isSendingOtp}
                  className="gap-2"
                >
                  <MessageSquareText className="size-4" />
                  {isSendingOtp ? "Sending..." : "Send OTP"}
                </Button>
                <Input
                  value={otp}
                  onChange={(event) =>
                    setOtp(normalizeDigits(event.target.value, 6))
                  }
                  placeholder="OTP"
                  inputMode="numeric"
                  maxLength={6}
                  className="h-9 border-[#2A2A2A] bg-[#0A0A0A] sm:max-w-32"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={verifyMobileOtp}
                  disabled={isVerifyingOtp || !otp.trim()}
                  className="gap-2"
                >
                  <CheckCircle2 className="size-4" />
                  Verify
                </Button>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none">
        <CardHeader>
          <CardTitle className="text-white">Organization Profile</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
              <Label htmlFor="company-name">Company Name *</Label>
            <Input
              id="company-name"
              value={form.companyName}
              maxLength={160}
              onChange={(event) => setField("companyName", event.target.value)}
              className="h-11 border-[#2A2A2A] bg-[#0A0A0A]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="first-name">First Name</Label>
            <Input
              id="first-name"
              value={form.firstName}
              maxLength={100}
              onChange={(event) => setField("firstName", event.target.value)}
              className="h-11 border-[#2A2A2A] bg-[#0A0A0A]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="last-name">Last Name</Label>
            <Input
              id="last-name"
              value={form.lastName}
              maxLength={100}
              onChange={(event) => setField("lastName", event.target.value)}
              className="h-11 border-[#2A2A2A] bg-[#0A0A0A]"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none">
        <CardHeader>
          <CardTitle className="text-white">Business Address</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address-line-1">Address Line 1</Label>
            <Input
              id="address-line-1"
              value={form.addressLine1}
              maxLength={180}
              onChange={(event) => setField("addressLine1", event.target.value)}
              className="h-11 border-[#2A2A2A] bg-[#0A0A0A]"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address-line-2">Address Line 2</Label>
            <Input
              id="address-line-2"
              value={form.addressLine2}
              maxLength={180}
              onChange={(event) => setField("addressLine2", event.target.value)}
              className="h-11 border-[#2A2A2A] bg-[#0A0A0A]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={form.city}
              maxLength={80}
              onChange={(event) => setField("city", event.target.value)}
              className="h-11 border-[#2A2A2A] bg-[#0A0A0A]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={form.state}
              maxLength={80}
              onChange={(event) => setField("state", event.target.value)}
              className="h-11 border-[#2A2A2A] bg-[#0A0A0A]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postal-code">Postal Code</Label>
            <Input
              id="postal-code"
              value={form.postalCode}
              maxLength={20}
              onChange={(event) => setField("postalCode", event.target.value)}
              className="h-11 border-[#2A2A2A] bg-[#0A0A0A]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={form.country}
              maxLength={80}
              onChange={(event) => setField("country", event.target.value)}
              className="h-11 border-[#2A2A2A] bg-[#0A0A0A]"
            />
          </div>

          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={isSaving}
              className="gap-2 bg-[#DC2626] text-white hover:bg-[#B91C1C]"
            >
              <Save className="size-4" />
              {isSaving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
    <FleetSavedAddressesManager />
    </div>
  )
}
