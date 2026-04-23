import { Truck } from "lucide-react"

export const vehicleStats = [
  {
    title: "Total Vehicles",
    value: "4",
    icon: Truck,
    valueClass: "text-white",
    withIcon: true,
  },
  {
    title: "Active",
    value: "3",
    valueClass: "text-[#DC2626]",
  },
  {
    title: "In Maintenance",
    value: "1",
    valueClass: "text-yellow-500",
  },
  {
    title: "Avg. Mileage",
    value: "43,870",
    valueClass: "text-white",
  },
]

export const vehicles = [
  {
    id: "VEH-F001",
    name: "2020 Ford F-150",
    vin: "1FTFW1EF8LFC12345",
    mileage: "45,234 mi",
    driver: "John Smith",
    status: "Active",
  },
  {
    id: "VEH-F002",
    name: "2019 Chevrolet Silverado",
    vin: "3GCUKREC5KG123456",
    mileage: "67,890 mi",
    driver: "Mike Johnson",
    status: "Active",
  },
  {
    id: "VEH-F003",
    name: "2021 RAM 1500",
    vin: "1C6SRFFT5MN123456",
    mileage: "23,456 mi",
    driver: "Sarah Williams",
    status: "Maintenance",
  },
  {
    id: "VEH-F004",
    name: "2020 Toyota Tacoma",
    vin: "3TMCZ5AN9LM123456",
    mileage: "38,901 mi",
    driver: "David Brown",
    status: "Active",
  },
]

export const maintenanceDue = [
  {
    title: "2020 Ford F-150",
    description: "Oil change due in 500 miles",
  },
  {
    title: "2019 Chevy Silverado",
    description: "Tire rotation due",
  },
]
