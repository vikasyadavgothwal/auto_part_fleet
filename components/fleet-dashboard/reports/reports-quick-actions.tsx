import { reportCards } from "./reports-data"

export function ReportsQuickActions() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {reportCards.map((card) => (
        <button
          key={card.title}
          className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-6 text-left transition-all hover:border-[#DC2626]"
        >
          <h4 className="mb-2 font-semibold text-white">{card.title}</h4>
          <p className="mb-4 text-sm text-[#9CA3AF]">{card.description}</p>
          <div className="text-sm font-medium text-[#DC2626]">
            Generate Report →
          </div>
        </button>
      ))}
    </div>
  )
}
