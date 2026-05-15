import type { Priority } from "./types"

export const priorityConfig: Record<Priority, { label: string; color: string; bg: string }> = {
  high: { label: "High", color: "text-red-400", bg: "bg-red-500/20" },
  medium: { label: "Medium", color: "text-amber-400", bg: "bg-amber-500/20" },
  low: { label: "Low", color: "text-slate-400", bg: "bg-slate-500/20" },
}

export const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 }

export function isOverdue(dueDate?: string): boolean {
  if (!dueDate) return false
  const due = new Date(dueDate + "T00:00:00")
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return due < today
}
