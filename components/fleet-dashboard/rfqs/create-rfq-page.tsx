"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import { AddPartsStep } from "./add-parts-step"
import { ReviewRfqStep } from "./review-rfq-step"
import { RfqDetailsStep } from "./rfq-details-step"
import { RfqStepper } from "./rfq-stepper"
import type { PartItem, Step } from "./create-rfq-types"
import type { FleetVehicle, VehiclesResponse } from "@/components/fleet-dashboard/vehicles/types"
import type { DashboardUser } from "@/lib/auth/types"
import { authenticatedFetch } from "@/lib/auth/client"
import { appPath, appRoutes } from "@/lib/routes"

export function CreateRfqPage({ user, initialVehicleId = "" }: { user: DashboardUser; initialVehicleId?: string }) {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)

  const [parts, setParts] = useState<PartItem[]>([
    {
      id: 1,
      partName: "",
      partNumber: "",
      quantity: 1,
      targetPrice: "",
      notes: "",
    },
  ])

  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [deadline, setDeadline] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() + 7)
    return date.toISOString().slice(0, 10)
  })
  const [deliveryRequirement, setDeliveryRequirement] =
    useState("Standard Delivery")
  const [paymentTerms, setPaymentTerms] = useState("Net 30")
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([])
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialVehicleId)
  const [attachment, setAttachment] = useState<File | null>(null)
  const [submitError, setSubmitError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    authenticatedFetch(appPath("/api/fleet/vehicles?page=1&pageSize=50"))
      .then(async (response) => {
        const payload = (await response.json()) as VehiclesResponse
        if (!response.ok || !payload.ok) throw new Error(payload.message ?? "Unable to load vehicles")
        const availableVehicles = payload.vehicles ?? []
        setVehicles(availableVehicles)
        setSelectedVehicleId((current) => (
          current && availableVehicles.some((vehicle) => vehicle.id === current)
            ? current
            : ""
        ))
      })
      .catch((error) => setSubmitError(error instanceof Error ? error.message : "Unable to load vehicles"))
  }, [])

  const totalQuantity = useMemo(
    () => parts.reduce((sum, part) => sum + (Number(part.quantity) || 0), 0),
    [parts]
  )

  const canContinueStep1 = parts.every(
    (part) =>
      part.partName.trim() &&
      part.partNumber.trim() &&
      Number(part.quantity) > 0
  )

  const canContinueStep2 =
    projectName.trim() && deadline.trim() && deliveryRequirement && paymentTerms && selectedVehicleId

  function updatePart(id: number, field: keyof PartItem, value: string | number) {
    setParts((prev) =>
      prev.map((part) => (part.id === id ? { ...part, [field]: value } : part))
    )
  }

  function addAnotherPart() {
    setParts((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        partName: "",
        partNumber: "",
        quantity: 1,
        targetPrice: "",
        notes: "",
      },
    ])
  }

  function handleNext() {
    if (step === 1 && canContinueStep1) setStep(2)
    if (step === 2 && canContinueStep2) setStep(3)
  }

  function handleBack() {
    if (step === 2) setStep(1)
    if (step === 3) setStep(2)
  }

  async function handleSubmit() {
    setIsSubmitting(true)
    setSubmitError("")
    try {
      const payload = {
        source: "fleet",
        fleetVehicleId: selectedVehicleId,
        projectName,
        description,
        responseDeadline: new Date(`${deadline}T23:59:59`).toISOString(),
        deliveryRequirement,
        paymentTerms,
        companyName: user.companyName || "Fleet account",
        contactName: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.companyName || "Fleet contact",
        email: user.email || "not-provided@autopartspro.local",
        phone: user.phone || "Not provided",
        parts: parts.map((part) => ({
          partName: part.partName,
          partNumber: part.partNumber,
          quantity: part.quantity,
          targetPrice: part.targetPrice,
          notes: part.notes,
        })),
      }
      const body = new FormData()
      body.set("payload", JSON.stringify(payload))
      if (attachment) body.set("attachment", attachment)
      const response = await authenticatedFetch(appPath("/api/rfqs"), { method: "POST", body })
      const result = await response.json() as { ok: boolean; message?: string; rfq?: { publicId?: string } }
      if (!response.ok || !result.ok) throw new Error(result.message ?? "Unable to submit RFQ")
      const created = result.rfq?.publicId ? `?created=${encodeURIComponent(result.rfq.publicId)}` : "?created=1"
      router.push(`${appRoutes.rfqs}${created}`)
      router.refresh()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Unable to submit RFQ")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <RfqStepper step={step} />

      <div className="mx-auto max-w-5xl px-8 py-16">
        {submitError ? <p className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{submitError}</p> : null}
        {step === 1 && (
          <AddPartsStep
            parts={parts}
            canContinue={Boolean(canContinueStep1)}
            onAddPart={addAnotherPart}
            onNext={handleNext}
            onUpdatePart={updatePart}
          />
        )}

        {step === 2 && (
          <RfqDetailsStep
            projectName={projectName}
            description={description}
            deadline={deadline}
            deliveryRequirement={deliveryRequirement}
            paymentTerms={paymentTerms}
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            canContinue={Boolean(canContinueStep2)}
            onBack={handleBack}
            onNext={handleNext}
            onProjectNameChange={setProjectName}
            onDescriptionChange={setDescription}
            onDeadlineChange={setDeadline}
            onDeliveryRequirementChange={setDeliveryRequirement}
            onPaymentTermsChange={setPaymentTerms}
            onVehicleChange={setSelectedVehicleId}
            onAttachmentChange={setAttachment}
          />
        )}

        {step === 3 && (
          <ReviewRfqStep
            parts={parts}
            projectName={projectName}
            deadline={deadline}
            totalQuantity={totalQuantity}
            onBack={handleBack}
            onSubmit={isSubmitting ? () => undefined : handleSubmit}
          />
        )}
      </div>
    </div>
  )
}
