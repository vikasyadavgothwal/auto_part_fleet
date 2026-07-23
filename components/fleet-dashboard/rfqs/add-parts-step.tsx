import { ChevronRight, Download, Plus, Upload } from "lucide-react"

import { appPath } from "@/lib/routes"
import type { FleetVehicle } from "@/components/fleet-dashboard/vehicles/types"
import type { PartItem } from "./create-rfq-types"

type AddPartsStepProps = {
  parts: PartItem[]
  vehicles: FleetVehicle[]
  selectedVehicleId: string
  onVehicleChange: (value: string) => void
  canContinue: boolean
  canAddPart: boolean
  onAddPart: () => void
  onNext: () => void
  isImporting: boolean
  onImportFile: (file: File | undefined) => void
  onUpdatePart: (
    id: number,
    field: keyof PartItem,
    value: string | number
  ) => void
  saveResolvedVehicles: boolean
  onSaveResolvedVehiclesChange: (value: boolean) => void
}

const digitsOnly = (value: string) => value.replace(/\D/g, "")

const decimalOnly = (value: string) => {
  const normalized = value.replace(/[^\d.]/g, "")
  if (!/\d/.test(normalized)) return ""
  const [whole, ...decimalParts] = normalized.split(".")
  return decimalParts.length ? `${whole}.${decimalParts.join("").slice(0, 2)}` : whole
}

export function AddPartsStep({
  parts,
  vehicles,
  selectedVehicleId,
  onVehicleChange,
  canContinue,
  canAddPart,
  onAddPart,
  onNext,
  isImporting,
  onImportFile,
  onUpdatePart,
  saveResolvedVehicles,
  onSaveResolvedVehiclesChange,
}: AddPartsStepProps) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-bold text-white">
          Choose How to Identify the Vehicle
        </h2>
        <p className="text-[#9CA3AF]">
          Use a saved fleet vehicle, or enter a VIN with each requested part. You only need to use one method.
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-6">
        <label className="mb-2 block text-sm font-medium text-white">Option 1 — Select a saved fleet vehicle</label>
        <select value={selectedVehicleId} onChange={(event) => onVehicleChange(event.target.value)} className="h-12 w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-4 text-white">
          <option value="">No saved vehicle selected</option>
          {vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.vehicleName} · {vehicle.vin}</option>)}
        </select>
        <p className="mt-2 text-xs text-[#9CA3AF]">The selected vehicle applies to every part unless you enter a different VIN on a part.</p>
      </div>

      <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]"><span className="h-px flex-1 bg-[#2A2A2A]" /><span>or</span><span className="h-px flex-1 bg-[#2A2A2A]" /></div>

      <div className="mb-6 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-6">
        <p className="font-medium text-white">Option 2 — Enter VINs with the parts</p>
        <p className="mt-2 text-sm text-[#9CA3AF]">Use this for unsaved vehicles or a request containing different vehicles. Every VIN must contain 17 valid characters.</p>
      </div>

      <label className="block cursor-pointer rounded-xl border-2 border-dashed border-[#2A2A2A] bg-[#1A1A1A] p-6 transition-all hover:border-[#DC2626]">
        <div className="flex items-center gap-4">
          <Upload className="h-8 w-8 text-[#9CA3AF]" />
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-semibold text-white">
              Import CSV or Excel
            </h3>
            <p className="text-sm text-[#9CA3AF]">
              Columns: VIN No, Quantity, Target Price, Part Number, Part Name
            </p>
          </div>
          <span className="rounded-lg bg-[#DC2626] px-4 py-2 font-medium text-white transition-all hover:bg-[#B91C1C]">{isImporting ? "Importing..." : "Choose File"}</span>
          <input type="file" className="sr-only" accept=".csv,.xlsx,.xls" disabled={isImporting} onChange={(event) => { onImportFile(event.target.files?.[0]); event.currentTarget.value = "" }} />
        </div>
      </label>
      <div className="mb-8 mt-3 flex justify-end">
        <a
          href={appPath("/templates/rfq-import-template.csv")}
          download="rfq-import-template.csv"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#DC2626] hover:text-[#EF4444] hover:underline"
        >
          <Download className="h-4 w-4" />
          Download sample RFQ CSV
        </a>
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
                {part.vin ? <div className="md:col-span-2 text-xs font-medium text-[#9CA3AF]">VIN: {part.vin}</div> : null}
                <div className="md:col-span-2"><label className="mb-2 block text-sm font-medium text-white">{selectedVehicleId ? "Different vehicle VIN (optional)" : "Vehicle VIN *"}</label><input type="text" maxLength={17} value={part.vin ?? ""} onChange={(event) => onUpdatePart(part.id, "vin", event.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, ""))} placeholder={selectedVehicleId ? "Leave blank to use the selected vehicle" : "Enter the 17-character VIN"} className="h-12 w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-4 uppercase text-white placeholder:text-[#4B5563] focus:border-[#DC2626] focus:outline-none" /><p className="mt-2 text-xs text-[#9CA3AF]">{selectedVehicleId ? "Only enter this when this part is for another vehicle." : "Required because no saved vehicle is selected."}</p></div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Part Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Brake Pads"
                    value={part.partName}
                    onChange={(e) =>
                      onUpdatePart(part.id, "partName", e.target.value)
                    }
                    className="h-12 w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-4 text-white placeholder:text-[#4B5563] transition-all focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Part Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., BC1259"
                    value={part.partNumber}
                    onChange={(e) =>
                      onUpdatePart(part.id, "partNumber", e.target.value)
                    }
                    className="h-12 w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-4 text-white placeholder:text-[#4B5563] transition-all focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Quantity *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    min={1}
                    value={part.quantity}
                    onChange={(e) => {
                      const nextValue = digitsOnly(e.target.value)
                      onUpdatePart(part.id, "quantity", Number(nextValue) || 1)
                    }}
                    className="h-12 w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-4 text-white transition-all focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white">
                    Target Price (Optional)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="e.g., 125"
                    value={part.targetPrice}
                    onChange={(e) =>
                      onUpdatePart(part.id, "targetPrice", decimalOnly(e.target.value))
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
                      onUpdatePart(part.id, "notes", e.target.value)
                    }
                    className="h-12 w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] px-4 text-white placeholder:text-[#4B5563] transition-all focus:border-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/50"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {parts.some((part) => part.vin) ? <label className="mb-6 flex items-center gap-3 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-4 text-sm text-white"><input type="checkbox" checked={saveResolvedVehicles} onChange={(event) => onSaveResolvedVehiclesChange(event.target.checked)} className="h-4 w-4 accent-[#DC2626]" />Save newly resolved VIN vehicles to my fleet</label> : null}

      <button
        onClick={onAddPart}
        disabled={!canAddPart}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#2A2A2A] bg-[#1A1A1A] p-6 text-white transition-all hover:border-[#DC2626] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Plus className="h-5 w-5" />
        {canAddPart ? "Add Another Part" : "Maximum 20 Parts"}
      </button>

      <div className="mt-12 flex gap-4">
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
