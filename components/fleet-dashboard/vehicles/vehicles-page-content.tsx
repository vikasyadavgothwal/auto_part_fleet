"use client"

import { useState, type FormEvent } from "react"
import { EllipsisVertical, Eye, Pencil, Plus, ShoppingCart, Star, Trash2, Truck } from "lucide-react"
import { useRouter } from "next/navigation"

import { PageHeading } from "@/components/fleet-dashboard/shared/page-heading"
import { StatusBadge } from "@/components/fleet-dashboard/shared/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

export function VehiclesPageContent({
  initialVehicles,
  initialPagination,
  initialError,
}: Props) {
  const router = useRouter()
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
      setPageError(error instanceof Error ? error.message : "Unable to load vehicles")
    } finally {
      setPending(false)
    }
  }

  function openCreateDialog() {
    setEditingVehicle(null)
    setDialogError("")
    setVehicleDialogOpen(true)
  }

  function openEditDialog(vehicle: FleetVehicle) {
    setEditingVehicle(vehicle)
    setDialogError("")
    setVehicleDialogOpen(true)
  }

  async function saveVehicle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
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
            vehicleName: data.get("vehicleName"),
            vin: data.get("vin"),
            mileage: data.get("mileage"),
            driver: data.get("driver"),
            status: data.get("status"),
            year: data.get("year"),
            make: data.get("make"),
            model: data.get("model"),
            trim: data.get("trim"),
            isPrimary: data.get("isPrimary") === "on",
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
    } catch (error) {
      setDialogError(error instanceof Error ? error.message : "Unable to save vehicle")
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
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "Unable to delete vehicle")
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
          ["Total Vehicles", pagination.total],
          ["Active on this page", active],
          ["Maintenance", maintenance],
          ["Average mileage", averageMileage.toLocaleString()],
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
          <form key={editingVehicle?.id ?? "create"} className="space-y-5" onSubmit={saveVehicle}>
            <div className="grid gap-4 sm:grid-cols-2">
              {vehicleFields.map(([name, label, type]) => (
                <div key={name} className="space-y-2">
                  <Label htmlFor={name}>{label}</Label>
                  <Input
                    id={name}
                    name={name}
                    type={type}
                    min={type === "number" ? 0 : undefined}
                    defaultValue={editingVehicle?.[name] ?? ""}
                    required={!['driver', 'trim'].includes(name)}
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setVehicleDialogOpen(false)} disabled={pending}>Cancel</Button>
              <Button type="submit" disabled={pending}>{pending ? "Saving..." : editingVehicle ? "Save changes" : "Add vehicle"}</Button>
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
