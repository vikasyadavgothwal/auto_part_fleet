"use client"

import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { FleetReportData } from "@/lib/fleet-analytics"

const escapePdfText = (value: string) =>
  value
    .replace(/[^\x20-\x7E]/g, "?")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")

type PdfCommandBuilder = {
  text: (value: string, x: number, y: number, size?: number, bold?: boolean, color?: string) => void
  rect: (x: number, y: number, width: number, height: number, color: string) => void
  line: (x1: number, y1: number, x2: number, y2: number, color?: string, width?: number) => void
}

const hexToRgb = (hex: string) => {
  const value = hex.replace("#", "")
  return [
    Number.parseInt(value.slice(0, 2), 16) / 255,
    Number.parseInt(value.slice(2, 4), 16) / 255,
    Number.parseInt(value.slice(4, 6), 16) / 255,
  ]
}

const createPdf = (content: string) => {
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
  ]
  let pdf = "%PDF-1.4\n"
  const offsets: number[] = [0]
  objects.forEach((object, index) => {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  })
  const xref = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`
  })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`
  return pdf
}

const buildReportPdf = (report: FleetReportData) => {
  const commands: string[] = []
  const api: PdfCommandBuilder = {
    text(value, x, y, size = 10, bold = false, color = "#111827") {
      const [r, g, b] = hexToRgb(color)
      commands.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg BT /${bold ? "F2" : "F1"} ${size} Tf ${x} ${y} Td (${escapePdfText(value)}) Tj ET`)
    },
    rect(x, y, width, height, color) {
      const [r, g, b] = hexToRgb(color)
      commands.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg ${x} ${y} ${width} ${height} re f`)
    },
    line(x1, y1, x2, y2, color = "#111827", width = 1) {
      const [r, g, b] = hexToRgb(color)
      commands.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S`)
    },
  }

  api.rect(0, 0, 842, 595, "#FFFFFF")
  api.rect(0, 552, 842, 43, "#111827")
  api.text("AutoParts Pro Fleet Analytics Report", 36, 574, 18, true, "#FFFFFF")
  api.text(`Generated ${new Date(report.generatedAt).toLocaleString("en-AE")}`, 610, 574, 9, false, "#FFFFFF")

  report.stats.forEach((stat, index) => {
    const x = 36 + index * 194
    api.rect(x, 487, 178, 48, "#F3F4F6")
    api.text(stat.title, x + 10, 520, 8)
    api.text(stat.value, x + 10, 502, 15, true)
    api.text(stat.footerLabel, x + 10, 491, 7)
  })

  api.text("Monthly Spending Trend", 36, 458, 13, true)
  const chartX = 36
  const chartY = 288
  const chartW = 360
  const chartH = 145
  api.rect(chartX, chartY, chartW, chartH, "#F9FAFB")
  api.line(chartX + 32, chartY + 25, chartX + 32, chartY + chartH - 18, "#9CA3AF")
  api.line(chartX + 32, chartY + 25, chartX + chartW - 18, chartY + 25, "#9CA3AF")
  const maxSpend = Math.max(1, ...report.spendingTrend.flatMap((point) => [point.actual, point.budget]))
  let previousActual: [number, number] | null = null
  let previousBudget: [number, number] | null = null
  report.spendingTrend.forEach((point, index) => {
    const x = chartX + 42 + index * ((chartW - 70) / Math.max(1, report.spendingTrend.length - 1))
    const actualY = chartY + 25 + (point.actual / maxSpend) * (chartH - 50)
    const budgetY = chartY + 25 + (point.budget / maxSpend) * (chartH - 50)
    if (previousActual) api.line(previousActual[0], previousActual[1], x, actualY, "#DC2626", 2)
    if (previousBudget) api.line(previousBudget[0], previousBudget[1], x, budgetY, "#6B7280", 1)
    api.rect(x - 2, actualY - 2, 4, 4, "#DC2626")
    api.text(point.month, x - 8, chartY + 10, 7)
    previousActual = [x, actualY]
    previousBudget = [x, budgetY]
  })
  api.text("Actual", chartX + 270, chartY + chartH - 15, 8)
  api.rect(chartX + 252, chartY + chartH - 13, 10, 3, "#DC2626")
  api.text("Budget", chartX + 320, chartY + chartH - 15, 8)
  api.rect(chartX + 302, chartY + chartH - 13, 10, 3, "#6B7280")

  api.text("Delivery Performance", 446, 458, 13, true)
  const barX = 446
  const barY = 288
  const barW = 340
  const barH = 145
  api.rect(barX, barY, barW, barH, "#F9FAFB")
  report.deliveryData.forEach((point, index) => {
    const x = barX + 36 + index * 76
    const onTimeH = (point.onTime / 100) * 92
    const delayedH = (point.delayed / 100) * 92
    api.rect(x, barY + 28, 22, onTimeH, "#10B981")
    api.rect(x + 28, barY + 28, 22, delayedH, "#DC2626")
    api.text(point.week, x - 4, barY + 12, 7)
    api.text(`${point.onTime}%`, x - 1, barY + 125, 7)
  })
  api.text("Green: on time quote ETA <= 3 days. Red: delayed.", barX + 12, barY + barH - 16, 8)

  api.text("Parts Category Distribution", 36, 252, 13, true)
  report.categoryDistribution.slice(0, 6).forEach((item, index) => {
    const y = 226 - index * 22
    api.text(item.name, 36, y + 3, 8)
    api.rect(170, y, Math.max(4, item.value * 2.2), 10, item.color)
    api.text(`${item.value}%`, 410, y + 2, 8)
  })

  api.text("Supplier Spend", 446, 252, 13, true)
  const maxSupplierSpend = Math.max(1, ...report.supplierSpend.map((supplier) => supplier.spentAmount))
  report.supplierSpend.slice(0, 6).forEach((supplier, index) => {
    const y = 226 - index * 22
    api.text(supplier.name.slice(0, 28), 446, y + 3, 8)
    api.rect(600, y, (supplier.spentAmount / maxSupplierSpend) * 150, 10, "#DC2626")
    api.text(supplier.spent, 760, y + 2, 8)
  })

  api.text("This report is generated from live fleet orders, RFQs, supplier bids, and vehicles.", 36, 36, 9)
  return createPdf(commands.join("\n"))
}

export function ExportReportButton({ report }: { report: FleetReportData }) {
  const exportPdf = () => {
    const pdf = buildReportPdf(report)
    const blob = new Blob([pdf], { type: "application/pdf" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `fleet-report-${new Date().toISOString().slice(0, 10)}.pdf`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <Button
      type="button"
      onClick={exportPdf}
      className="gap-2 bg-[#DC2626] text-white hover:bg-[#B91C1C]"
    >
      <Download className="h-5 w-5" />
      Export Report
    </Button>
  )
}
