import { ChevronLeft, Loader2 } from "lucide-react"

import type { PartItem } from "./create-rfq-types"

type ReviewRfqStepProps = {
  parts: PartItem[]
  projectName: string
  deadline: string
  totalQuantity: number
  isSubmitting: boolean
  onBack: () => void
  onSubmit: () => void
}

export function ReviewRfqStep({
  parts,
  projectName,
  deadline,
  totalQuantity,
  isSubmitting,
  onBack,
  onSubmit,
}: ReviewRfqStepProps) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-2 text-3xl font-bold text-white">Review RFQ</h2>
        <p className="text-[#9CA3AF]">
          Review your bulk RFQ before sending to suppliers
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] p-8">
        <h3 className="mb-6 text-xl font-bold text-white">RFQ Information</h3>

        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-1 text-sm text-[#9CA3AF]">Project Name</div>
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
            <div className="mb-1 text-sm text-[#9CA3AF]">Total Quantity</div>
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
                  {part.vin ? <div className="mb-2 text-sm text-[#9CA3AF]">VIN: {part.vin}</div> : null}
                  <div className="flex items-center gap-6 text-sm">
                    <span className="text-white">
                      Qty:{" "}
                      <span className="font-semibold">{part.quantity}</span>
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
          disabled={isSubmitting}
          onClick={onSubmit}
          className="mt-8 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#DC2626] text-lg font-medium text-white transition-all hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:bg-[#2A2A2A] disabled:text-[#9CA3AF]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting RFQ...
            </>
          ) : (
            "Submit RFQ to Suppliers"
          )}
        </button>
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 rounded-xl border border-[#2A2A2A] bg-[#1A1A1A] px-6 py-3 font-medium text-white transition-all hover:border-[#DC2626]"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </button>
      </div>
    </div>
  )
}
