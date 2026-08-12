import {
  Award,
  Banknote,
  Clock,
  Package,
  Star,
  TrendingUp,
} from "lucide-react"

export const stats = [
  {
    title: "Active Suppliers",
    value: "5",
    icon: Package,
    iconClass: "text-[#DC2626]",
  },
  {
    title: "Total Spent (YTD)",
    value: "AED 1014K",
    icon: Banknote,
    iconClass: "text-green-500",
  },
  {
    title: "Avg Rating",
    value: "4.6",
    icon: Star,
    iconClass: "text-yellow-500",
  },
  {
    title: "Preferred Suppliers",
    value: "2",
    icon: Award,
    iconClass: "text-[#DC2626]",
  },
]

export const highlights = [
  {
    title: "Top Performer",
    icon: TrendingUp,
    iconClass: "text-green-500",
    name: "Global Auto Supply",
    rating: "4.9 rating",
    meta: "99% on-time delivery",
    stars: 5,
  },
  {
    title: "Fastest Delivery",
    icon: Clock,
    iconClass: "text-blue-500",
    name: "QuickShip Parts Ltd.",
    rating: "Average: 1.8 days",
    meta: "128 orders completed",
  },
  {
    title: "Highest Volume",
    icon: Banknote,
    iconClass: "text-green-500",
    name: "Global Auto Supply",
    rating: "AED 398K total spent",
    meta: "203 orders placed",
  },
]

export const suppliers = [
  {
    id: "SUP-001",
    name: "Premium Auto Parts Co.",
    type: "OEM Parts",
    rating: "4.8",
    orders: "156",
    spent: "AED 245,680",
    delivery: "2.3 days",
    onTime: "98%",
    status: "Preferred",
  },
  {
    id: "SUP-002",
    name: "QuickShip Parts Ltd.",
    type: "Aftermarket",
    rating: "4.6",
    orders: "89",
    spent: "AED 128,450",
    delivery: "1.8 days",
    onTime: "95%",
    status: "Active",
  },
  {
    id: "SUP-003",
    name: "Global Auto Supply",
    type: "OEM Parts",
    rating: "4.9",
    orders: "203",
    spent: "AED 398,230",
    delivery: "2.5 days",
    onTime: "99%",
    status: "Preferred",
  },
  {
    id: "SUP-004",
    name: "Budget Parts Direct",
    type: "Economy",
    rating: "4.2",
    orders: "45",
    spent: "AED 56,780",
    delivery: "3.2 days",
    onTime: "92%",
    status: "Active",
  },
]

export const guidance = [
  {
    title: "Preferred Supplier Status",
    items: [
      "Minimum 4.5 star rating from fleet managers",
      "95%+ on-time delivery rate",
      "Minimum 50 completed orders",
    ],
  },
  {
    title: "Review Periodically",
    items: [
      "Evaluate supplier performance quarterly",
      "Negotiate volume discounts with top suppliers",
      "Maintain diverse supplier network for reliability",
    ],
  },
]
