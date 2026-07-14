export type AnalyticsSupplier = {
  id: string
  publicId: string
  name: string
  email: string | null
  type: string
  rating: number
  orders: number
  spent: number
  avgDeliveryDays: number | null
  onTimeRate: number
  status: "Preferred" | "Active"
}

export type SupplierStat = {
  title: string
  value: string
  iconKey: "package" | "banknote" | "star" | "award"
  iconClass: string
}

export type SupplierHighlight = {
  title: string
  iconKey: "trending" | "clock" | "banknote"
  iconClass: string
  name: string
  rating: string
  meta: string
  stars?: number
}

export type FleetReportStat = {
  title: string
  value: string
  iconKey: "banknote" | "package" | "clock" | "alert"
  iconClass: string
  footerType: "trend-up" | "trend-down" | "text"
  footerValue?: string
  footerLabel: string
}

export type SpendingTrendPoint = {
  month: string
  actual: number
  budget: number
}

export type DeliveryPerformancePoint = {
  week: string
  onTime: number
  delayed: number
}

export type CategoryDistributionPoint = {
  name: string
  value: number
  color: string
}

export type SupplierSpendPoint = {
  name: string
  orders: number
  spent: string
  spentAmount: number
  avgOrder: string
  share: number
}

export type FleetReportData = {
  stats: FleetReportStat[]
  spendingTrend: SpendingTrendPoint[]
  deliveryData: DeliveryPerformancePoint[]
  categoryDistribution: CategoryDistributionPoint[]
  supplierSpend: SupplierSpendPoint[]
  generatedAt: string
}

export type DashboardKpi = {
  title: string
  value: string
  subtext: string
  iconKey: "banknote" | "fileText" | "shoppingCart" | "truck"
}

export type DashboardSummary = {
  title: string
  value: string
  subtext: string
  iconKey: "trendingDown" | "barChart" | "truck"
  subtextClass: string
}

export type DashboardRfqRow = {
  id: string
  vehicles: string
  parts: string
  quotes: string
  status: string
  expires: string
}

export type DashboardOrderRow = {
  id: string
  supplier: string
  items: string
  vehicles: string
  amount: string
  status: string
  date: string
}

export type DashboardVehicleRow = {
  id: string
  unit: string
  vehicle: string
  status: string
  mileage: string
  maintenance: string
  maintenanceClass: string
}

export type DashboardTopSupplier = {
  name: string
  orders: string
  spend: string
  rating: string
}

export type FleetOverviewData = {
  kpis: DashboardKpi[]
  summaries: DashboardSummary[]
  rfqs: DashboardRfqRow[]
  orders: DashboardOrderRow[]
  vehicles: DashboardVehicleRow[]
  suppliers: DashboardTopSupplier[]
}

type SupplierIdentity = {
  id: string
  supplierPublicId?: string | null
  companyName: string | null
  firstName: string | null
  lastName: string | null
  email: string | null
}

export type AnalyticsOrder = {
  id: string
  publicId?: string | null
  source: "rfq" | "direct"
  totalAmount: number
  status: string
  createdAt: string
  supplier: SupplierIdentity
  items: Array<{
    partName: string
    quantity: number
    lineTotal: number | null
  }>
  rfq?: {
    vehicleVin: string | null
    vehicleYear: number | null
    vehicleMake: string | null
    vehicleModel: string | null
    vehicleTrim: string | null
  } | null
}

export type AnalyticsRfq = {
  id: string
  publicId?: string | null
  projectName?: string | null
  responseDeadline?: string | null
  vehicleVin?: string | null
  vehicleYear?: number | null
  vehicleMake?: string | null
  vehicleModel?: string | null
  vehicleTrim?: string | null
  order?: { id: string; publicId: string; bidId: string; totalAmount: number; status: string } | null
  status: "open" | "closed" | "cancelled"
  createdAt: string
  parts: Array<{
    partName: string
    quantity: number
    targetPrice: number | null
  }>
  bids: Array<{
    id: string
    totalAmount: number
    deliveryDays: number
    partType?: string | null
    status: "submitted" | "accepted" | "rejected" | "withdrawn"
    createdAt: string
    supplier: SupplierIdentity
  }>
}

export type AnalyticsVehicle = {
  id?: string
  vehicleName?: string
  vin?: string
  mileage?: number
  driver?: string | null
  status: "active" | "maintenance" | "inactive"
  year?: number
  make?: string
  model?: string
  trim?: string | null
  isPrimary?: boolean
}

export type FleetAnalyticsInput = {
  orders: AnalyticsOrder[]
  rfqs: AnalyticsRfq[]
  vehicles: AnalyticsVehicle[]
}

const currency = (amount: number) =>
  `AED ${amount.toLocaleString("en-AE", {
    maximumFractionDigits: 0,
  })}`

const currencyCompact = (amount: number) => {
  if (amount >= 1_000_000) return `AED ${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `AED ${(amount / 1_000).toFixed(1)}K`
  return currency(amount)
}

const percent = (value: number) => `${Math.round(value)}%`

const statusLabel = (status: string) =>
  status
    .split(/[_-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

const supplierName = (supplier: SupplierIdentity) =>
  supplier.companyName ||
  [supplier.firstName, supplier.lastName].filter(Boolean).join(" ") ||
  supplier.email ||
  "Supplier"

const supplierPublicId = (supplier: SupplierIdentity, fallbackIndex: number) =>
  supplier.supplierPublicId || `SUP-${String(fallbackIndex + 1).padStart(3, "0")}`

const monthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`

const daysUntil = (dateValue?: string | null) => {
  if (!dateValue) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(dateValue)
  date.setHours(0, 0, 0, 0)
  if (Number.isNaN(date.getTime())) return null
  return Math.ceil((date.getTime() - today.getTime()) / 86_400_000)
}

const deadlineLabel = (rfq: AnalyticsRfq) => {
  if (rfq.status !== "open") return "Completed"
  const days = daysUntil(rfq.responseDeadline)
  if (days === null) return "No deadline"
  if (days < 0) return "Expired"
  if (days === 0) return "Today"
  return `${days} day${days === 1 ? "" : "s"}`
}

const vehicleLabel = (value: {
  vehicleYear?: number | null
  vehicleMake?: string | null
  vehicleModel?: string | null
  vehicleTrim?: string | null
  vehicleVin?: string | null
}) =>
  [value.vehicleYear, value.vehicleMake, value.vehicleModel, value.vehicleTrim]
    .filter(Boolean)
    .join(" ") || value.vehicleVin || "Not specified"

const lastMonths = (count: number) => {
  const now = new Date()
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (count - 1 - index), 1)
    return {
      key: monthKey(date),
      label: date.toLocaleDateString("en-US", { month: "short" }),
    }
  })
}

const categoryForPart = (partName: string) => {
  const value = partName.toLowerCase()
  if (/(brake|pad|rotor|caliper)/.test(value)) return "Brake System"
  if (/(filter|oil|air|fuel)/.test(value)) return "Filters & Fluids"
  if (/(shock|strut|suspension|control arm)/.test(value)) return "Suspension"
  if (/(battery|sensor|lamp|light|electrical|alternator|starter)/.test(value)) return "Electrical"
  if (/(engine|spark|plug|belt|pump|gasket)/.test(value)) return "Engine Parts"
  return "Other"
}

const categoryColors: Record<string, string> = {
  "Engine Parts": "#DC2626",
  "Brake System": "#F59E0B",
  "Suspension": "#3B82F6",
  "Electrical": "#10B981",
  "Filters & Fluids": "#8B5CF6",
  Other: "#6B7280",
}

export function buildFleetOverviewData(input: FleetAnalyticsInput): FleetOverviewData {
  const now = new Date()
  const currentMonthKey = monthKey(new Date(now.getFullYear(), now.getMonth(), 1))
  const previousMonthKey = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1))
  const currentMonthOrders = input.orders.filter((order) => monthKey(new Date(order.createdAt)) === currentMonthKey)
  const previousMonthOrders = input.orders.filter((order) => monthKey(new Date(order.createdAt)) === previousMonthKey)
  const currentSpend = currentMonthOrders.reduce((total, order) => total + order.totalAmount, 0)
  const previousSpend = previousMonthOrders.reduce((total, order) => total + order.totalAmount, 0)
  const trend = previousSpend ? ((currentSpend - previousSpend) / previousSpend) * 100 : 0
  const activeRfqs = input.rfqs.filter((rfq) => rfq.status === "open")
  const quoteCount = activeRfqs.reduce((total, rfq) => total + rfq.bids.length, 0)
  const progressStatuses = new Set(["pending", "confirmed", "processing", "shipped"])
  const ordersInProgress = input.orders.filter((order) => progressStatuses.has(order.status))
  const deliveredThisMonth = currentMonthOrders.filter((order) => order.status === "delivered").length
  const activeVehicles = input.vehicles.filter((vehicle) => vehicle.status === "active").length
  const maintenanceVehicles = input.vehicles.filter((vehicle) => vehicle.status === "maintenance").length
  const perVehicle = input.vehicles.length ? currentSpend / input.vehicles.length : 0
  const previousPerVehicle = input.vehicles.length ? previousSpend / input.vehicles.length : 0
  const perVehicleTrend = previousPerVehicle ? ((perVehicle - previousPerVehicle) / previousPerVehicle) * 100 : 0
  const allBids = input.rfqs.flatMap((rfq) => rfq.bids)
  const avgDelivery = allBids.length
    ? allBids.reduce((total, bid) => total + bid.deliveryDays, 0) / allBids.length
    : 0
  const suppliers = buildFleetSuppliers(input)

  const kpis: DashboardKpi[] = [
    {
      title: "Monthly Spend",
      value: currency(currentSpend),
      subtext: previousSpend
        ? `${trend <= 0 ? "↓" : "↑"} ${Math.abs(trend).toFixed(1)}% vs last month`
        : `${currentMonthOrders.length} order${currentMonthOrders.length === 1 ? "" : "s"} this month`,
      iconKey: "banknote",
    },
    {
      title: "Active RFQs",
      value: String(activeRfqs.length),
      subtext: `${quoteCount} quote${quoteCount === 1 ? "" : "s"} received`,
      iconKey: "fileText",
    },
    {
      title: "Orders in Progress",
      value: String(ordersInProgress.length),
      subtext: `${deliveredThisMonth} delivered this month`,
      iconKey: "shoppingCart",
    },
    {
      title: "Total Vehicles",
      value: String(input.vehicles.length),
      subtext: `${activeVehicles} active, ${maintenanceVehicles} maintenance`,
      iconKey: "truck",
    },
  ]

  const summaries: DashboardSummary[] = [
    {
      title: "Cost Per Vehicle",
      value: currency(Math.round(perVehicle)),
      subtext: previousPerVehicle
        ? `${perVehicleTrend <= 0 ? "↓" : "↑"} ${Math.abs(perVehicleTrend).toFixed(1)}% this month`
        : "Based on current month spend",
      iconKey: "trendingDown",
      subtextClass: perVehicleTrend <= 0 ? "text-[#DC2626]" : "text-yellow-500",
    },
    {
      title: "Avg Parts Delivery",
      value: avgDelivery ? `${avgDelivery.toFixed(1)} days` : "-",
      subtext: avgDelivery ? "Based on supplier quotes" : "No quote ETAs yet",
      iconKey: "barChart",
      subtextClass: "text-[#9CA3AF]",
    },
    {
      title: "Maintenance Due",
      value: `${maintenanceVehicles} vehicle${maintenanceVehicles === 1 ? "" : "s"}`,
      subtext: "Currently in maintenance",
      iconKey: "truck",
      subtextClass: maintenanceVehicles ? "text-yellow-500" : "text-[#9CA3AF]",
    },
  ]

  const rfqs = [...activeRfqs]
    .sort((a, b) => {
      const aDays = daysUntil(a.responseDeadline) ?? 9999
      const bDays = daysUntil(b.responseDeadline) ?? 9999
      return aDays - bDays || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
    .slice(0, 5)
    .map((rfq) => ({
      id: rfq.publicId || rfq.id,
      vehicles: vehicleLabel(rfq),
      parts: rfq.parts.map((part) => part.partName).slice(0, 2).join(", ") || "Parts request",
      quotes: `${rfq.bids.length} received`,
      status: rfq.order ? "Accepted" : statusLabel(rfq.status === "open" ? "Active" : rfq.status),
      expires: deadlineLabel(rfq),
    }))

  const orders = [...input.orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
    .map((order) => ({
      id: order.publicId || order.id,
      supplier: supplierName(order.supplier),
      items: (() => {
        const totalQuantity = order.items.reduce((total, item) => total + item.quantity, 0)
        return `${totalQuantity} part${totalQuantity === 1 ? "" : "s"}`
      })(),
      vehicles: order.rfq ? vehicleLabel(order.rfq) : order.source === "rfq" ? "RFQ order" : "Direct order",
      amount: currency(order.totalAmount),
      status: statusLabel(order.status),
      date: new Date(order.createdAt).toLocaleDateString("en-AE"),
    }))

  const vehicles = [...input.vehicles]
    .sort((a, b) => Number(Boolean(b.isPrimary)) - Number(Boolean(a.isPrimary)) || statusLabel(a.status).localeCompare(statusLabel(b.status)))
    .slice(0, 5)
    .map((vehicle, index) => {
      const status = statusLabel(vehicle.status)
      return {
        id: vehicle.id || String(index),
        unit: vehicle.vehicleName || `Vehicle ${index + 1}`,
        vehicle: [vehicle.year, vehicle.make, vehicle.model, vehicle.trim].filter(Boolean).join(" ") || vehicle.vin || "Vehicle details pending",
        status,
        mileage: typeof vehicle.mileage === "number" ? vehicle.mileage.toLocaleString("en-AE") : "-",
        maintenance: vehicle.status === "maintenance" ? "In progress" : vehicle.status === "inactive" ? "Inactive" : "No maintenance due",
        maintenanceClass: vehicle.status === "maintenance" ? "text-yellow-500 font-semibold" : "text-[#9CA3AF]",
      }
    })

  return {
    kpis,
    summaries,
    rfqs,
    orders,
    vehicles,
    suppliers: suppliers.slice(0, 3).map((supplier) => ({
      name: supplier.name,
      orders: String(supplier.orders),
      spend: currency(supplier.spent),
      rating: `${supplier.rating.toFixed(1)} / 5.0`,
    })),
  }
}

export function buildFleetSuppliers({ orders, rfqs }: Pick<FleetAnalyticsInput, "orders" | "rfqs">) {
  const supplierMap = new Map<string, {
    supplier: SupplierIdentity
    orders: number
    spent: number
    completedOrders: number
    deliveryDays: number[]
    partTypes: Set<string>
  }>()

  const ensureSupplier = (supplier: SupplierIdentity) => {
    const existing = supplierMap.get(supplier.id)
    if (existing) return existing
    const created = {
      supplier,
      orders: 0,
      spent: 0,
      completedOrders: 0,
      deliveryDays: [] as number[],
      partTypes: new Set<string>(),
    }
    supplierMap.set(supplier.id, created)
    return created
  }

  for (const order of orders) {
    const row = ensureSupplier(order.supplier)
    row.orders += 1
    row.spent += order.totalAmount
    if (["confirmed", "processing", "shipped", "delivered"].includes(order.status)) {
      row.completedOrders += 1
    }
  }

  for (const rfq of rfqs) {
    for (const bid of rfq.bids) {
      const row = ensureSupplier(bid.supplier)
      row.deliveryDays.push(bid.deliveryDays)
      if (bid.partType) row.partTypes.add(bid.partType)
    }
  }

  return Array.from(supplierMap.values())
    .map((row, index): AnalyticsSupplier => {
      const avgDeliveryDays = row.deliveryDays.length
        ? row.deliveryDays.reduce((total, value) => total + value, 0) / row.deliveryDays.length
        : null
      const onTimeRate = row.orders
        ? (row.completedOrders / row.orders) * 100
        : avgDeliveryDays === null
          ? 0
          : avgDeliveryDays <= 3
            ? 96
            : 88
      const rating = Math.min(
        5,
        Math.max(3.5, 3.6 + onTimeRate / 100 + (avgDeliveryDays === null ? 0 : Math.max(0, 4 - avgDeliveryDays) * 0.1)),
      )
      const status = rating >= 4.5 && (row.orders >= 2 || row.spent > 0) ? "Preferred" : "Active"
      return {
        id: row.supplier.id,
        publicId: supplierPublicId(row.supplier, index),
        name: supplierName(row.supplier),
        email: row.supplier.email,
        type: row.partTypes.size ? Array.from(row.partTypes).slice(0, 2).join(", ") : "Parts Supplier",
        rating,
        orders: row.orders,
        spent: row.spent,
        avgDeliveryDays,
        onTimeRate,
        status,
      }
    })
    .sort((a, b) => b.spent - a.spent || b.orders - a.orders || b.rating - a.rating)
}

export function buildSupplierStats(suppliers: AnalyticsSupplier[]): SupplierStat[] {
  const totalSpent = suppliers.reduce((total, supplier) => total + supplier.spent, 0)
  const avgRating = suppliers.length
    ? suppliers.reduce((total, supplier) => total + supplier.rating, 0) / suppliers.length
    : 0

  return [
    { title: "Active Suppliers", value: String(suppliers.length), iconKey: "package", iconClass: "text-[#DC2626]" },
    { title: "Total Spent", value: currencyCompact(totalSpent), iconKey: "banknote", iconClass: "text-green-500" },
    { title: "Avg Rating", value: avgRating ? avgRating.toFixed(1) : "-", iconKey: "star", iconClass: "text-yellow-500" },
    { title: "Preferred Suppliers", value: String(suppliers.filter((supplier) => supplier.status === "Preferred").length), iconKey: "award", iconClass: "text-[#DC2626]" },
  ]
}

export function buildSupplierHighlights(suppliers: AnalyticsSupplier[]): SupplierHighlight[] {
  const fallback = suppliers[0] ?? null
  const topPerformer = [...suppliers].sort((a, b) => b.rating - a.rating)[0] ?? fallback
  const fastest = [...suppliers]
    .filter((supplier) => supplier.avgDeliveryDays !== null)
    .sort((a, b) => (a.avgDeliveryDays ?? 999) - (b.avgDeliveryDays ?? 999))[0] ?? fallback
  const highestVolume = [...suppliers].sort((a, b) => b.spent - a.spent)[0] ?? fallback

  return [
    {
      title: "Top Performer",
      iconKey: "trending",
      iconClass: "text-green-500",
      name: topPerformer?.name ?? "No supplier activity",
      rating: topPerformer ? `${topPerformer.rating.toFixed(1)} rating` : "No rating yet",
      meta: topPerformer ? `${percent(topPerformer.onTimeRate)} on-time score` : "Quotes and orders will appear here",
      stars: topPerformer ? Math.max(1, Math.round(topPerformer.rating)) : undefined,
    },
    {
      title: "Fastest Delivery",
      iconKey: "clock",
      iconClass: "text-blue-500",
      name: fastest?.name ?? "No supplier activity",
      rating: fastest?.avgDeliveryDays ? `Average: ${fastest.avgDeliveryDays.toFixed(1)} days` : "No quote ETA yet",
      meta: fastest ? `${fastest.orders} orders completed` : "Supplier quote ETAs will appear here",
    },
    {
      title: "Highest Volume",
      iconKey: "banknote",
      iconClass: "text-green-500",
      name: highestVolume?.name ?? "No supplier activity",
      rating: highestVolume ? `${currencyCompact(highestVolume.spent)} total spent` : "No spend yet",
      meta: highestVolume ? `${highestVolume.orders} orders placed` : "Accepted orders will appear here",
    },
  ]
}

export function buildFleetReportData(input: FleetAnalyticsInput): FleetReportData {
  const suppliers = buildFleetSuppliers(input)
  const months = lastMonths(6)
  const monthTotals = new Map(months.map((month) => [month.key, 0]))
  const monthOrders = new Map(months.map((month) => [month.key, 0]))

  for (const order of input.orders) {
    const key = monthKey(new Date(order.createdAt))
    if (!monthTotals.has(key)) continue
    monthTotals.set(key, (monthTotals.get(key) ?? 0) + order.totalAmount)
    monthOrders.set(key, (monthOrders.get(key) ?? 0) + 1)
  }

  const totalSpending = Array.from(monthTotals.values()).reduce((total, value) => total + value, 0)
  const totalOrders = Array.from(monthOrders.values()).reduce((total, value) => total + value, 0)
  const avgMonthly = totalSpending / Math.max(1, months.length)
  const budget = Math.max(10_000, Math.ceil(avgMonthly / 5000) * 5000)
  const allBids = input.rfqs.flatMap((rfq) => rfq.bids)
  const avgDelivery = allBids.length
    ? allBids.reduce((total, bid) => total + bid.deliveryDays, 0) / allBids.length
    : 0
  const savings = input.rfqs.reduce((total, rfq) => {
    if (rfq.bids.length < 2) return total
    const amounts = rfq.bids.map((bid) => bid.totalAmount)
    return total + Math.max(...amounts) - Math.min(...amounts)
  }, 0)

  const spendingTrend = months.map((month) => ({
    month: month.label,
    actual: Math.round(monthTotals.get(month.key) ?? 0),
    budget,
  }))

  const deliveryData = Array.from({ length: 4 }, (_, index) => {
    const end = new Date()
    end.setDate(end.getDate() - (3 - index) * 7)
    const start = new Date(end)
    start.setDate(end.getDate() - 6)
    const weekBids = allBids.filter((bid) => {
      const created = new Date(bid.createdAt)
      return created >= start && created <= end
    })
    const onTimeCount = weekBids.filter((bid) => bid.deliveryDays <= 3).length
    const total = weekBids.length || 1
    const onTime = Math.round((onTimeCount / total) * 100)
    return { week: `Week ${index + 1}`, onTime, delayed: 100 - onTime }
  })

  const categoryTotals = new Map<string, number>()
  for (const order of input.orders) {
    for (const item of order.items) {
      const category = categoryForPart(item.partName)
      categoryTotals.set(category, (categoryTotals.get(category) ?? 0) + (item.lineTotal ?? 0))
    }
  }
  if (!categoryTotals.size) {
    for (const rfq of input.rfqs) {
      for (const part of rfq.parts) {
        const category = categoryForPart(part.partName)
        categoryTotals.set(category, (categoryTotals.get(category) ?? 0) + part.quantity)
      }
    }
  }
  const categoryTotal = Array.from(categoryTotals.values()).reduce((total, value) => total + value, 0)
  const categoryDistribution = Array.from(categoryTotals, ([name, value]) => ({
    name,
    value: categoryTotal ? Math.round((value / categoryTotal) * 100) : 0,
    color: categoryColors[name] ?? categoryColors.Other,
  })).sort((a, b) => b.value - a.value)

  const supplierSpendTotal = suppliers.reduce((total, supplier) => total + supplier.spent, 0)
  const supplierSpend = suppliers.slice(0, 6).map((supplier) => ({
    name: supplier.name,
    orders: supplier.orders,
    spent: currencyCompact(supplier.spent),
    spentAmount: supplier.spent,
    avgOrder: supplier.orders ? currency(Math.round(supplier.spent / supplier.orders)) : "AED 0",
    share: supplierSpendTotal ? (supplier.spent / supplierSpendTotal) * 100 : 0,
  }))

  const previous = spendingTrend.at(-2)?.actual ?? 0
  const current = spendingTrend.at(-1)?.actual ?? 0
  const trend = previous ? ((current - previous) / previous) * 100 : 0

  return {
    generatedAt: new Date().toISOString(),
    stats: [
      {
        title: "Total Spending (6mo)",
        value: currencyCompact(totalSpending),
        iconKey: "banknote",
        iconClass: "text-green-500",
        footerType: trend >= 0 ? "trend-up" : "trend-down",
        footerValue: `${Math.abs(trend).toFixed(1)}%`,
        footerLabel: trend >= 0 ? "vs last month" : "lower vs last month",
      },
      {
        title: "Avg Monthly Orders",
        value: String(Math.round(totalOrders / Math.max(1, months.length))),
        iconKey: "package",
        iconClass: "text-[#DC2626]",
        footerType: "text",
        footerLabel: `${totalOrders} orders total`,
      },
      {
        title: "Avg Delivery Time",
        value: avgDelivery ? `${avgDelivery.toFixed(1)} days` : "-",
        iconKey: "clock",
        iconClass: "text-blue-500",
        footerType: "trend-down",
        footerLabel: avgDelivery ? "Based on supplier quotes" : "No quote ETAs yet",
      },
      {
        title: "Cost Savings",
        value: currencyCompact(savings),
        iconKey: "alert",
        iconClass: "text-yellow-500",
        footerType: "text",
        footerLabel: "Lowest vs highest RFQ bids",
      },
    ],
    spendingTrend,
    deliveryData,
    categoryDistribution: categoryDistribution.length
      ? categoryDistribution
      : [{ name: "No activity", value: 100, color: "#6B7280" }],
    supplierSpend,
  }
}
