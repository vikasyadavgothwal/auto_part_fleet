import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import type { FleetVehicle } from "@/components/fleet-dashboard/vehicles/types"

type RfqDetailsStepProps = {
  projectName: string
  description: string
  deadline: string
  deliveryRequirement: string
  paymentTerms: string
  vehicles: FleetVehicle[]
  selectedVehicleId: string
  canContinue: boolean
  onBack: () => void
  onNext: () => void
  onProjectNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onDeadlineChange: (value: string) => void
  onDeliveryRequirementChange: (value: string) => void
  onPaymentTermsChange: (value: string) => void
  onVehicleChange: (value: string) => void
  onAttachmentChange: (file: File | null) => void
}

export function RfqDetailsStep({
  projectName,
  description,
  deadline,
  deliveryRequirement,
  paymentTerms,
  vehicles,
  selectedVehicleId,
  canContinue,
  onBack,
  onNext,
  onProjectNameChange,
  onDescriptionChange,
  onDeadlineChange,
  onDeliveryRequirementChange,
  onPaymentTermsChange,
  onVehicleChange,
  onAttachmentChange,
}: RfqDetailsStepProps) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-bold text-white">RFQ Details</h2>
        <p className="text-[#9CA3AF]">
          Provide information about this quote request
        </p>
      </div>

      <div className="space-y-6 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-8">
        <div>
          <label className="mb-2 block text-sm font-medium text-white">Fleet Vehicle *</label>
          <select value={selectedVehicleId} onChange={(event) => onVehicleChange(event.target.value)} className="h-12 w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-4 text-white" required>
            <option value="">Select a vehicle</option>
            {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.vehicleName} · {vehicle.vin}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Project Name *
          </label>
          <input
            type="text"
            placeholder="e.g., Q2 Fleet Maintenance"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            className="h-12 w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-4 text-white placeholder:text-[#4B5563] transition-all focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">Attach document (optional)</label>
          <input type="file" accept="application/pdf,image/png,image/jpeg" onChange={(event) => onAttachmentChange(event.target.files?.[0] ?? null)} className="block w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-3 text-sm text-[#9CA3AF]" />
          <p className="mt-2 text-xs text-[#9CA3AF]">PDF, PNG, or JPG up to 10 MB.</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white">
            Description
          </label>
          <textarea
            placeholder="Provide additional context about this RFQ..."
            rows={4}
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
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
              onChange={(e) => onDeadlineChange(e.target.value)}
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
            onChange={(e) => onDeliveryRequirementChange(e.target.value)}
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
            onChange={(e) => onPaymentTermsChange(e.target.value)}
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
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] px-6 py-3 font-medium text-white transition-all hover:border-[#DC2626]"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </button>

        <button
          disabled={!canContinue}
          onClick={onNext}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium transition-all ${
            canContinue
              ? "bg-[#DC2626] text-white hover:bg-[#B91C1C]"
              : "cursor-not-allowed bg-[#2A2A2A] text-[#4B5563]"
          }`}
        >
          Continue
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
