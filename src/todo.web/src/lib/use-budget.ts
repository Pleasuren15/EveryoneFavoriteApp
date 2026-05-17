import { useState, useCallback } from "react"
import type { BudgetEntry, ExpenseCategory } from "./types"

const DEMO_USER_ID = "00000000-0000-0000-0000-00000000000a"

const defaultEntries: BudgetEntry[] = [
  { id: "b1", userId: DEMO_USER_ID, type: "income", category: "Income", amount: 5000, description: "Monthly salary", date: "2026-05-01", createdAt: new Date("2026-05-01") },
  { id: "b2", userId: DEMO_USER_ID, type: "expense", category: "Food", amount: 800, description: "Groceries", date: "2026-05-03", createdAt: new Date("2026-05-03") },
  { id: "b3", userId: DEMO_USER_ID, type: "expense", category: "Bills", amount: 1200, description: "Rent", date: "2026-05-01", createdAt: new Date("2026-05-01") },
  { id: "b4", userId: DEMO_USER_ID, type: "expense", category: "Transport", amount: 400, description: "Fuel", date: "2026-05-05", createdAt: new Date("2026-05-05") },
  { id: "b5", userId: DEMO_USER_ID, type: "expense", category: "Entertainment", amount: 300, description: "Streaming & games", date: "2026-05-06", createdAt: new Date("2026-05-06") },
  { id: "b6", userId: DEMO_USER_ID, type: "expense", category: "Shopping", amount: 600, description: "New clothes", date: "2026-05-04", createdAt: new Date("2026-05-04") },
]

export function useBudget() {
  const [entries, setEntries] = useState<BudgetEntry[]>(defaultEntries)

  const addEntry = useCallback((entry: Omit<BudgetEntry, "id" | "createdAt" | "userId">) => {
    setEntries((prev) => [...prev, { ...entry, userId: DEMO_USER_ID, createdAt: new Date(), id: crypto.randomUUID() }])
  }, [])

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const totalIncome = entries.filter((e) => e.type === "income").reduce((s, e) => s + e.amount, 0)
  const totalExpenses = entries.filter((e) => e.type === "expense").reduce((s, e) => s + e.amount, 0)
  const balance = totalIncome - totalExpenses

  const expenseByCategory = entries
    .filter((e) => e.type === "expense")
    .reduce<Partial<Record<ExpenseCategory, number>>>((acc, e) => {
      const cat = e.category as ExpenseCategory
      acc[cat] = (acc[cat] || 0) + e.amount
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
