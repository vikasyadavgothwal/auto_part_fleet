import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"

import { filters } from "./orders-data"

export function OrderFilters() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-[#9CA3AF]">
        <Search className="h-5 w-5" />
        <span className="font-medium">Filter:</span>
      </div>

      <div className="flex gap-2">
        {filters.map((filter, index) => (
          <Button
            key={filter}
            variant="outline"
            className={
              index === 0
                ? "bg-[#DC2626] text-white hover:bg-[#DC2626] hover:text-white border-[#DC2626]"
                : "border-[#2A2A2A] bg-[#1A1A1A] text-[#9CA3AF] hover:border-[#DC2626] hover:bg-[#1A1A1A] hover:text-white"
            }
          >
            {filter}
          </Button>
        ))}
      </div>
    </div>
  )
}
