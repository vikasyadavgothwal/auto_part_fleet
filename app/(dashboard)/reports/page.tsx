"use client";

import {
  AlertCircle,
  Clock,
  DollarSign,
  Download,
  Package,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
    BarChart,
  Bar,

} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    title: "Total Spending (6mo)",
    value: "$301K",
    icon: DollarSign,
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
    value: "$23.5K",
    icon: AlertCircle,
    iconClass: "text-yellow-500",
    footerType: "text",
    footerLabel: "Through bulk RFQs",
  },
];

const spendingTrend = [
  { month: "Jan", actual: 45500, budget: 50000 },
  { month: "Feb", actual: 52200, budget: 50000 },
  { month: "Mar", actual: 48800, budget: 50000 },
  { month: "Apr", actual: 51100, budget: 50000 },
  { month: "May", actual: 49400, budget: 50000 },
  { month: "Jun", actual: 53700, budget: 50000 },
];


const deliveryData = [
  { week: "Week 1", onTime: 95, delayed: 5 },
  { week: "Week 2", onTime: 98, delayed: 2 },
  { week: "Week 3", onTime: 92, delayed: 8 },
  { week: "Week 4", onTime: 97, delayed: 3 },
]


const categoryDistribution = [
  { name: "Engine Parts", value: 35, color: "#DC2626" },
  { name: "Brake System", value: 25, color: "#F59E0B" },
  { name: "Suspension", value: 20, color: "#3B82F6" },
  { name: "Electrical", value: 12, color: "#10B981" },
  { name: "Other", value: 8, color: "#6B7280" },
];


const reportCards = [
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

 function ReportsQuickActions() {
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



const supplierSpend = [
  {
    name: "Premium Parts",
    orders: 156,
    spent: "$245.7K",
    avgOrder: "$1575",
    share: 24.2,
  },
  {
    name: "QuickShip",
    orders: 89,
    spent: "$128.4K",
    avgOrder: "$1443",
    share: 12.7,
  },
  {
    name: "Elite Performance",
    orders: 67,
    spent: "$184.9K",
    avgOrder: "$2760",
    share: 18.2,
  },
  {
    name: "Budget Direct",
    orders: 45,
    spent: "$56.8K",
    avgOrder: "$1262",
    share: 5.6,
  },
];


 function DeliveryPerformanceChart() {
  return (
    <Card className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none">
      <CardContent className="p-6">
        <h3 className="mb-6 font-semibold text-white">
          Delivery Performance (Last 4 Weeks)
        </h3>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deliveryData}>
              <CartesianGrid stroke="#2A2A2A" strokeDasharray="3 3" />

              <XAxis dataKey="week" stroke="#9CA3AF" />

              <YAxis stroke="#9CA3AF" />

              <Tooltip
                contentStyle={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #2A2A2A",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />

              <Legend />

              <Bar
                dataKey="onTime"
                name="On Time %"
                fill="#10B981"
                radius={[6, 6, 0, 0]}
              />

              <Bar
                dataKey="delayed"
                name="Delayed %"
                fill="#DC2626"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}



function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-3 text-white shadow-lg">
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <span style={{ color: entry.color }}>{entry.name}</span>
            <span>{entry.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FleetReportsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-white">
            Fleet Reports & Analytics
          </h1>
          <p className="text-[#9CA3AF]">
            Track spending, performance, and procurement insights.
          </p>
        </div>

        <Button className="gap-2 bg-[#DC2626] text-white hover:bg-[#B91C1C]">
          <Download className="h-5 w-5" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.title}
              className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none"
            >
              <CardContent className="p-6">
                <div className="mb-2 flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${stat.iconClass}`} />
                  <div className="text-sm text-[#9CA3AF]">{stat.title}</div>
                </div>

                <div className="text-3xl font-bold text-white">
                  {stat.value}
                </div>

                {stat.footerType === "trend-up" && (
                  <div className="mt-2 flex items-center gap-1 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">{stat.footerValue}</span>
                    <span className="text-[#9CA3AF]">{stat.footerLabel}</span>
                  </div>
                )}

                {stat.footerType === "trend-down" && (
                  <div className="mt-2 flex items-center gap-1 text-sm">
                    <TrendingDown className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">{stat.footerLabel}</span>
                  </div>
                )}

                {stat.footerType === "text" && (
                  <div className="mt-2 text-sm text-[#9CA3AF]">
                    {stat.footerLabel}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="mb-1 font-semibold text-white">
                Monthly Spending Trend
              </h3>
              <p className="text-sm text-[#9CA3AF]">
                Actual spending vs. budget target
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm text-[#9CA3AF]">Avg Monthly</div>
              <div className="text-xl font-bold text-white">$50.2K</div>
            </div>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={spendingTrend}>
                <CartesianGrid stroke="#2A2A2A" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Actual Spending"
                  stroke="#DC2626"
                  strokeWidth={3}
                  dot={{
                    r: 3,
                    fill: "#fff",
                    stroke: "#DC2626",
                    strokeWidth: 3,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="budget"
                  name="Budget Target"
                  stroke="#9CA3AF"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{
                    r: 3,
                    fill: "#fff",
                    stroke: "#9CA3AF",
                    strokeWidth: 2,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none">
          <CardContent className="p-6">
            <h3 className="mb-6 font-semibold text-white">
              Parts Category Distribution
            </h3>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={60}
                    dataKey="value"
                    label={({ percent }) =>
                      `${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {categoryDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A1A1A",
                      border: "1px solid #2A2A2A",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {categoryDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-[#9CA3AF]">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

<DeliveryPerformanceChart />

      </div>

      <div>
                <Card className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none">
          <CardContent className="p-6">
            <h3 className="mb-6 font-semibold text-white">
              Supplier Spend Distribution
            </h3>

            <div className="overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#0A0A0A]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2A2A2A]">
                      <th className="px-4 py-4 text-left text-sm font-semibold text-[#9CA3AF]">
                        Supplier
                      </th>
                      <th className="px-4 py-4 text-right text-sm font-semibold text-[#9CA3AF]">
                        Total orders
                      </th>
                      <th className="px-4 py-4 text-right text-sm font-semibold text-[#9CA3AF]">
                        Total value
                      </th>
                      <th className="px-4 py-4 text-right text-sm font-semibold text-[#9CA3AF]">
                        Avg Order Value
                      </th>
                      <th className="px-4 py-4 text-right text-sm font-semibold text-[#9CA3AF]">
                        % of value
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {supplierSpend.map((supplier) => (
                      <tr
                        key={supplier.name}
                        className="border-b border-[#2A2A2A] transition-colors hover:bg-[#0A0A0A]"
                      >
                        <td className="px-4 py-4 font-medium text-white">
                          {supplier.name}
                        </td>
                        <td className="px-4 py-4 text-right text-white">
                          {supplier.orders}
                        </td>
                        <td className="px-4 py-4 text-right text-white">
                          {supplier.spent}
                        </td>
                        <td className="px-4 py-4 text-right text-[#9CA3AF]">
                          {supplier.avgOrder}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="h-2 w-20 rounded-full bg-[#0A0A0A]">
                              <div
                                className="h-2 rounded-full bg-[#DC2626]"
                                style={{ width: `${supplier.share}%` }}
                              />
                            </div>
                            <span className="w-12 text-right text-white">
                              {supplier.share.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


<ReportsQuickActions />









    </div>
  );
}
