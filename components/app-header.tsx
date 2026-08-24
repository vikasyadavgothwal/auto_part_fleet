"use client"

import { Bell, ChevronDown, ExternalLink, LogOut, Search, User } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { LanguageSelector } from "@/components/language/language-selector"
import { NotificationLiveListener } from "@/components/notification-live-listener"
import { NotificationPopup } from "@/components/notification-popup"
import { getDashboardUserName, type DashboardUser } from "@/lib/auth/types"
import { logoutFleet } from "@/lib/auth/client"
import { mainWebsiteUrl } from "@/lib/main-website-url"

export function DashboardHeader({ user }: { user: DashboardUser }) {
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logoutFleet()
    window.location.assign(mainWebsiteUrl())
  }
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-brand-panel backdrop-blur-sm">
      <NotificationLiveListener onUnreadChange={setUnreadNotifications} />
      <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-8">
        <SidebarTrigger className="text-brand-muted hover:bg-transparent hover:text-foreground lg:hidden" />

        <div className="max-w-xl flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brand-muted" />
            <Input
              type="text"
              placeholder="Search..."
              className="h-10 w-full rounded-sm border border-border bg-brand-surface pl-10 pr-4 text-foreground placeholder:text-brand-muted focus-visible:border-primary focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Open notifications"
                className="relative text-brand-muted hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground"
              >
                <Bell className="h-6 w-6" />
                {unreadNotifications > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border border-brand-panel bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </span>
                ) : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={12}
              className="w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-sm border border-border bg-brand-panel p-0 shadow-2xl shadow-black/40"
            >
              <NotificationPopup onUnreadChange={setUnreadNotifications} />
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button type="button" variant="ghost" className="flex items-center gap-2 rounded-sm bg-brand-panel-strong px-3 py-2"><User className="h-5 w-5 text-brand-muted" /><span className="hidden text-sm font-medium sm:inline">{getDashboardUserName(user)}</span><ChevronDown className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <DropdownMenuItem disabled={isLoggingOut} onSelect={() => setIsLogoutOpen(true)}><LogOut /> {isLoggingOut ? "Signing out..." : "Log out"}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log out?</DialogTitle>
                <DialogDescription>Are you sure you want to log out of this dashboard?</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={isLoggingOut}>Cancel</Button>
                </DialogClose>
                <Button type="button" variant="destructive" disabled={isLoggingOut} onClick={() => void handleLogout()}>
                  {isLoggingOut ? "Signing out..." : "Log out"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            asChild
            aria-label="Open main website"
            title="Main website"
            className="text-brand-muted hover:bg-muted hover:text-foreground"
          >
            <a href={mainWebsiteUrl()}>
              <ExternalLink className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
