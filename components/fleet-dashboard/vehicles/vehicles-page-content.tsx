"use client"

import { useState, type FormEvent } from "react"
import { EllipsisVertical, Eye, Pencil, Plus, ShoppingCart, Star, Trash2, Truck } from "lucide-react"
import { useRouter } from "next/navigation"

import { PageHeading } from "@/components/fleet-dashboard/shared/page-heading"
import { StatusBadge } from "@/components/fleet-dashboard/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/toast-provider"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authenticatedFetch } from "@/lib/auth/client"
import { formatCompactNumber } from "@/lib/format-stats"
import { appPath, appRoutes } from "@/lib/routes"
import type { FleetVehicle, VehiclePagination, VehiclesResponse } from "./types"

type Props = {
  initialVehicles: FleetVehicle[]
  initialPagination: VehiclePagination
  initialError?: string | null
}

const statusLabel = {
  active: "Active",
  maintenance: "Maintenance",
  inactive: "Inactive",
} as const

const vehicleFields = [
  ["vehicleName", "Vehicle name", "text"],
  ["vin", "VIN", "text"],
  ["mileage", "Mileage", "number"],
  ["driver", "Driver", "text"],
  ["year", "Year", "number"],
  ["make", "Make / Brand", "text"],
  ["model", "Model", "text"],
  ["trim", "Trim", "text"],
] as const

const createVehicleFields = vehicleFields.filter(([name]) => name !== "vin")
const normalizeVin = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 17)
const digitsOnly = (value: string) => value.replace(/\D/g, "")
const currentVehicleYear = new Date().getFullYear() + 1

function cleanText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim().replace(/\s+/g, " ")
}

function validateVehicleForm(data: FormData, isEditing: boolean) {
  const values = {
    vehicleName: cleanText(data.get("vehicleName")).slice(0, 120),
    vin: normalizeVin(cleanText(data.get("vin"))),
    mileage: digitsOnly(cleanText(data.get("mileage"))).slice(0, 7),
    driver: cleanText(data.get("driver")).slice(0, 120),
    status: cleanText(data.get("status")),
    year: digitsOnly(cleanText(data.get("year"))).slice(0, 4),
    make: cleanText(data.get("make")).slice(0, 80),
    model: cleanText(data.get("model")).slice(0, 80),
    trim: cleanText(data.get("trim")).slice(0, 80),
    isPrimary: data.get("isPrimary") === "on",
  }
  const year = Number(values.year)
  const mileage = Number(values.mileage)
  if (!values.vin || !/^[A-HJ-NPR-Z0-9]{17}$/.test(values.vin)) {
    return { error: "VIN must be exactly 17 characters and cannot include I, O, or Q.", values }
  }
  if (!values.vehicleName) return { error: "Vehicle name is required.", values }
  if (!values.year || year < 1886 || year > currentVehicleYear) {
    return { error: `Vehicle year must be between 1886 and ${currentVehicleYear}.`, values }
  }
  if (!values.make) return { error: "Make / Brand is required.", values }
  if (!values.model) return { error: "Model is required.", values }
  if (!values.mileage || !Number.isInteger(mileage) || mileage < 1 || mileage > 70) {
    return { error: "Mileage must be a whole number between 1 and 70.", values }
  }
  if (!["active", "maintenance", "inactive"].includes(values.status)) {
    return { error: "Select a valid vehicle status.", values }
  }
  if (!isEditing && values.vin.length !== 17) {
    return { error: "Complete VIN lookup or enter details manually before saving.", values }
  }
  return { error: "", values }
}

export function VehiclesPageContent({
  initialVehicles,
  initialPagination,
  initialError,
}: Props) {
  const router = useRouter()
  const { showToast } = useToast()
  const [vehicles, setVehicles] = useState(initialVehicles)
  const [pagination, setPagination] = useState(initialPagination)
  const [editingVehicle, setEditingVehicle] = useState<FleetVehicle | null>(null)
  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false)
  const [deleteVehicle, setDeleteVehicle] = useState<FleetVehicle | null>(null)
  const [infoVehicle, setInfoVehicle] = useState<FleetVehicle | null>(null)
  const [pending, setPending] = useState(false)
  const [pageError, setPageError] = useState(initialError ?? "")
  const [dialogError, setDialogError] = useState("")
  const [deleteError, setDeleteError] = useState("")
  const [createVin, setCreateVin] = useState("")
  const [vinLookupPending, setVinLookupPending] = useState(false)
  const [vinLookupMessage, setVinLookupMessage] = useState("")
  const [resolvedVehicle, setResolvedVehicle] = useState<{ year: number; make: string; model: string; vehicleName: string; trim: string } | null>(null)
  const [manualVehicleEntry, setManualVehicleEntry] = useState(false)

  async function loadPage(page: number) {
    setPending(true)
    setPageError("")
    try {
      const response = await authenticatedFetch(
        appPath(`/api/fleet/vehicles?page=${page}&pageSize=${pagination.pageSize}`),
      )
      const payload = (await response.json()) as VehiclesResponse
      if (!response.ok || !payload.ok || !payload.vehicles || !payload.pagination) {
        throw new Error(payload.message ?? "Unable to load vehicles")
      }
      setVehicles(payload.vehicles)
      setPagination(payload.pagination)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load vehicles"
      setPageError(message)
      showToast({ type: "error", title: "Unable to load vehicles", message })
    } finally {
      setPending(false)
    }
  }

  function openCreateDialog() {
    setEditingVehicle(null)
    setDialogError("")
    setCreateVin("")
    setVinLookupMessage("")
    setResolvedVehicle(null)
    setManualVehicleEntry(false)
    setVehicleDialogOpen(true)
  }

  function openEditDialog(vehicle: FleetVehicle) {
    setEditingVehicle(vehicle)
    setDialogError("")
    setVehicleDialogOpen(true)
  }

  async function lookupVin() {
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(createVin)) {
      const message = "VIN must be exactly 17 characters and cannot include I, O, or Q."
      setVinLookupMessage(message)
      showToast({ type: "error", title: "Invalid VIN", message })
      return
    }
    setVinLookupPending(true)
    setVinLookupMessage("")
    try {
      const response = await authenticatedFetch(appPath(`/api/fleet/vehicles/vin-lookup?vin=${encodeURIComponent(createVin)}`))
      const payload = await response.json() as { ok: boolean; found?: boolean; vehicle?: { year: number; make: string; model: string; vehicleName: string; trim: string }; message?: string }
      if (!response.ok || !payload.ok) throw new Error(payload.message ?? "Unable to look up VIN")
      if (payload.found && payload.vehicle) {
        setResolvedVehicle(payload.vehicle)
        setManualVehicleEntry(false)
        const message = "Vehicle found. Year, make and model were filled automatically."
        setVinLookupMessage(message)
        showToast({ type: "success", title: "Vehicle found", message })
      } else {
        setResolvedVehicle(null)
        setManualVehicleEntry(true)
        const message = payload.message ?? "Vehicle details were not found. Check the VIN or enter them manually."
        setVinLookupMessage(message)
        showToast({ type: "error", title: "Vehicle not found", message })
      }
    } catch (error) {
      setResolvedVehicle(null)
      setManualVehicleEntry(true)
      const message = error instanceof Error ? error.message : "Unable to look up VIN"
      setVinLookupMessage(message)
      showToast({ type: "error", title: "Unable to look up VIN", message })
    } finally {
      setVinLookupPending(false)
    }
  }

  async function saveVehicle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const validation = validateVehicleForm(data, Boolean(editingVehicle))
    if (validation.error) {
      setDialogError(validation.error)
      showToast({ type: "error", title: "Check vehicle details", message: validation.error })
      return
    }
    setPending(true)
    setDialogError("")
    try {
      const response = await authenticatedFetch(
        appPath(
          editingVehicle
            ? `/api/fleet/vehicles/${editingVehicle.id}`
            : "/api/fleet/vehicles",
        ),
        {
          method: editingVehicle ? "PATCH" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            vehicleName: validation.values.vehicleName,
            vin: validation.values.vin,
            mileage: validation.values.mileage,
            driver: validation.values.driver,
            status: validation.values.status,
            year: validation.values.year,
            make: validation.values.make,
            model: validation.values.model,
            trim: validation.values.trim,
            isPrimary: validation.values.isPrimary,
          }),
        },
      )
      const payload = (await response.json()) as VehiclesResponse
      if (!response.ok || !payload.ok) {
        throw new Error(payload.message ?? "Unable to save vehicle")
      }
      form.reset()
      setVehicleDialogOpen(false)
      setEditingVehicle(null)
      await loadPage(editingVehicle ? pagination.page : 1)
      showToast({
        type: "success",
        title: editingVehicle ? "Vehicle updated" : "Vehicle added",
        message: `${validation.values.vehicleName} saved successfully.`,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save vehicle"
      setDialogError(message)
      showToast({ type: "error", title: "Unable to save vehicle", message })
      setPending(false)
    }
  }

  async function confirmDelete() {
    if (!deleteVehicle) return
    setPending(true)
    setDeleteError("")
    try {
      const response = await authenticatedFetch(
        appPath(`/api/fleet/vehicles/${deleteVehicle.id}`),
        { method: "DELETE" },
      )
      const payload = (await response.json()) as VehiclesResponse
      if (!response.ok || !payload.ok) {
        throw new Error(payload.message ?? "Unable to delete vehicle")
      }
      setDeleteVehicle(null)
      await loadPage(
        vehicles.length === 1 && pagination.page > 1
          ? pagination.page - 1
          : pagination.page,
      )
      showToast({
        type: "success",
        title: "Vehicle deleted",
        message: `${deleteVehicle.vehicleName} was deleted successfully.`,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to delete vehicle"
      setDeleteError(message)
      showToast({ type: "error", title: "Unable to delete vehicle", message })
      setPending(false)
    }
  }

  const active = vehicles.filter((vehicle) => vehicle.status === "active").length
  const maintenance = vehicles.filter(
    (vehicle) => vehicle.status === "maintenance",
  ).length
  const averageMileage = vehicles.length
    ? Math.round(
        vehicles.reduce((sum, vehicle) => sum + vehicle.mileage, 0) /
          vehicles.length,
      )
    : 0

  return (
    <div className="space-y-8">
      <PageHeading
        title="Fleet Vehicles"
        description="Manage your fleet inventory and assignments."
        action={
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="size-5" /> Add Vehicle
          </Button>
        }
      />

      {pageError ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {pageError}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Total Vehicles", formatCompactNumber(pagination.total)],
          ["Active on this page", formatCompactNumber(active)],
          ["Maintenance", formatCompactNumber(maintenance)],
          ["Average mileage", formatCompactNumber(averageMileage)],
        ].map(([label, value]) => (
          <Card key={label} className="border-[#2A2A2A] bg-[#1A1A1A]">
            <CardContent className="p-6">
              <p className="text-sm text-[#9CA3AF]">{label}</p>
              <p className="mt-2 text-3xl font-bold text-white">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-[#2A2A2A] bg-[#1A1A1A]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#2A2A2A] bg-[#0A0A0A]">
                {['Vehicle', 'VIN', 'Driver', 'Mileage', 'Status', 'Actions'].map((header) => (
                  <th key={header} className="px-5 py-4 text-left text-sm text-[#9CA3AF]">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehicles.length ? (
                vehicles.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b border-[#2A2A2A] hover:bg-[#222]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Truck className="size-5 text-[#DC2626]" />
                        <div>
                          <div className="flex items-center gap-2 font-medium text-white">
                            {vehicle.vehicleName}
                            {vehicle.isPrimary ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-400">
                                <Star className="size-3 fill-current" /> Primary
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 text-xs text-[#9CA3AF]">
                            {vehicle.year} {vehicle.make} {vehicle.model}{vehicle.trim ? ` · ${vehicle.trim}` : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#9CA3AF]">{vehicle.vin}</td>
                    <td className="px-5 py-4 text-sm text-[#9CA3AF]">{vehicle.driver || "Not assigned"}</td>
                    <td className="px-5 py-4 text-sm text-[#9CA3AF]">{vehicle.mileage.toLocaleString()}</td>
                    <td className="px-5 py-4"><StatusBadge status={statusLabel[vehicle.status]} /></td>
                    <td className="px-5 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" aria-label={`Actions for ${vehicle.vehicleName}`}>
                            <EllipsisVertical className="size-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 border border-[#2A2A2A] bg-[#171717] text-white">
                          <DropdownMenuItem onSelect={() => setInfoVehicle(vehicle)} className="gap-2 px-3 py-2"><Eye />View information</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => openEditDialog(vehicle)} className="gap-2 px-3 py-2"><Pencil />Edit vehicle</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => router.push(`${appRoutes.createRfq}?vehicleId=${encodeURIComponent(vehicle.id)}`)} className="gap-2 px-3 py-2"><ShoppingCart />Order parts</DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[#2A2A2A]" />
                          <DropdownMenuItem variant="destructive" onSelect={() => { setDeleteError(""); setDeleteVehicle(vehicle) }} className="gap-2 px-3 py-2"><Trash2 />Delete vehicle</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-[#9CA3AF]">No vehicles added yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[#2A2A2A] p-4">
          <p className="text-sm text-[#9CA3AF]">Page {pagination.page} of {pagination.totalPages} · {pagination.total} vehicles</p>
          <div className="flex gap-2">
            <Button variant="outline" disabled={pending || pagination.page <= 1} onClick={() => loadPage(pagination.page - 1)}>Previous</Button>
            <Button variant="outline" disabled={pending || pagination.page >= pagination.totalPages} onClick={() => loadPage(pagination.page + 1)}>Next</Button>
          </div>
        </div>
      </div>

      <Dialog
        open={vehicleDialogOpen}
        onOpenChange={(open) => {
          if (!pending) {
            setVehicleDialogOpen(open)
            if (!open) setEditingVehicle(null)
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-[#111] text-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingVehicle ? "Edit fleet vehicle" : "Add fleet vehicle"}</DialogTitle>
            <DialogDescription>Vehicle data is stored under the authenticated fleet account.</DialogDescription>
          </DialogHeader>
          {dialogError ? (
            <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{dialogError}</p>
          ) : null}
          <form key={editingVehicle?.id ?? "create"} noValidate className="space-y-5" onSubmit={saveVehicle}>
            {!editingVehicle ? (
              <div className="space-y-3 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-4">
                <Label htmlFor="create-vin">VIN first *</Label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input id="create-vin" name="vin" value={createVin} maxLength={17} placeholder="JT2BF22K6X0123456" className="bg-[#0A0A0A] uppercase" onChange={(event) => { setCreateVin(normalizeVin(event.target.value)); setResolvedVehicle(null); setManualVehicleEntry(false); setVinLookupMessage("") }} />
                  <Button type="button" disabled={vinLookupPending || createVin.length !== 17} onClick={() => void lookupVin()}>{vinLookupPending ? "Searching..." : "Find Vehicle"}</Button>
                </div>
                {vinLookupMessage ? <p className="text-sm text-[#9CA3AF]">{vinLookupMessage}</p> : null}
                {manualVehicleEntry && vinLookupMessage ? <p className="text-xs text-[#9CA3AF]">Enter the vehicle details below to save this VIN manually.</p> : null}
                {!resolvedVehicle && !manualVehicleEntry && vinLookupMessage ? <Button type="button" variant="outline" onClick={() => setManualVehicleEntry(true)}>Enter details manually</Button> : null}
              </div>
            ) : null}
            {editingVehicle || resolvedVehicle || manualVehicleEntry ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {(editingVehicle ? vehicleFields : createVehicleFields).map(([name, label, type]) => (
                <div key={name} className="space-y-2">
                  <Label htmlFor={name}>{["vehicleName", "mileage", "year", "make", "model"].includes(name) ? `${label} *` : label}</Label>
                  <Input
                    id={name}
                    name={name}
                    type={type}
                    min={name === "mileage" ? 1 : type === "number" ? 0 : undefined}
                    max={name === "mileage" ? 70 : name === "year" ? currentVehicleYear : undefined}
                    maxLength={type === "text" ? (name === "vehicleName" || name === "driver" ? 120 : 80) : undefined}
                    defaultValue={editingVehicle?.[name] ?? (name === "year" ? resolvedVehicle?.year : name === "make" ? resolvedVehicle?.make : name === "model" ? resolvedVehicle?.model : name === "vehicleName" ? resolvedVehicle?.vehicleName : name === "trim" ? resolvedVehicle?.trim : "")}
                    readOnly={!editingVehicle && Boolean(resolvedVehicle) && ["year", "make", "model", "vehicleName"].includes(name)}
                    className="bg-[#0A0A0A]"
                  />
                </div>
              ))}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select id="status" name="status" defaultValue={editingVehicle?.status ?? "active"} className="h-10 w-full rounded-md border border-[#2A2A2A] bg-[#0A0A0A] px-3">
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex h-10 w-full cursor-pointer items-center justify-between rounded-md border border-[#2A2A2A] bg-[#0A0A0A] px-3">
                  <span className="text-sm">Primary vehicle</span>
                  <input name="isPrimary" type="checkbox" defaultChecked={editingVehicle?.isPrimary ?? false} role="switch" className="h-5 w-9 accent-[#DC2626]" />
                </label>
              </div>
            </div>
            ) : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setVehicleDialogOpen(false)} disabled={pending}>Cancel</Button>
              <Button type="submit" disabled={pending || vinLookupPending}>{pending ? "Saving..." : editingVehicle ? "Save changes" : "Add vehicle"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={infoVehicle !== null} onOpenChange={(open) => !open && setInfoVehicle(null)}>
        <DialogContent className="border-[#2A2A2A] bg-[#111] text-white sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{infoVehicle?.vehicleName}</DialogTitle>
            <DialogDescription>Complete fleet vehicle information.</DialogDescription>
          </DialogHeader>
          {infoVehicle ? (
            <div className="grid gap-4 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-5 text-sm sm:grid-cols-2">
              <p><span className="text-[#9CA3AF]">VIN:</span><br />{infoVehicle.vin}</p>
              <p><span className="text-[#9CA3AF]">Driver:</span><br />{infoVehicle.driver || "Not assigned"}</p>
              <p><span className="text-[#9CA3AF]">Vehicle:</span><br />{infoVehicle.year} {infoVehicle.make} {infoVehicle.model} {infoVehicle.trim || ""}</p>
              <p><span className="text-[#9CA3AF]">Mileage:</span><br />{infoVehicle.mileage.toLocaleString()}</p>
              <p><span className="text-[#9CA3AF]">Status:</span><br />{statusLabel[infoVehicle.status]}</p>
              <p><span className="text-[#9CA3AF]">Primary:</span><br />{infoVehicle.isPrimary ? "Yes" : "No"}</p>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setInfoVehicle(null)}>Close</Button>
            <Button onClick={() => { const vehicle = infoVehicle; setInfoVehicle(null); if (vehicle) openEditDialog(vehicle) }}>Edit vehicle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteVehicle !== null} onOpenChange={(open) => { if (!open && !pending) setDeleteVehicle(null) }}>
        <DialogContent className="bg-[#111] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete vehicle?</DialogTitle>
            <DialogDescription>This permanently deletes {deleteVehicle?.vehicleName}. Existing RFQs keep their vehicle snapshot.</DialogDescription>
          </DialogHeader>
          {deleteError ? <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">{deleteError}</p> : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteVehicle(null)} disabled={pending}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={pending}>{pending ? "Deleting..." : "Delete vehicle"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
