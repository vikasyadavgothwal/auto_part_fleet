"use client"

import {
  Bell,
  ChevronDown,
  Search,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#2A2A2A] bg-[#1A1A1A] backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-8">
        <SidebarTrigger className="text-[#9CA3AF] hover:bg-transparent hover:text-white lg:hidden" />

        <div className="max-w-xl flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9CA3AF]" />
            <Input
              type="text"
              placeholder="Search..."
              className="h-10 w-full rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] pl-10 pr-4 text-white placeholder:text-[#9CA3AF] focus-visible:border-[#DC2626] focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="relative text-[#9CA3AF] hover:bg-transparent hover:text-white"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#DC2626]" />
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="flex items-center gap-2 rounded-lg bg-[#2A2A2A] px-3 py-2 hover:bg-[#2A2A2A]"
          >
            <User className="h-5 w-5 text-[#9CA3AF]" />
            <span className="hidden text-sm font-medium text-white sm:inline">
              ABC Logistics
            </span>
            <ChevronDown className="h-4 w-4 text-[#9CA3AF]" />
          </Button>
        </div>
      </div>
    </header>
  )
}
