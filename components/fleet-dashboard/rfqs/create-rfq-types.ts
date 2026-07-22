export type Step = 1 | 2 | 3

export type PartItem = {
  id: number
  vin?: string
  partName: string
  partNumber: string
  quantity: number
  targetPrice: string
  notes: string
}
