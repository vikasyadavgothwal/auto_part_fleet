"use client"

import { useMemo, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Pencil, Search, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/toast-provider"
import {
  canCreateRoles,
  toDisplayName,
  type BusinessAccessEntry,
  type PermissionsResponse,
  type RolesResponse,
} from "./types"

type PermissionItem = {
  id: string
  name: string
  code: string
  description: string | null
}

type RoleItem = {
  id: string
  name: string
  description: string | null
  isOwnerRole: boolean
  permissionIds: string[]
}

function statusText(access: BusinessAccessEntry | undefined) {
  const action = access?.actions?.["roles.create"]
  if (action && action.allowed === false) {
    return action.reason || "Role creation unavailable on this plan."
  }
  if (access && !access.actions?.["roles.create"]?.allowed) {
    return "You do not have permission to manage roles."
  }
  return null
}

function permissionNames(permissionIds: string[], permissions: PermissionItem[]) {
  const map = new Map(permissions.map((item) => [item.id, item]))
  return permissionIds
    .map((id) => map.get(id)?.name ?? "Permission")
    .slice(0, 6)
    .join(", ")
}

function selectedPermissionLabel(
  selectedPermissionIds: string[],
  permissions: PermissionItem[],
) {
  if (selectedPermissionIds.length === 0) {
    return "Select permissions"
  }

  const map = new Map(permissions.map((item) => [item.id, item]))
  const selectedNames = selectedPermissionIds
    .map((id) => map.get(id)?.name ?? "Permission")
    .filter(Boolean)
  const extraCount = Math.max(selectedNames.length - 3, 0)
  const visibleNames = selectedNames.slice(0, 3)
  return extraCount > 0
    ? `${visibleNames.join(", ")} +${extraCount} more`
    : visibleNames.join(", ")
}

function selectedPermissionNames(
  selectedPermissionIds: string[],
  permissions: PermissionItem[],
) {
  const map = new Map(permissions.map((item) => [item.id, item]))
  return selectedPermissionIds.map((id) => map.get(id)?.name ?? "Permission")
}

export function FleetRolesPage({
  access,
  rolesPayload,
  permissionsPayload,
}: {
  access: BusinessAccessEntry | undefined
  rolesPayload: RolesResponse
  permissionsPayload: PermissionsResponse
}) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [permissionQuery, setPermissionQuery] = useState("")
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null)
  const [deletingRole, setDeletingRole] = useState<RoleItem | null>(null)
  const router = useRouter()
  const { showToast } = useToast()

  const canCreate = canCreateRoles(access)
  const canMutateRoles = canCreate
  const roleMessage = statusText(access)
  const roles = useMemo<RoleItem[]>(() => rolesPayload.roles ?? [], [rolesPayload.roles])
  const permissions = useMemo<PermissionItem[]>(
    () =>
      (permissionsPayload.permissions ?? []).map((item) => ({
        id: item.id,
        name: item.name,
        code: item.code,
        description: item.description,
      })),
    [permissionsPayload.permissions],
  )

  const filteredRoles = useMemo(
    () =>
      roles.filter((role) => {
        const q = searchQuery.trim().toLowerCase()
        if (!q) return true
        const rolePermissions = permissionNames(role.permissionIds, permissions)
        const haystack = `${role.name} ${toDisplayName(role.description)} ${rolePermissions} ${role.isOwnerRole ? "owner" : ""}`.toLowerCase()
        return haystack.includes(q)
      }),
    [roles, permissions, searchQuery],
  )

  const filteredPermissions = useMemo(() => {
    const q = permissionQuery.trim().toLowerCase()
    if (!q) return permissions
    return permissions.filter((permission) =>
      `${permission.name} ${permission.code} ${permission.description ?? ""}`.toLowerCase().includes(q),
    )
  }, [permissions, permissionQuery])

  const limitText =
    access?.businessAccount?.limits?.roles == null
      ? "Unlimited"
      : `${access?.businessAccount?.usage?.roles ?? 0}/${access?.businessAccount?.limits?.roles}`

  const closeEditDialog = () => {
    setIsEditOpen(false)
    setEditingRole(null)
    setName("")
    setDescription("")
    setSelectedPermissionIds([])
    setPermissionQuery("")
  }

  const openCreateDialog = () => {
    setEditingRole(null)
    setName("")
    setDescription("")
    setSelectedPermissionIds([])
    setPermissionQuery("")
    setMessage(null)
    setIsEditOpen(true)
  }

  const openEditDialog = (role: RoleItem) => {
    setEditingRole(role)
    setName(role.name)
    setDescription(role.description ?? "")
    setSelectedPermissionIds(role.permissionIds)
    setPermissionQuery("")
    setMessage(null)
    setIsEditOpen(true)
  }

  const openDeleteDialog = (role: RoleItem) => {
    setDeletingRole(role)
    setIsDeleteOpen(true)
  }

  const createRole = async () => {
    if (!canMutateRoles || !access?.businessAccount?.id) {
      const unableMessage = roleMessage || "Role creation is not available."
      setMessage(unableMessage)
      showToast({ type: "error", title: "Error", message: unableMessage })
      return
    }

    setSubmitting(true)
    setMessage(null)
    try {
      const response = await fetch("/api/business/roles", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          businessAccountId: access.businessAccount?.id,
          name,
          description,
          permissionIds: selectedPermissionIds,
        }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        const errorMessage =
          (payload && (payload.message ?? payload.error)) || "Unable to create role."
        setMessage(errorMessage)
        showToast({ type: "error", title: "Error", message: errorMessage })
      } else {
        showToast({ type: "success", title: "Role created" })
        closeEditDialog()
        router.refresh()
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to create role."
      setMessage(errorMessage)
      showToast({ type: "error", title: "Error", message: errorMessage })
    } finally {
      setSubmitting(false)
    }
  }

  const updateRole = async () => {
    if (!editingRole || !access?.businessAccount?.id) {
      return
    }
    setSubmitting(true)
    setMessage(null)
    try {
      const response = await fetch(
        `/api/business/roles/${encodeURIComponent(editingRole.id)}?businessAccountId=${encodeURIComponent(access.businessAccount.id)}`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name,
            description,
            permissionIds: selectedPermissionIds,
          }),
        },
      )
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        const errorMessage =
          (payload && (payload.message ?? payload.error)) || "Unable to update role."
        setMessage(errorMessage)
        showToast({ type: "error", title: "Error", message: errorMessage })
      } else {
        showToast({ type: "success", title: "Role updated" })
        closeEditDialog()
        router.refresh()
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unable to update role."
      setMessage(errorMessage)
      showToast({ type: "error", title: "Error", message: errorMessage })
    } finally {
      setSubmitting(false)
    }
  }

  const deleteRole = async () => {
    if (!deletingRole || !access?.businessAccount?.id) return
    setSubmitting(true)
    try {
      const response = await fetch(
        `/api/business/roles/${encodeURIComponent(deletingRole.id)}?businessAccountId=${encodeURIComponent(access.businessAccount.id)}`,
        {
          method: "DELETE",
        },
      )
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        const errorMessage =
          (payload && (payload.message ?? payload.error)) || "Unable to delete role."
        showToast({ type: "error", title: "Error", message: errorMessage })
      } else {
        showToast({ type: "success", title: "Role deleted" })
        setIsDeleteOpen(false)
        setDeletingRole(null)
        router.refresh()
      }
    } catch (error) {
      showToast({ type: "error", title: "Error", message: error instanceof Error ? error.message : "Unable to delete role." })
    } finally {
      setSubmitting(false)
    }
  }

  const submitRole = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canMutateRoles) {
      const unableMessage = roleMessage || "Role management is not available."
      setMessage(unableMessage)
      showToast({ type: "error", title: "Error", message: unableMessage })
      return
    }
    if (editingRole) {
      await updateRole()
    } else {
      await createRole()
    }
  }

  const togglePermission = (permissionId: string) => {
    setSelectedPermissionIds((previous) =>
      previous.includes(permissionId)
        ? previous.filter((id) => id !== permissionId)
        : [...previous, permissionId],
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Roles</h1>
        <p className="mt-1 text-sm text-[#9CA3AF]">Define staff roles and permission sets.</p>
        <p className="mt-2 text-xs text-muted-foreground">Role limit: {limitText}</p>
      </div>

      <section className="rounded-lg border border-[#1f2937] bg-[#111827] p-4 text-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Existing roles</h2>
          <Button type="button" onClick={openCreateDialog} disabled={!canMutateRoles}>
            New role
          </Button>
        </div>
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search roles"
          className="mt-4 max-w-sm bg-[#0b1220] border-[#334155] text-white"
        />
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.length ? (
              filteredRoles.map((role) => (
                <TableRow key={role.id} className="border-[#1f2937]">
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{toDisplayName(role.description)}</TableCell>
                  <TableCell>{permissionNames(role.permissionIds, permissions) || "None"}</TableCell>
                  <TableCell>{role.isOwnerRole ? "Owner" : "Standard"}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                      onClick={() => openEditDialog(role)}
                      disabled={!canMutateRoles || role.isOwnerRole}
                     aria-label="Edit role"><Pencil className="size-4" /></Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteDialog(role)}
                      disabled={!canMutateRoles || role.isOwnerRole}
                     aria-label="Delete role"><Trash2 className="size-4" /></Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">No roles found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-xl bg-[#111827] border-[#1f2937] text-white">
          <DialogHeader>
            <DialogTitle>{editingRole ? "Edit role" : "Create role"}</DialogTitle>
            <DialogDescription>
              {editingRole
                ? "Update role details and permissions."
                : "Create a new role and assign permissions."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitRole} className="mt-4 space-y-4">
            <div className="grid gap-3">
              <Label htmlFor="fleet-role-name">Role name</Label>
              <Input
                id="fleet-role-name"
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="bg-[#0b1220] border-[#334155]"
                placeholder="Fleet coordinator"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fleet-role-description">Description</Label>
              <textarea
                id="fleet-role-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-16 w-full rounded-md border border-[#334155] bg-[#0b1220] px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6]"
                placeholder="Role purpose"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-white">Permissions</Label>
                <span className="text-xs text-[#9CA3AF]">{selectedPermissionIds.length} selected</span>
              </div>
              {permissions.length ? (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="min-h-10 w-full justify-between bg-[#0b1220] px-3 text-left text-white hover:text-white"
                    >
                      {selectedPermissionLabel(selectedPermissionIds, permissions)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-[min(420px,calc(100vw-3rem))] border-[#334155] bg-[#111827] p-0 text-white" align="start">
                    <div className="border-b border-[#334155] p-3">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" />
                        <Input
                          value={permissionQuery}
                          onChange={(event) => setPermissionQuery(event.target.value)}
                          onKeyDown={(event) => event.stopPropagation()}
                          placeholder="Search permissions"
                          className="h-10 border-[#334155] bg-[#0b1220] pl-9 text-white"
                        />
                      </div>
                    </div>
                    <div className="max-h-56 overflow-y-auto p-2">
                      {filteredPermissions.length ? (
                        filteredPermissions.map((permission) => (
                          <DropdownMenuCheckboxItem
                            key={permission.id}
                            checked={selectedPermissionIds.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                            onSelect={(event) => event.preventDefault()}
                            className="min-h-11"
                          >
                            <div className="flex flex-col">
                              <span>{permission.name}</span>
                              <span className="text-xs text-[#9CA3AF]">{permission.code}</span>
                            </div>
                          </DropdownMenuCheckboxItem>
                        ))
                      ) : (
                        <p className="px-3 py-6 text-center text-sm text-[#9CA3AF]">No permissions found.</p>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <p className="text-sm text-[#9CA3AF]">No permissions available.</p>
              )}
            </div>

            {selectedPermissionIds.length ? (
              <p className="text-xs text-[#9CA3AF]">
                Selected: {selectedPermissionNames(selectedPermissionIds, permissions).join(", ")}
              </p>
            ) : null}

            {message ? <p className="text-sm text-red-300">{message}</p> : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeEditDialog} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="bg-red-600 text-white hover:bg-red-500">
                {submitting ? "Saving..." : editingRole ? "Save changes" : "Create role"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm bg-[#111827] border-[#1f2937] text-white">
          <DialogHeader>
            <DialogTitle>Delete role</DialogTitle>
            <DialogDescription>
              {`Are you sure you want to delete ${deletingRole?.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteOpen(false)
                setDeletingRole(null)
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={deleteRole}
              disabled={submitting}
            >
              {submitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
