export type FleetAddressRecord = {
  id: string
  label: string
  recipientName: string
  phone: string
  addressLine1: string
  addressLine2: string | null
  landmark: string | null
  city: string
  state: string
  country: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export type FleetAddressFormValues = {
  label: string
  recipientName: string
  phone: string
  addressLine1: string
  addressLine2: string
  landmark: string
  city: string
  state: string
  country: string
  isDefault: boolean
}

export const emptyAddressForm: FleetAddressFormValues = {
  label: "Warehouse",
  recipientName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  country: "",
  isDefault: true,
}

export const formFromAddress = (
  address: FleetAddressRecord,
): FleetAddressFormValues => ({
  label: address.label,
  recipientName: address.recipientName,
  phone: address.phone,
  addressLine1: address.addressLine1,
  addressLine2: address.addressLine2 ?? "",
  landmark: address.landmark ?? "",
  city: address.city,
  state: address.state,
  country: address.country,
  isDefault: address.isDefault,
})

export const payloadFromAddressForm = (form: FleetAddressFormValues) => ({
  label: form.label.trim(),
  recipientName: form.recipientName.trim(),
  phone: form.phone.trim(),
  addressLine1: form.addressLine1.trim(),
  addressLine2: form.addressLine2.trim(),
  landmark: form.landmark.trim(),
  city: form.city.trim(),
  state: form.state.trim(),
  country: form.country.trim(),
  isDefault: form.isDefault,
})
