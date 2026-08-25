"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

import { useToast } from "@/components/ui/toast-provider"

export function PlanReturnToast({ title, body, type }: { title: string; body: string; type: "success" | "error" }) {
  const shown = useRef(false)
  const router = useRouter()
  const { showToast } = useToast()

  useEffect(() => {
    if (shown.current) return
    shown.current = true
    showToast({ type, title, message: body })
    if (type === "success") router.refresh()
  }, [body, router, showToast, title, type])

  return null
}
