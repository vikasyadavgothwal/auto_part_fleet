"use client"

import { useEffect, useState } from "react"
import { MapPin, Pencil, Plus, Save, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/toast-provider"
import { authenticatedFetch } from "@/lib/auth/client"
import {
  emptyAddressForm,
  formFromAddress,
  payloadFromAddressForm,
  type FleetAddressFormValues,
  type FleetAddressRecord,
} from "@/lib/fleet-addresses"
import { appPath } from "@/lib/routes"

type AddressesPayload = {
  ok: boolean
  addresses?: FleetAddressRecord[]
  address?: FleetAddressRecord
  message?: string
}

const validateAddressForm = (values: FleetAddressFormValues) => {
  if (values.label.trim().length > 100 || values.recipientName.trim().length > 120) return "Address label must be 100 characters and recipient name 120 characters or fewer"
  if (!values.label.trim()) return "Address label is required"
  if (!values.recipientName.trim()) return "Recipient name is required"
  if (!values.phone.trim()) return "Phone number is required"
  if (!/^\+?[0-9][0-9\s()-]{6,24}$/.test(values.phone.trim())) {
    return "Enter a valid phone number"
  }
  if (!values.addressLine1.trim()) return "Address line 1 is required"
  if (values.addressLine1.trim().length > 180 || values.addressLine2.trim().length > 180 || values.landmark.trim().length > 120) return "Address fields exceed their allowed length"
  if (!values.city.trim()) return "City is required"
  if (!values.state.trim()) return "State is required"
  if (!values.country.trim()) return "Country is required"
  return ""
}

const RequiredAsterisk = () => <span className="text-red-500">*</span>

const sanitizePhoneInput = (value: string) =>
  value
    .replace(/[^\d+]/g, "")
    .replace(/(?!^)\+/g, "")
    .slice(0, 25)

const allowPhoneKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    event.key.length > 1
  ) {
    return
  }
  if (!/[\d+]/.test(event.key)) event.preventDefault()
  if (event.key === "+" && event.currentTarget.selectionStart !== 0) {
    event.preventDefault()
  }
}

const addressSummary = (address: FleetAddressRecord) =>
  [
    address.addressLine1,
    address.addressLine2,
    address.landmark,
    address.city,
    address.state,
    address.country,
  ]
    .filter(Boolean)
    .join(", ")

export function FleetSavedAddressesManager() {
  const { showToast } = useToast()
  const [addresses, setAddresses] = useState<FleetAddressRecord[]>([])
  const [addressForm, setAddressForm] =
    useState<FleetAddressFormValues>(emptyAddressForm)
  const [editingAddress, setEditingAddress] =
    useState<FleetAddressRecord | null>(null)
  const [editAddressForm, setEditAddressForm] =
    useState<FleetAddressFormValues>(emptyAddressForm)
  const [addressPendingDelete, setAddressPendingDelete] =
    useState<FleetAddressRecord | null>(null)
  const [addressError, setAddressError] = useState("")
  const [editAddressError, setEditAddressError] = useState("")
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true)
  const [isSavingAddress, setIsSavingAddress] = useState(false)
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false)
  const [deletingAddressId, setDeletingAddressId] = useState("")
  const [defaultingAddressId, setDefaultingAddressId] = useState("")

  useEffect(() => {
    let mounted = true
    authenticatedFetch(appPath("/api/addresses"), {
      method: "GET",
      cache: "no-store",
    })
      .then(async (response) => {
        const payload = (await response.json()) as AddressesPayload
        if (!response.ok || !payload.ok) {
          throw new Error(payload.message || "Unable to load addresses")
        }
        if (mounted) setAddresses(payload.addresses ?? [])
      })
      .catch((loadError) => {
        if (mounted) {
          setAddressError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load addresses",
          )
          showToast({
            type: "error",
            title: "Unable to load addresses",
            message:
              loadError instanceof Error
                ? loadError.message
                : "Unable to load addresses",
          })
        }
      })
      .finally(() => {
        if (mounted) setIsLoadingAddresses(false)
      })

    return () => {
      mounted = false
    }
  }, [showToast])

  const setAddressField = <Key extends keyof FleetAddressFormValues>(
    key: Key,
    value: FleetAddressFormValues[Key],
  ) => {
    setAddressForm((current) => ({ ...current, [key]: value }))
    setAddressError("")
  }

  const setEditAddressField = <Key extends keyof FleetAddressFormValues>(
    key: Key,
    value: FleetAddressFormValues[Key],
  ) => {
    setEditAddressForm((current) => ({ ...current, [key]: value }))
    setEditAddressError("")
  }

  const openEditAddress = (address: FleetAddressRecord) => {
    setEditingAddress(address)
    setEditAddressForm(formFromAddress(address))
    setEditAddressError("")
    setAddressError("")
  }

  const closeEditAddress = () => {
    if (isUpdatingAddress) return
    setEditingAddress(null)
    setEditAddressForm(emptyAddressForm)
    setEditAddressError("")
  }

  const closeDeleteAddressDialog = () => {
    if (deletingAddressId) return
    setAddressPendingDelete(null)
  }

  const saveAddress = async () => {
    setAddressError("")
    const validationError = validateAddressForm(addressForm)
    if (validationError) {
      setAddressError(validationError)
      showToast({ type: "error", title: "Check address", message: validationError })
      return
    }

    setIsSavingAddress(true)
    try {
      const response = await authenticatedFetch(appPath("/api/addresses"), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payloadFromAddressForm(addressForm)),
      })
      const payload = (await response.json()) as AddressesPayload
      if (!response.ok || !payload.ok || !payload.address) {
        throw new Error(payload.message || "Unable to save address")
      }
      setAddresses((current) => {
        const existing = payload.address?.isDefault
          ? current.map((address) => ({ ...address, isDefault: false }))
          : current
        return [payload.address as FleetAddressRecord, ...existing]
      })
      setAddressForm(emptyAddressForm)
      showToast({ type: "success", title: "Address saved", message: `${payload.address.label} saved successfully.` })
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "Unable to save address"
      setAddressError(message)
      showToast({ type: "error", title: "Unable to save address", message })
    } finally {
      setIsSavingAddress(false)
    }
  }

  const updateAddress = async () => {
    if (!editingAddress) return
    setEditAddressError("")
    const validationError = validateAddressForm(editAddressForm)
    if (validationError) {
      setEditAddressError(validationError)
      showToast({ type: "error", title: "Check address", message: validationError })
      return
    }

    setIsUpdatingAddress(true)
    try {
      const response = await authenticatedFetch(
        appPath(`/api/addresses/${encodeURIComponent(editingAddress.id)}`),
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payloadFromAddressForm(editAddressForm)),
        },
      )
      const payload = (await response.json()) as AddressesPayload
      if (!response.ok || !payload.ok || !payload.address) {
        throw new Error(payload.message || "Unable to update address")
      }
      setAddresses((current) =>
        current.map((item) =>
          item.id === payload.address?.id
            ? payload.address
            : payload.address?.isDefault
              ? { ...item, isDefault: false }
              : item,
        ),
      )
      setEditingAddress(null)
      setEditAddressForm(emptyAddressForm)
      showToast({ type: "success", title: "Address updated", message: `${payload.address.label} updated successfully.` })
    } catch (updateError) {
      const message = updateError instanceof Error
        ? updateError.message
        : "Unable to update address"
      setEditAddressError(message)
      showToast({ type: "error", title: "Unable to update address", message })
    } finally {
      setIsUpdatingAddress(false)
    }
  }

  const setDefaultAddress = async (address: FleetAddressRecord) => {
    if (address.isDefault) return
    setAddressError("")
    setDefaultingAddressId(address.id)
    try {
      const response = await authenticatedFetch(
        appPath(`/api/addresses/${encodeURIComponent(address.id)}`),
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(
            payloadFromAddressForm({
              ...formFromAddress(address),
              isDefault: true,
            }),
          ),
        },
      )
      const payload = (await response.json()) as AddressesPayload
      if (!response.ok || !payload.ok || !payload.address) {
        throw new Error(payload.message || "Unable to update address")
      }
      setAddresses((current) =>
        current.map((item) =>
          item.id === payload.address?.id
            ? payload.address
            : { ...item, isDefault: false },
        ),
      )
      showToast({ type: "success", title: "Default address updated", message: `${payload.address.label} is now the default address.` })
    } catch (updateError) {
      const message = updateError instanceof Error
        ? updateError.message
        : "Unable to update address"
      setAddressError(message)
      showToast({ type: "error", title: "Unable to update address", message })
    } finally {
      setDefaultingAddressId("")
    }
  }

  const deleteAddress = async (addressId: string) => {
    setAddressError("")
    setDeletingAddressId(addressId)
    try {
      const response = await authenticatedFetch(
        appPath(`/api/addresses/${encodeURIComponent(addressId)}`),
        { method: "DELETE" },
      )
      const payload = (await response.json()) as AddressesPayload
      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || "Unable to delete address")
      }
      setAddresses((current) => current.filter((item) => item.id !== addressId))
      setAddressPendingDelete(null)
      showToast({ type: "success", title: "Address deleted", message: "Delivery address deleted successfully." })
    } catch (deleteError) {
      const message = deleteError instanceof Error
        ? deleteError.message
        : "Unable to delete address"
      setAddressError(message)
      showToast({ type: "error", title: "Unable to delete address", message })
    } finally {
      setDeletingAddressId("")
    }
  }

  return (
    <>
      <Card className="rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <MapPin className="size-5 text-[#DC2626]" />
            Saved Delivery Addresses
          </CardTitle>
          <p className="text-sm text-[#9CA3AF]">
            Fleet orders require one saved delivery address before accepting a
            supplier bid.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {addressError ? (
            <p
              role="alert"
              className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
            >
              {addressError}
            </p>
          ) : null}

          {isLoadingAddresses ? (
            <p className="text-sm text-[#9CA3AF]">Loading addresses...</p>
          ) : addresses.length ? (
            <div className="grid gap-3 lg:grid-cols-2">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="min-w-0 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-4"
                >
                  <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="break-words font-semibold text-white">
                          {address.label}
                        </p>
                        {address.isDefault ? (
                          <Badge className="bg-green-500/10 text-green-400">
                            Default
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 break-words text-sm text-[#E5E7EB]">
                        {address.recipientName} | {address.phone}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEditAddress(address)}
                        className="gap-2"
                      >
                        <Pencil className="size-4" />
                        Change
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setDefaultAddress(address)}
                        disabled={
                          address.isDefault || defaultingAddressId === address.id
                        }
                      >
                        {defaultingAddressId === address.id
                          ? "Saving..."
                          : "Default"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setAddressPendingDelete(address)
                          setAddressError("")
                        }}
                        disabled={deletingAddressId === address.id}
                        aria-label="Delete address"
                      >
                        <Trash2 className="size-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                  <p className="break-words text-sm leading-6 text-[#9CA3AF]">
                    {addressSummary(address)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-4 text-sm text-[#9CA3AF]">
              No saved delivery addresses yet.
            </p>
          )}

          <div className="grid gap-6 rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-4 md:grid-cols-2">
            <AddressFields
              prefix="fleet-delivery"
              values={addressForm}
              onChange={setAddressField}
              inputClassName="h-11 border-[#2A2A2A] bg-[#111111]"
            />
            <div className="md:col-span-2">
              <Button
                type="button"
                onClick={saveAddress}
                disabled={isSavingAddress}
                className="gap-2 bg-[#DC2626] text-white hover:bg-[#B91C1C]"
              >
                <Plus className="size-4" />
                {isSavingAddress ? "Saving..." : "Add Delivery Address"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(editingAddress)}
        onOpenChange={(open) => {
          if (!open) closeEditAddress()
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-[calc(100%-2rem)] overflow-y-auto border border-[#2A2A2A] bg-[#1A1A1A] p-0 text-white sm:max-w-2xl">
          <DialogHeader className="border-b border-[#2A2A2A] px-6 py-5">
            <DialogTitle>Change Delivery Address</DialogTitle>
            <DialogDescription>
              Update the saved address used for Fleet order delivery.
            </DialogDescription>
          </DialogHeader>

          <form
            className="grid gap-6 px-6 py-5 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault()
              updateAddress()
            }}
          >
            {editAddressError ? (
              <p
                role="alert"
                className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400 md:col-span-2"
              >
                {editAddressError}
              </p>
            ) : null}
            <AddressFields
              prefix="edit-fleet-delivery"
              values={editAddressForm}
              onChange={setEditAddressField}
              inputClassName="h-11 border-[#2A2A2A] bg-[#0A0A0A]"
            />
            <DialogFooter className="md:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeEditAddress}
                disabled={isUpdatingAddress}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdatingAddress}
                className="gap-2 bg-[#DC2626] text-white hover:bg-[#B91C1C]"
              >
                <Save className="size-4" />
                {isUpdatingAddress ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(addressPendingDelete)}
        onOpenChange={(open) => {
          if (!open) closeDeleteAddressDialog()
        }}
      >
        <DialogContent className="border border-[#2A2A2A] bg-[#1A1A1A] text-white">
          <DialogHeader>
            <DialogTitle>Delete Delivery Address</DialogTitle>
            <DialogDescription>
              This saved delivery address will be removed from your Fleet
              account.
            </DialogDescription>
          </DialogHeader>

          {addressPendingDelete ? (
            <div className="rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-4 text-sm text-[#D1D5DB]">
              <p className="font-medium text-white">
                {addressPendingDelete.label}
              </p>
              <p className="mt-1 break-words">
                {addressSummary(addressPendingDelete)}
              </p>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={closeDeleteAddressDialog}
              disabled={Boolean(deletingAddressId)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (addressPendingDelete) deleteAddress(addressPendingDelete.id)
              }}
              disabled={Boolean(deletingAddressId)}
              className="gap-2 bg-[#DC2626] text-white hover:bg-[#B91C1C]"
            >
              <Trash2 className="size-4" />
              {deletingAddressId ? "Deleting..." : "Delete Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function AddressFields({
  prefix,
  values,
  onChange,
  inputClassName,
}: {
  prefix: string
  values: FleetAddressFormValues
  onChange: <Key extends keyof FleetAddressFormValues>(
    key: Key,
    value: FleetAddressFormValues[Key],
  ) => void
  inputClassName: string
}) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-label`}>
          Address Label <RequiredAsterisk />
        </Label>
        <Input
          id={`${prefix}-label`}
          value={values.label}
          maxLength={100}
          required
          placeholder="Warehouse"
          onChange={(event) => onChange("label", event.target.value)}
          className={inputClassName}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-recipient`}>
          Recipient Name <RequiredAsterisk />
        </Label>
        <Input
          id={`${prefix}-recipient`}
          value={values.recipientName}
          maxLength={120}
          required
          placeholder="Delivery contact name"
          onChange={(event) => onChange("recipientName", event.target.value)}
          className={inputClassName}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-phone`}>
          Phone <RequiredAsterisk />
        </Label>
        <Input
          id={`${prefix}-phone`}
          value={values.phone}
          maxLength={25}
          required
          type="tel"
          inputMode="tel"
          placeholder="+971501234567"
          onKeyDown={allowPhoneKey}
          onPaste={(event) => {
            event.preventDefault()
            onChange("phone", sanitizePhoneInput(event.clipboardData.getData("text")))
          }}
          onChange={(event) => onChange("phone", sanitizePhoneInput(event.target.value))}
          className={inputClassName}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={`${prefix}-line-1`}>
          Address Line 1 <RequiredAsterisk />
        </Label>
        <Input
          id={`${prefix}-line-1`}
          value={values.addressLine1}
          maxLength={180}
          required
          placeholder="Street address, building, warehouse"
          onChange={(event) => onChange("addressLine1", event.target.value)}
          className={inputClassName}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={`${prefix}-line-2`}>Address Line 2</Label>
        <Input
          id={`${prefix}-line-2`}
          value={values.addressLine2}
          maxLength={180}
          placeholder="Apartment, suite, floor"
          onChange={(event) => onChange("addressLine2", event.target.value)}
          className={inputClassName}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor={`${prefix}-landmark`}>Landmark</Label>
        <Input
          id={`${prefix}-landmark`}
          value={values.landmark}
          maxLength={120}
          placeholder="Nearby landmark"
          onChange={(event) => onChange("landmark", event.target.value)}
          className={inputClassName}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-city`}>
          City <RequiredAsterisk />
        </Label>
        <Input
          id={`${prefix}-city`}
          value={values.city}
          maxLength={80}
          required
          placeholder="Enter city"
          onChange={(event) => onChange("city", event.target.value)}
          className={inputClassName}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-state`}>
          State <RequiredAsterisk />
        </Label>
        <Input
          id={`${prefix}-state`}
          value={values.state}
          maxLength={80}
          required
          placeholder="Enter state or emirate"
          onChange={(event) => onChange("state", event.target.value)}
          className={inputClassName}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${prefix}-country`}>
          Country <RequiredAsterisk />
        </Label>
        <Input
          id={`${prefix}-country`}
          value={values.country}
          maxLength={80}
          required
          placeholder="Enter country"
          onChange={(event) => onChange("country", event.target.value)}
          className={inputClassName}
        />
      </div>
      <label className="flex items-center gap-2 self-end text-sm text-[#9CA3AF]">
        <input
          type="checkbox"
          checked={values.isDefault}
          onChange={(event) => onChange("isDefault", event.target.checked)}
          className="size-4 accent-[#DC2626]"
        />
        Use as default delivery address
      </label>
    </>
  )
}
