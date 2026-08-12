"use client"

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent } from "@/components/ui/card"
import type { SpendingTrendPoint } from "@/lib/fleet-analytics"

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null

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
  )
}

export function MonthlySpendingChart({ data }: { data: SpendingTrendPoint[] }) {
  const avgMonthly = data.length
    ? data.reduce((total, item) => total + item.actual, 0) / data.length
    : 0

  return (
    <Card className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="mb-1 font-semibold text-white">
              Monthly Spending Trend
            </h3>
            <p className="text-sm text-[#9CA3AF]">
              Actual spending vs. calculated budget target
            </p>
          </div>

          <div className="text-right">
            <div className="text-sm text-[#9CA3AF]">Avg Monthly</div>
            <div className="text-xl font-bold text-white">
              AED {Math.round(avgMonthly).toLocaleString("en-AE")}
            </div>
          </div>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
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
  )
}
