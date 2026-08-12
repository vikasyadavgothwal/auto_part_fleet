export type LiveOrder = {
  id: string
  publicId: string
  source: "rfq" | "direct"
  totalAmount: number
  deliveryProgress: number
  deliveredItemCount: number
  totalItemCount: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "succeeded" | "failed" | "refunded"
  expectedDeliveryAt: string | null
  proofOfDeliveryUrl: string | null
  proofOfDeliveryNote: string | null
  proofRecipientName: string | null
  proofSubmittedAt: string | null
  createdAt: string
  deliveryRecipientName: string | null
  deliveryPhone: string | null
  deliveryAddressLine1: string | null
  deliveryAddressLine2: string | null
  deliveryLandmark: string | null
  deliveryCity: string | null
  deliveryState: string | null
  deliveryPostalCode: string | null
  deliveryCountry: string | null
  buyer: { id: string; companyName: string | null; firstName: string | null; lastName: string | null; email: string | null; activeRole: string }
  supplier: { id: string; supplierPublicId?: string | null; companyName: string | null; firstName: string | null; lastName: string | null; email: string | null }
  items: Array<{
    id: string
    partName: string
    partNumber: string | null
    quantity: number
    unitPrice: number | null
    lineTotal: number | null
    deliveryOption: string | null
    expectedDeliveryAt: string | null
    deliveredAt: string | null
    proofOfDeliveryUrl: string | null
    proofOfDeliveryNote: string | null
    proofRecipientName: string | null
    proofSubmittedAt: string | null
  }>
  rfq: {
    publicId: string
    projectName: string
    deliveryRequirement: string
    paymentTerms: string
    vehicleVin: string | null
    vehicleYear: number | null
    vehicleMake: string | null
    vehicleModel: string | null
    vehicleTrim: string | null
  } | null
}

export type OrderPagination = { page: number; pageSize: number; total: number; totalPages: number }
export type OrderSummary = { totalOrders: number; totalAmount: number; byStatus: Record<string, number> }
