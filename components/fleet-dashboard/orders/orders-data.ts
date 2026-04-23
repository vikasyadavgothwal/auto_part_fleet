export const stats = [
  { title: "Total Orders", value: "3", valueClass: "text-white" },
  { title: "Processing", value: "1", valueClass: "text-yellow-500" },
  { title: "In Transit", value: "1", valueClass: "text-blue-500" },
  { title: "Total Spent", value: "AED 1,636.90", valueClass: "text-[#DC2626]" },
]

export const filters = ["All Orders", "Processing", "Shipped", "Delivered"]

export const orders = [
  {
    id: "ORD-F001",
    date: "2024-01-22",
    parts: "Brake Pads (x4)",
    vehicles: "4 vehicles",
    supplier: "Acme Auto Parts",
    total: "AED 359.96",
    status: "Processing",
  },
  {
    id: "ORD-F002",
    date: "2024-01-20",
    parts: "Oil Filters (x6)",
    vehicles: "6 vehicles",
    supplier: "Premium Parts Co",
    total: "AED 77.94",
    status: "Shipped",
  },
  {
    id: "ORD-F003",
    date: "2024-01-18",
    parts: "Tires (Full Set x2)",
    vehicles: "2 vehicles",
    supplier: "QuickParts Supply",
    total: "AED 1,199.00",
    status: "Delivered",
  },
]

export const costBreakdown = [
  { label: "Brake Systems", amount: "AED 359.96", width: "22%" },
  { label: "Oil & Filters", amount: "AED 77.94", width: "5%" },
  { label: "Tires", amount: "AED 1,199.00", width: "73%" },
]
