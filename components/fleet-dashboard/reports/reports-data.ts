import { AlertCircle, Banknote, Clock, Package } from "lucide-react"

export const stats = [
  {
    title: "Total Spending (6mo)",
    value: "AED 301K",
    icon: Banknote,
    iconClass: "text-green-500",
    footerType: "trend-up",
    footerValue: "8.7%",
    footerLabel: "vs last month",
  },
  {
    title: "Avg Monthly Orders",
    value: "93",
    icon: Package,
    iconClass: "text-[#DC2626]",
    footerType: "text",
    footerLabel: "560 orders total",
  },
  {
    title: "Avg Delivery Time",
    value: "2.4 days",
    icon: Clock,
    iconClass: "text-blue-500",
    footerType: "trend-down",
    footerLabel: "0.3 days faster",
  },
  {
    title: "Cost Savings",
    value: "AED 23.5K",
    icon: AlertCircle,
    iconClass: "text-yellow-500",
    footerType: "text",
    footerLabel: "Through bulk RFQs",
  },
]

export const spendingTrend = [
  { month: "Jan", actual: 45500, budget: 50000 },
  { month: "Feb", actual: 52200, budget: 50000 },
  { month: "Mar", actual: 48800, budget: 50000 },
  { month: "Apr", actual: 51100, budget: 50000 },
  { month: "May", actual: 49400, budget: 50000 },
  { month: "Jun", actual: 53700, budget: 50000 },
]

export const deliveryData = [
  { week: "Week 1", onTime: 95, delayed: 5 },
  { week: "Week 2", onTime: 98, delayed: 2 },
  { week: "Week 3", onTime: 92, delayed: 8 },
  { week: "Week 4", onTime: 97, delayed: 3 },
]

export const categoryDistribution = [
  { name: "Engine Parts", value: 35, color: "#DC2626" },
  { name: "Brake System", value: 25, color: "#F59E0B" },
  { name: "Suspension", value: 20, color: "#3B82F6" },
  { name: "Electrical", value: 12, color: "#10B981" },
  { name: "Other", value: 8, color: "#6B7280" },
]

export const reportCards = [
  {
    title: "Cost Analysis Report",
    description:
      "Detailed breakdown of spending by category, supplier, and vehicle",
  },
  {
    title: "Supplier Comparison",
    description:
      "Compare pricing, delivery times, and quality across suppliers",
  },
  {
    title: "Fleet Maintenance Forecast",
    description:
      "Predict upcoming maintenance needs and budget requirements",
  },
]

export const supplierSpend = [
  {
    name: "Premium Parts",
    orders: 156,
    spent: "AED 245.7K",
    avgOrder: "AED 1575",
    share: 24.2,
  },
  {
    name: "QuickShip",
    orders: 89,
    spent: "AED 128.4K",
    avgOrder: "AED 1443",
    share: 12.7,
  },
  {
    name: "Elite Performance",
    orders: 67,
    spent: "AED 184.9K",
    avgOrder: "AED 2760",
    share: 18.2,
  },
  {
    name: "Budget Direct",
    orders: 45,
    spent: "AED 56.8K",
    avgOrder: "AED 1262",
    share: 5.6,
  },
]
