const trimDecimal = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "")

export const formatCompactNumber = (value: number) => {
  const amount = Math.abs(value)
  const sign = value < 0 ? "-" : ""
  if (amount >= 1_000_000_000) return `${sign}${trimDecimal(amount / 1_000_000_000)} billion`
  if (amount >= 1_000_000) return `${sign}${trimDecimal(amount / 1_000_000)} million`
  if (amount >= 1_000) return `${sign}${trimDecimal(amount / 1_000)}k`
  return `${value}`
}

export const formatCompactCurrency = (amount: number, currency = "AED") =>
  `${currency} ${formatCompactNumber(Math.round(amount))}`
