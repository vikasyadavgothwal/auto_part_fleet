"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent } from "@/components/ui/card"

import { deliveryData } from "./reports-data"

export function DeliveryPerformanceChart() {
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
