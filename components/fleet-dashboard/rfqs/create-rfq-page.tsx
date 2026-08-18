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
import { useToast } from "@/components/ui/toast-provider"

const maxParts = 20
const cleanText = (value: string) => value.trim().replace(/\s+/g, " ")
const decimalOnly = (value: string) => {
  const normalized = value.replace(/[^\d.]/g, "")
  const [whole, ...decimalParts] = normalized.split(".")
  return decimalParts.length ? `${whole}.${decimalParts.join("").slice(0, 2)}` : whole
}

function validateParts(parts: PartItem[], selectedVehicleId: string) {
  if (!parts.length) return "Add at least one part."
  if (parts.length > maxParts) return `An RFQ can include up to ${maxParts} parts.`
  for (const part of parts) {
    if (!cleanText(part.partName)) return "Part name is required for every row."
    if (cleanText(part.partName).length > 120) return "Part name must be 120 characters or fewer."
    if (cleanText(part.partNumber).length > 80) return "Part number must be 80 characters or fewer."
    const quantity = Number(part.quantity)
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) {
      return "Quantity must be between 1 and 999."
    }
    if (part.targetPrice) {
      const targetPrice = Number(part.targetPrice)
      if (!/^\d+(\.\d{1,2})?$/.test(part.targetPrice) || targetPrice < 0 || targetPrice > 999999.99) {
        return "Target price must be a valid amount up to AED 999,999.99."
      }
    }
    if (cleanText(part.notes).length > 500) return "Notes must be 500 characters or fewer."
    if (!selectedVehicleId && !/^[A-HJ-NPR-Z0-9]{17}$/.test(part.vin ?? "")) {
      return "Select a fleet vehicle or enter a valid 17-character VIN for every part."
    }
  }
  return ""
}

function validateDetails(projectName: string, deadline: string, selectedVehicleId: string, importedVehicleCount: number) {
  if (!cleanText(projectName)) return "Project name is required."
  if (cleanText(projectName).length > 120) return "Project name must be 120 characters or fewer."
  const deadlineDate = new Date(`${deadline}T23:59:59`)
  if (!deadline || Number.isNaN(deadlineDate.getTime()) || deadlineDate <= new Date()) {
    return "Response deadline must be in the future."
  }
  if (!selectedVehicleId && importedVehicleCount === 0) {
    return "Select a fleet vehicle or import/enter a valid VIN."
  }
  return ""
}

export function CreateRfqPage({ user, initialVehicleId = "" }: { user: DashboardUser; initialVehicleId?: string }) {
  const router = useRouter()
  const { showToast } = useToast()
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
  const deliveryRequirement = "Standard Delivery"
  const paymentTerms = "Net 30"
  const [vehicles, setVehicles] = useState<FleetVehicle[]>([])
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialVehicleId)
  const [submitError, setSubmitError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importedVehicles, setImportedVehicles] = useState<Array<{ vin: string; year: number; make: string; model: string }>>([])
  const [saveResolvedVehicles, setSaveResolvedVehicles] = useState(false)

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
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Unable to load vehicles"
        setSubmitError(message)
        showToast({ type: "error", title: "Unable to load vehicles", message })
      })
  }, [showToast])

  const totalQuantity = useMemo(
    () => parts.reduce((sum, part) => sum + (Number(part.quantity) || 0), 0),
    [parts]
  )
  const importedVehicleCount = useMemo(
    () => new Set(parts.map((part) => part.vin).filter(Boolean)).size,
    [parts]
  )

  const canContinueStep1 = parts.length <= maxParts && parts.every(
    (part) =>
      part.partName.trim() &&
      Number(part.quantity) > 0 &&
      (Boolean(selectedVehicleId) || /^[A-HJ-NPR-Z0-9]{17}$/.test(part.vin ?? ""))
  )

  const canContinueStep2 =
    projectName.trim() && deadline.trim() && (selectedVehicleId || importedVehicleCount > 0)

  function updatePart(id: number, field: keyof PartItem, value: string | number) {
    setParts((prev) =>
      prev.map((part) => (part.id === id ? { ...part, [field]: value } : part))
    )
  }

  function addAnotherPart() {
    if (parts.length >= maxParts) return
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

async function importRfqFile(file: File | undefined) {
  if (!file) return
  const allowedTypes = [".csv", ".xlsx", ".xls"]
  const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`
  if (!allowedTypes.includes(extension)) {
    const message = "Upload a CSV, XLSX, or XLS file."
    setSubmitError(message); showToast({ type: "error", title: "Invalid RFQ file", message }); return
  }
  if (file.size > 5 * 1024 * 1024) {
    const message = "RFQ import files must be 5 MB or smaller."
    setSubmitError(message); showToast({ type: "error", title: "RFQ file too large", message }); return
  }
    setIsImporting(true)
    setSubmitError("")
    try {
      const body = new FormData()
      body.set("file", file)
      const response = await authenticatedFetch(appPath("/api/rfqs/import"), { method: "POST", body })
      const result = await response.json() as { ok: boolean; vin?: string; vins?: string[]; parts?: Array<Omit<PartItem, "id" | "notes">>; vehicles?: Array<{ vin: string; year: number; make: string; model: string }>; message?: string }
      if (!response.ok || !result.ok || !result.vin || !result.parts?.length) throw new Error(result.message ?? "Unable to import RFQ file")
      if (result.parts.length > maxParts) throw new Error(`An RFQ can include up to ${maxParts} parts.`)
      const matchedVehicle = vehicles.find((vehicle) => vehicle.vin.toUpperCase() === result.vin)
      setSelectedVehicleId(matchedVehicle?.id ?? "")
      setImportedVehicles(result.vehicles ?? [])
      setParts(result.parts.map((part, index) => ({ ...part, id: Date.now() + index, notes: "" })))
      showToast({ type: "success", title: "RFQ file imported", message: `${result.parts.length} part rows imported successfully.` })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to import RFQ file"
      setSubmitError(message)
      showToast({ type: "error", title: "Unable to import RFQ file", message })
    } finally {
      setIsImporting(false)
    }
  }

  async function resolveManualVins() {
    const vins = Array.from(new Set(parts.map((part) => part.vin?.trim().toUpperCase()).filter((vin): vin is string => Boolean(vin))))
    const resolved = [...importedVehicles]
    for (const vin of vins) {
      if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) throw new Error(`VIN ${vin} must contain exactly 17 valid characters.`)
      if (vehicles.some((vehicle) => vehicle.vin.toUpperCase() === vin) || resolved.some((vehicle) => vehicle.vin === vin)) continue
      const response = await authenticatedFetch(appPath(`/api/fleet/vehicles/vin-lookup?vin=${encodeURIComponent(vin)}`))
      const payload = await response.json() as { ok: boolean; found?: boolean; vehicle?: { vin: string; year: number; make: string; model: string }; message?: string }
      if (!response.ok || !payload.ok) throw new Error(payload.message ?? `Unable to validate VIN ${vin}`)
      if (!payload.found || !payload.vehicle) throw new Error(`VIN ${vin} was not found in our database or VIN provider. Correct it before continuing.`)
      resolved.push(payload.vehicle)
    }
    setImportedVehicles(resolved)
    return resolved
  }

  async function handleNext() {
    if (step === 1) {
      const validationError = validateParts(parts, selectedVehicleId)
      if (validationError) {
        setSubmitError(validationError)
        showToast({ type: "error", title: "Check RFQ parts", message: validationError })
        return
      }
      setIsImporting(true); setSubmitError("")
      try {
        await resolveManualVins()
        setStep(2)
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to validate VIN"
        setSubmitError(message)
        showToast({ type: "error", title: "Unable to validate VIN", message })
      }
      finally { setIsImporting(false) }
    }
    if (step === 2) {
      const validationError = validateDetails(projectName, deadline, selectedVehicleId, importedVehicleCount)
      if (validationError) {
        setSubmitError(validationError)
        showToast({ type: "error", title: "Check RFQ details", message: validationError })
        return
      }
      setSubmitError("")
      setStep(3)
    }
  }

  function handleBack() {
    if (step === 2) setStep(1)
    if (step === 3) setStep(2)
  }

  async function handleSubmit() {
    setIsSubmitting(true)
    setSubmitError("")
    try {
      const partValidationError = validateParts(parts, selectedVehicleId)
      const detailValidationError = validateDetails(projectName, deadline, selectedVehicleId, importedVehicleCount)
      if (partValidationError || detailValidationError) {
        const message = partValidationError || detailValidationError
        throw new Error(message)
      }
      const resolvedVehicles = await resolveManualVins()
      const importedVins = Array.from(new Set(parts.map((part) => part.vin?.trim().toUpperCase()).filter((vin): vin is string => Boolean(vin))))
      const selectedVin = vehicles.find((vehicle) => vehicle.id === selectedVehicleId)?.vin ?? ""
      const batchVins = Array.from(new Set([...importedVins, ...(parts.some((part) => !part.vin) && selectedVin ? [selectedVin] : [])]))
      if (!batchVins.length) throw new Error("Select a saved vehicle or enter a valid VIN for each part.")
      if (saveResolvedVehicles) for (const vehicle of resolvedVehicles.filter((item) => !vehicles.some((saved) => saved.vin.toUpperCase() === item.vin))) {
        const response = await authenticatedFetch(appPath("/api/fleet/vehicles"), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ vehicleName: `${vehicle.year} ${vehicle.make} ${vehicle.model}`, vin: vehicle.vin, mileage: 0, status: "active", year: vehicle.year, make: vehicle.make, model: vehicle.model, trim: "", isPrimary: false }) })
        if (!response.ok) { const payload = await response.json() as { message?: string }; if (!payload.message?.includes("already exists")) throw new Error(payload.message ?? `Unable to save ${vehicle.vin}`) }
      }
      const primaryVin = batchVins[0]
      const primarySavedVehicle = vehicles.find((vehicle) => vehicle.vin.toUpperCase() === primaryVin)
      const primaryResolvedVehicle = resolvedVehicles.find((vehicle) => vehicle.vin === primaryVin)
      if (!primarySavedVehicle && !primaryResolvedVehicle) throw new Error(`We could not find VIN ${primaryVin}. Remove or correct it, then upload again.`)
      const payload = {
        source: "fleet",
        fleetVehicleId: batchVins.length === 1 ? primarySavedVehicle?.id : undefined,
        projectName: cleanText(projectName),
        description: cleanText(description),
        responseDeadline: new Date(`${deadline}T23:59:59`).toISOString(),
        deliveryRequirement,
        paymentTerms,
        companyName: user.companyName || "Fleet account",
        contactName: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.companyName || "Fleet contact",
        email: user.email || "not-provided@autopartspro.local",
        phone: user.phone || "Not provided",
        vehicle: primaryResolvedVehicle ? {
          year: primaryResolvedVehicle.year,
          make: primaryResolvedVehicle.make,
          model: primaryResolvedVehicle.model,
          vin: primaryResolvedVehicle.vin,
        } : undefined,
        parts: parts.map((part) => ({
          vehicleVin: part.vin?.trim().toUpperCase() || selectedVin,
          partName: cleanText(part.partName),
          partNumber: cleanText(part.partNumber),
          quantity: part.quantity,
          targetPrice: decimalOnly(part.targetPrice),
          notes: cleanText(part.notes),
        })),
      }
      const body = new FormData()
      body.set("payload", JSON.stringify(payload))
      const response = await authenticatedFetch(appPath("/api/rfqs"), { method: "POST", body })
      const result = await response.json() as { ok: boolean; message?: string; rfq?: { publicId?: string } }
      if (!response.ok || !result.ok) throw new Error(result.message ?? "Unable to submit RFQ")
      const created = result.rfq?.publicId ? `?created=${encodeURIComponent(result.rfq.publicId)}` : "?created=1"
      showToast({ type: "success", title: "RFQ created", message: result.rfq?.publicId ? `${result.rfq.publicId} created successfully.` : "RFQ created successfully." })
      router.push(`${appRoutes.rfqs}${created}`)
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit RFQ"
      setSubmitError(message)
      showToast({ type: "error", title: "Unable to submit RFQ", message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <RfqStepper step={step} />

      <div className="mx-auto max-w-5xl px-8 py-16">
        {submitError ? <p className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{submitError}</p> : null}
        {importedVehicleCount > 1 ? <p className="mb-6 rounded-lg border border-[#DC2626]/30 bg-[#DC2626]/10 p-3 text-sm text-white">{`${importedVehicleCount} vehicles verified successfully.`}</p> : null}
        {step === 1 && (
          <AddPartsStep
            parts={parts}
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            onVehicleChange={setSelectedVehicleId}
            canContinue={Boolean(canContinueStep1)}
            canAddPart={parts.length < maxParts}
            isImporting={isImporting}
            onAddPart={addAnotherPart}
            onImportFile={(file) => void importRfqFile(file)}
            onNext={handleNext}
            onUpdatePart={updatePart}
            saveResolvedVehicles={saveResolvedVehicles}
            onSaveResolvedVehiclesChange={setSaveResolvedVehicles}
          />
        )}

        {step === 2 && (
          <RfqDetailsStep
            projectName={projectName}
            description={description}
            deadline={deadline}
            vehicles={vehicles}
            selectedVehicleId={selectedVehicleId}
            vehicleCount={importedVehicleCount}
            canContinue={Boolean(canContinueStep2)}
            onBack={handleBack}
            onNext={handleNext}
            onProjectNameChange={setProjectName}
            onDescriptionChange={setDescription}
            onDeadlineChange={setDeadline}
            onVehicleChange={setSelectedVehicleId}
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
