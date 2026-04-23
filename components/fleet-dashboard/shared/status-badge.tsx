const statusStyles: Record<string, string> = {
  Active: "bg-green-500/10 text-green-500 border-green-500/20",
  Delivered: "bg-green-500/10 text-green-500 border-green-500/20",
  Preferred: "bg-green-500/10 text-green-500 border-green-500/20",
  Accepted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "In Transit": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Shipped: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Maintenance: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Processing: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
}

type StatusBadgeProps = {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${
        statusStyles[status] ?? "bg-[#2A2A2A] text-white border-[#2A2A2A]"
      }`}
    >
      {status}
    </span>
  )
}
