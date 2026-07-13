export type FleetVehicleStatus = "active" | "maintenance" | "inactive"

export type FleetVehicle = {
  id: string
  vehicleName: string
  vin: string
  mileage: number
  driver: string | null
  status: FleetVehicleStatus
  year: number
  make: string
  model: string
  trim: string | null
  isPrimary: boolean
  createdAt: string
  updatedAt: string
}

export type VehiclePagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export type VehiclesResponse = {
  ok: boolean
  vehicles?: FleetVehicle[]
  vehicle?: FleetVehicle
  pagination?: VehiclePagination
  message?: string
}
