import type { Step } from "./create-rfq-types"
import { stepLabels } from "./create-rfq-data"

type RfqStepperProps = {
  step: Step
}

export function RfqStepper({ step }: RfqStepperProps) {
  return (
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
  )
}
