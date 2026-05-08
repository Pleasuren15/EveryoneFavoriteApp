import { useState, useCallback } from "react"
import type { BudgetEntry } from "./types"

const defaultEntries: BudgetEntry[] = [
  { id: "b1", type: "income", category: "Income", amount: 5000, description: "Monthly salary", date: "2026-05-01" },
  { id: "b2", type: "expense", category: "Food", amount: 800, description: "Groceries", date: "2026-05-03" },
  { id: "b3", type: "expense", category: "Bills", amount: 1200, description: "Rent", date: "2026-05-01" },
  { id: "b4", type: "expense", category: "Transport", amount: 400, description: "Fuel", date: "2026-05-05" },
  { id: "b5", type: "expense", category: "Entertainment", amount: 300, description: "Streaming & games", date: "2026-05-06" },
  { id: "b6", type: "expense", category: "Shopping", amount: 600, description: "New clothes", date: "2026-05-04" },
]

export function useBudget() {
  const [entries, setEntries] = useState<BudgetEntry[]>(defaultEntries)

  const addEntry = useCallback((entry: Omit<BudgetEntry, "id">) => {
    setEntries((prev) => [...prev, { ...entry, id: crypto.randomUUID() }])
  }, [])

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const totalIncome = entries.filter((e) => e.type === "income").reduce((s, e) => s + e.amount, 0)
  const totalExpenses = entries.filter((e) => e.type === "expense").reduce((s, e) => s + e.amount, 0)
  const balance = totalIncome - totalExpenses

  const expenseByCategory = entries
    .filter((e) => e.type === "expense")
    .reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount
      return acc
    }, {})

  return {
    entries,
    addEntry,
    deleteEntry,
    totalIncome,
    totalExpenses,
    balance,
    expenseByCategory,
  }
}
