"use client"

import { useEffect, useRef } from "react"

import { useToast } from "@/components/ui/toast-provider"

export function PlanReturnToast({ title, body }: { title: string; body: string }) {
  const shown = useRef(false)
  const { showToast } = useToast()

  useEffect(() => {
    if (shown.current) return
    shown.current = true
    showToast({ type: "success", title, message: body })
  }, [body, showToast, title])

  return null
}
