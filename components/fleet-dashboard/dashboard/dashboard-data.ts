import {
  Banknote,
  BarChart3,
  FileText,
  ShoppingCart,
  TrendingDown,
  Truck,
} from "lucide-react"

export const kpis = [
  {
    title: "Monthly Spend",
    value: "AED 48,920",
    subtext: "↓ 15% vs last month",
    icon: Banknote,
  },
  {
    title: "Active RFQs",
    value: "12",
    subtext: "42 quotes received",
    icon: FileText,
  },
  {
    title: "Orders in Progress",
    value: "8",
    subtext: "3 arriving today",
    icon: ShoppingCart,
  },
  {
    title: "Total Vehicles",
    value: "247",
    subtext: "234 active, 13 maintenance",
    icon: Truck,
  },
]

export const summaryCards = [
  {
    title: "Cost Per Vehicle",
    value: "AED 198",
    subtext: "↓ 8% this month",
    icon: TrendingDown,
    subtextClass: "text-[#DC2626]",
  },
  {
    title: "Avg Parts Delivery",
    value: "2.3 days",
    subtext: "Within target",
    icon: BarChart3,
    subtextClass: "text-[#9CA3AF]",
  },
  {
    title: "Maintenance Due",
    value: "18 vehicles",
    subtext: "Next 30 days",
    icon: Truck,
    subtextClass: "text-[#9CA3AF]",
  },
]

export const rfqs = [
  {
    id: "RFQ-701",
    vehicles: "5 vehicles",
    parts: "Brake Pads, Oil Filters",
    quotes: "8 received",
    status: "Active",
    expires: "3 days",
  },
  {
    id: "RFQ-702",
    vehicles: "10 vehicles",
    parts: "Air Filters, Spark Plugs",
    quotes: "12 received",
    status: "Active",
    expires: "5 days",
  },
]

export const orders = [
  {
    id: "ORD-801",
    supplier: "Acme Auto Parts",
    items: "24 parts",
    vehicles: "6 vehicles",
    amount: "AED 2,450",
    status: "In Transit",
    eta: "Jan 25",
  },
  {
    id: "ORD-802",
    supplier: "Premium Parts Co",
    items: "18 parts",
    vehicles: "4 vehicles",
    amount: "AED 1,890",
    status: "Processing",
    eta: "Jan 26",
  },
]

export const fleetVehicles = [
  {
    unit: "Unit 101",
    vehicle: "2020 Ford F-150",
    status: "Active",
    mileage: "45,234",
    maintenance: "Due in 2 weeks",
    maintenanceClass: "text-[#9CA3AF]",
  },
  {
    unit: "Unit 102",
    vehicle: "2019 Chevrolet Silverado",
    status: "Maintenance",
    mileage: "67,890",
    maintenance: "In progress",
    maintenanceClass: "text-yellow-500 font-semibold",
  },
]

export const suppliers = [
  {
    name: "Acme Auto Parts",
    orders: "24",
    spend: "AED 12,450",
    rating: "4.9 / 5.0",
  },
  {
    name: "Premium Parts Co",
    orders: "18",
    spend: "AED 9,860",
    rating: "4.8 / 5.0",
  },
  {
    name: "QuickParts Supply",
    orders: "15",
    spend: "AED 7,230",
    rating: "4.7 / 5.0",
  },
]
