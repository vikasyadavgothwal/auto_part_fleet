import { ChevronRight, Plus, Upload } from "lucide-react"

import type { PartItem } from "./create-rfq-types"

type AddPartsStepProps = {
  parts: PartItem[]
  canContinue: boolean
  onAddPart: () => void
  onNext: () => void
  onUpdatePart: (
    id: number,
    field: keyof PartItem,
    value: string | number
  ) => void
}

export function AddPartsStep({
  parts,
  canContinue,
  onAddPart,
  onNext,
  onUpdatePart,
}: AddPartsStepProps) {
  return (
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
                      onUpdatePart(part.id, "partName", e.target.value)
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
                    type="number"
                    min={1}
                    value={part.quantity}
                    onChange={(e) =>
                      onUpdatePart(
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
                    placeholder="e.g., AED 125"
                    value={part.targetPrice}
                    onChange={(e) =>
                      onUpdatePart(part.id, "targetPrice", e.target.value)
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

      <button
        onClick={onAddPart}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#2A2A2A] bg-[#1A1A1A] p-6 text-white transition-all hover:border-[#DC2626]"
      >
        <Plus className="h-5 w-5" />
        Add Another Part
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
