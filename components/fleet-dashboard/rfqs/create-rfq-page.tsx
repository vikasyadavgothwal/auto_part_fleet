"use client"

import { useMemo, useState } from "react"

import { AddPartsStep } from "./add-parts-step"
import { ReviewRfqStep } from "./review-rfq-step"
import { RfqDetailsStep } from "./rfq-details-step"
import { RfqStepper } from "./rfq-stepper"
import type { PartItem, Step } from "./create-rfq-types"

export function CreateRfqPage() {
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
      <RfqStepper step={step} />

      <div className="mx-auto max-w-5xl px-8 py-16">
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
            canContinue={Boolean(canContinueStep2)}
            onBack={handleBack}
            onNext={handleNext}
            onProjectNameChange={setProjectName}
            onDescriptionChange={setDescription}
            onDeadlineChange={setDeadline}
            onDeliveryRequirementChange={setDeliveryRequirement}
            onPaymentTermsChange={setPaymentTerms}
          />
        )}

        {step === 3 && (
          <ReviewRfqStep
            parts={parts}
            projectName={projectName}
            deadline={deadline}
            totalQuantity={totalQuantity}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  )
}
