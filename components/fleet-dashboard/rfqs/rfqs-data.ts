export const stats = [
  { title: "Total RFQs", value: "3", valueClass: "text-white" },
  { title: "Active", value: "2", valueClass: "text-[#DC2626]" },
  { title: "Total Quotes", value: "25", valueClass: "text-white" },
  { title: "Potential Savings", value: "AED 324", valueClass: "text-white" },
]

export const rfqs = [
  {
    id: "RFQ-F001",
    date: "2024-01-22",
    parts: "Brake Pads (Multiple)",
    vehicles: "4 units",
    quotes: "8 received",
    bestPrice: "AED 359.96",
    status: "Active",
    expires: "3 days",
    action: "View Quotes",
    actionPrimary: true,
  },
  {
    id: "RFQ-F002",
    date: "2024-01-20",
    parts: "Oil Filters",
    vehicles: "6 units",
    quotes: "12 received",
    bestPrice: "AED 77.94",
    status: "Active",
    expires: "5 days",
    action: "View Quotes",
    actionPrimary: true,
  },
  {
    id: "RFQ-F003",
    date: "2024-01-18",
    parts: "Tires (Full Set)",
    vehicles: "2 units",
    quotes: "5 received",
    bestPrice: "AED 1,199.00",
    status: "Accepted",
    expires: "Completed",
    action: "View",
    actionPrimary: false,
  },
]

export const benefits = [
  {
    title: "Volume Discounts",
    description:
      "Get better pricing when ordering parts for multiple vehicles at once.",
  },
  {
    title: "Simplified Ordering",
    description:
      "Submit one RFQ for all your vehicles instead of individual requests.",
  },
  {
    title: "Better Visibility",
    description:
      "Track procurement across your entire fleet from one dashboard.",
  },
]
