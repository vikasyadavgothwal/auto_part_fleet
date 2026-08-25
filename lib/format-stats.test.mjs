import assert from "node:assert/strict"
import test from "node:test"

import { formatCompactCurrency, formatCompactNumber } from "./format-stats.ts"

test("formats dashboard stats as k, million, and billion", () => {
  assert.equal(formatCompactNumber(999), "999")
  assert.equal(formatCompactNumber(1_500), "1.5k")
  assert.equal(formatCompactNumber(2_000_000), "2 million")
  assert.equal(formatCompactNumber(3_250_000_000), "3.3 billion")
  assert.equal(formatCompactCurrency(1_200_000), "AED 1.2 million")
})
