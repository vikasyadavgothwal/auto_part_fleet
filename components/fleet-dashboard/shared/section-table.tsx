import type { ReactNode } from "react"

type SectionTableProps = {
  headers: string[]
  children: ReactNode
}

export function SectionTable({ headers, children }: SectionTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#1A1A1A]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2A2A2A] bg-[#0A0A0A]">
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-sm font-semibold text-[#9CA3AF]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  )
}
