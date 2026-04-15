import Link from "next/link"
import { ShieldCheck, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { appRoutes } from "@/lib/routes"

export function LoginForm() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[#0A0A0A] px-4 py-10">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.1fr_420px]">
        <section className="rounded-3xl border border-[#2A2A2A] bg-[#111111] p-8 text-white lg:p-10">
          <div className="surface-pill mb-6 bg-[#DC2626]/15 text-[#FCA5A5]">
            <Truck className="size-4" />
            Fleet Operations Control
          </div>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight">
            Keep fleet purchasing, supplier response, and dispatch activity in one dashboard.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#9CA3AF]">
            AutoPartsPro gives fleet teams a single workspace for vehicle readiness, RFQs,
            supplier coordination, and order movement.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4">
              <div className="text-2xl font-semibold">128</div>
              <p className="mt-1 text-sm text-[#9CA3AF]">Vehicles monitored live</p>
            </div>
            <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4">
              <div className="text-2xl font-semibold">24</div>
              <p className="mt-1 text-sm text-[#9CA3AF]">Open RFQs under review</p>
            </div>
            <div className="rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] p-4">
              <div className="text-2xl font-semibold">96.2%</div>
              <p className="mt-1 text-sm text-[#9CA3AF]">Current fill rate</p>
            </div>
          </div>
        </section>

        <Card className="border border-[#2A2A2A] bg-[#111111] text-white ring-0">
          <CardHeader className="space-y-2">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-1 text-xs text-[#9CA3AF]">
              <ShieldCheck className="size-3.5" />
              Secure access
            </div>
            <CardTitle className="text-2xl">Sign in</CardTitle>
            <CardDescription className="text-[#9CA3AF]">
              This starter dashboard does not include auth wiring yet. Use the button below
              to continue into the workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ops@autopartspro.com"
                className="h-11 border-[#2A2A2A] bg-[#0A0A0A]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-11 border-[#2A2A2A] bg-[#0A0A0A]"
              />
            </div>
            <Button asChild className="h-11 w-full">
              <Link href={appRoutes.overview}>Continue to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
