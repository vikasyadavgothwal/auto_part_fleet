"use client"

import { useMemo, useState } from "react"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Upload,
} from "lucide-react"

type Step = 1 | 2 | 3

type PartItem = {
  id: number
  partName: string
  partNumber: string
  quantity: number
  targetPrice: string
  notes: string
}

const stepLabels = [
  { id: 1, label: "Add Parts" },
  { id: 2, label: "RFQ Details" },
  { id: 3, label: "Review & Submit" },
]

export default function FleetBulkRfqPage() {
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
  const [deadline, setDeadline] = useState("2026-04-15")
  const [deliveryRequirement, setDeliveryRequirement] =
    useState("Standard Delivery")
  const [paymentTerms, setPaymentTerms] = useState("Net 30")

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
    projectName.trim() && deadline.trim() && deliveryRequirement && paymentTerms

  function updatePart(id: number, field: keyof PartItem, value: string | number) {
    setParts((prev) =>
      prev.map((part) =>
        part.id === id ? { ...part, [field]: value } : part
      )
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

  function handleSubmit() {
    console.log({
      parts,
      projectName,
      description,
      deadline,
      deliveryRequirement,
      paymentTerms,
    })
    alert("RFQ submitted successfully")
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="border-b border-[#2A2A2A] bg-[#1A1A1A]">
        <div className="mx-auto max-w-5xl px-8 py-6">
          <div className="flex items-center justify-between">
            {stepLabels.map((item, index) => {
              const isCompleted = step > item.id
              const isCurrent = step === item.id

              return (
                <div key={item.id} className="flex flex-1 items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all ${
                        isCompleted
                          ? "bg-[#10B981] text-white"
                          : isCurrent
                          ? "bg-[#DC2626] text-white"
                          : "bg-[#2A2A2A] text-[#9CA3AF]"
                      }`}
                    >
                      {item.id}
                    </div>

                    <span
                      className={`hidden text-sm font-medium md:block ${
                        isCurrent
                          ? "text-white"
                          : isCompleted
                          ? "text-[#9CA3AF]"
                          : "text-[#9CA3AF]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>

                  {index < stepLabels.length - 1 && (
                    <div className="mx-4 h-0.5 flex-1 bg-[#2A2A2A]">
                      <div
                        className={`h-full transition-all ${
                          step > item.id ? "bg-[#10B981]" : "bg-transparent"
                        }`}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-8 py-16">
        {step === 1 && (
          <div>
            <div className="mb-8">
              <h2 className="mb-2 text-3xl font-bold text-white">
                Add Parts to RFQ
              </h2>
              <p className="text-[#9CA3AF]">
                Add multiple parts to get quotes from suppliers
              </p>
            </div>

            <div className="mb-8 cursor-pointer rounded-xl border-2 border-dashed border-[#2A2A2A] bg-[#1A1A1A] p-6 transition-all hover:border-[#DC2626]">
              <div className="flex items-center gap-4">
                <Upload className="h-8 w-8 text-[#9CA3AF]" />
                <div className="flex-1">
                  <h3 className="mb-1 text-lg font-semibold text-white">
                    Upload CSV
                  </h3>
                  <p className="text-sm text-[#9CA3AF]">
                    Upload a CSV file with your parts list for faster entry
                  </p>
                </div>
                <button className="rounded-lg bg-[#DC2626] px-4 py-2 font-medium text-white transition-all hover:bg-[#B91C1C]">
                  Choose File
                </button>
              </div>
            </div>

            <div className="mb-6 space-y-4">
              {parts.map((part, index) => (
                <div
                  key={part.id}
                  className="rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#DC2626]/20 bg-[#DC2626]/10">
                      <span className="font-semibold text-[#DC2626]">
                        {index + 1}
                      </span>
                    </div>

                    <div className="grid flex-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-white">
                          Part Name *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Brake Pads"
                          value={part.partName}
                          onChange={(e) =>
                            updatePart(part.id, "partName", e.target.value)
                          }
                          className="h-12 w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-4 text-white placeholder:text-[#4B5563] transition-all focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-white">
                          Part Number *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., BC1259"
                          value={part.partNumber}
                          onChange={(e) =>
                            updatePart(part.id, "partNumber", e.target.value)
                          }
                          className="h-12 w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-4 text-white placeholder:text-[#4B5563] transition-all focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-white">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={part.quantity}
                          onChange={(e) =>
                            updatePart(
                              part.id,
                              "quantity",
                              Number(e.target.value) || 1
                            )
                          }
                          className="h-12 w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-4 text-white transition-all focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-white">
                          Target Price (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., $125"
                          value={part.targetPrice}
                          onChange={(e) =>
                            updatePart(part.id, "targetPrice", e.target.value)
                          }
                          className="h-12 w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-4 text-white placeholder:text-[#4B5563] transition-all focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-white">
                          Notes (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Any specific requirements..."
                          value={part.notes}
                          onChange={(e) =>
                            updatePart(part.id, "notes", e.target.value)
                          }
                          className="h-12 w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-4 text-white placeholder:text-[#4B5563] transition-all focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addAnotherPart}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#2A2A2A] bg-[#1A1A1A] p-6 text-white transition-all hover:border-[#DC2626]"
            >
              <Plus className="h-5 w-5" />
              Add Another Part
            </button>

            <div className="mt-12 flex gap-4">
              <button
                disabled={!canContinueStep1}
                onClick={handleNext}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium transition-all ${
                  canContinueStep1
                    ? "bg-[#DC2626] text-white hover:bg-[#B91C1C]"
                    : "cursor-not-allowed bg-[#2A2A2A] text-[#4B5563]"
                }`}
              >
                Continue
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="mb-8">
              <h2 className="mb-2 text-3xl font-bold text-white">
                RFQ Details
              </h2>
              <p className="text-[#9CA3AF]">
                Provide information about this quote request
              </p>
            </div>

            <div className="space-y-6 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-8">
              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Project Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Q2 Fleet Maintenance"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="h-12 w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-4 text-white placeholder:text-[#4B5563] transition-all focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Description
                </label>
                <textarea
                  placeholder="Provide additional context about this RFQ..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full resize-none rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-4 py-3 text-white placeholder:text-[#4B5563] transition-all focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Response Deadline *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="h-12 w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] pl-12 pr-4 text-white transition-all focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Delivery Requirements
                </label>
                <select
                  value={deliveryRequirement}
                  onChange={(e) => setDeliveryRequirement(e.target.value)}
                  className="h-12 w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-4 text-white transition-all focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50"
                >
                  <option>Standard Delivery</option>
                  <option>Express Delivery</option>
                  <option>Next Day Delivery</option>
                  <option>Same Day Delivery</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white">
                  Payment Terms
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="h-12 w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-4 text-white transition-all focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50"
                >
                  <option>Net 30</option>
                  <option>Net 60</option>
                  <option>Net 90</option>
                  <option>Due on Receipt</option>
                </select>
              </div>
            </div>

            <div className="mt-12 flex gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] px-6 py-3 font-medium text-white transition-all hover:border-[#DC2626]"
              >
                <ChevronLeft className="h-5 w-5" />
                Back
              </button>

              <button
                disabled={!canContinueStep2}
                onClick={handleNext}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium transition-all ${
                  canContinueStep2
                    ? "bg-[#DC2626] text-white hover:bg-[#B91C1C]"
                    : "cursor-not-allowed bg-[#2A2A2A] text-[#4B5563]"
                }`}
              >
                Continue
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="mb-8">
              <h2 className="mb-2 text-3xl font-bold text-white">
                Review RFQ
              </h2>
              <p className="text-[#9CA3AF]">
                Review your bulk RFQ before sending to suppliers
              </p>
            </div>

            <div className="mb-6 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-8">
              <h3 className="mb-6 text-xl font-bold text-white">
                RFQ Information
              </h3>

              <div className="mb-6 grid gap-6 md:grid-cols-2">
                <div>
                  <div className="mb-1 text-sm text-[#9CA3AF]">
                    Project Name
                  </div>
                  <div className="text-lg font-semibold text-white">
                    {projectName || "-"}
                  </div>
                </div>

                <div>
                  <div className="mb-1 text-sm text-[#9CA3AF]">Deadline</div>
                  <div className="text-lg font-semibold text-white">
                    {deadline || "-"}
                  </div>
                </div>

                <div>
                  <div className="mb-1 text-sm text-[#9CA3AF]">
                    Total Line Items
                  </div>
                  <div className="text-lg font-semibold text-white">
                    {parts.length}
                  </div>
                </div>

                <div>
                  <div className="mb-1 text-sm text-[#9CA3AF]">
                    Total Quantity
                  </div>
                  <div className="text-lg font-semibold text-white">
                    {totalQuantity}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-8">
              <h3 className="mb-6 text-xl font-bold text-white">Parts List</h3>

              <div className="space-y-4">
                {parts.map((part, index) => (
                  <div
                    key={part.id}
                    className="rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#DC2626]/20 bg-[#DC2626]/10">
                        <span className="text-sm font-semibold text-[#DC2626]">
                          {index + 1}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="mb-1 font-semibold text-white">
                          {part.partName || "-"}
                        </div>
                        <div className="mb-2 text-sm text-[#9CA3AF]">
                          Part #: {part.partNumber || "-"}
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <span className="text-white">
                            Qty:{" "}
                            <span className="font-semibold">
                              {part.quantity}
                            </span>
                          </span>
                          {part.targetPrice && (
                            <span className="text-white">
                              Target:{" "}
                              <span className="font-semibold">
                                {part.targetPrice}
                              </span>
                            </span>
                          )}
                        </div>
                        {part.notes && (
                          <div className="mt-2 text-sm text-[#9CA3AF]">
                            {part.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                className="mt-8 h-14 w-full rounded-xl bg-[#DC2626] text-lg font-medium text-white transition-all hover:bg-[#B91C1C]"
              >
                Submit RFQ to Suppliers
              </button>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] px-6 py-3 font-medium text-white transition-all hover:border-[#DC2626]"
              >
                <ChevronLeft className="h-5 w-5" />
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}