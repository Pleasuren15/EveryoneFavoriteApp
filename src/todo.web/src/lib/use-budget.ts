import { useCallback } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import type { ErrorLike } from "@apollo/client"
import type { BudgetEntry, EntryType, BudgetCategory, ExpenseCategory } from "./types"
import { GET_BUDGET_ENTRIES, CREATE_BUDGET_ENTRY, DELETE_BUDGET_ENTRY } from "./operations"
import { useAuth } from "./auth-context"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBudgetEntry(raw: any): BudgetEntry {
  return {
    id: raw.id as string,
    userId: raw.userId as string,
    type: raw.type as EntryType,
    category: raw.category as BudgetCategory,
    amount: Number(raw.amount),
    description: raw.description as string,
    date: raw.date as string,
    createdAt: new Date(raw.createdAt as string),
  }
}

export function useBudget(): {
  entries: BudgetEntry[]
  loading: boolean
  error?: ErrorLike
  addEntry: (entry: Omit<BudgetEntry, "id" | "createdAt" | "userId">) => void
  deleteEntry: (id: string) => void
  totalIncome: number
  totalExpenses: number
  balance: number
  expenseByCategory: Partial<Record<ExpenseCategory, number>>
} {
  const { user } = useAuth()
  const userId = user?.id

  const { data, loading, error } = useQuery(GET_BUDGET_ENTRIES, {
    variables: { userId },
    skip: !userId,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entries: BudgetEntry[] = ((data as any)?.budgetEntries ?? []).map(mapBudgetEntry)

  const refetchQueries = userId ? [{ query: GET_BUDGET_ENTRIES, variables: { userId } }] : []

  const [createBudgetEntryMut] = useMutation(CREATE_BUDGET_ENTRY, { refetchQueries })
  const [deleteBudgetEntryMut] = useMutation(DELETE_BUDGET_ENTRY, { refetchQueries })

  const addEntry = useCallback(
    (entry: Omit<BudgetEntry, "id" | "createdAt" | "userId">) => {
      if (!userId) return
      createBudgetEntryMut({
        variables: {
          input: {
            userId,
            type: entry.type,
            category: entry.category,
            amount: entry.amount,
            description: entry.description,
            date: entry.date,
          },
        },
      })
    },
    [createBudgetEntryMut, userId]
  )

  const deleteEntry = useCallback(
    (id: string) => {
      deleteBudgetEntryMut({ variables: { id } })
    },
    [deleteBudgetEntryMut]
  )

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
    loading,
    error,
    addEntry,
    deleteEntry,
    totalIncome,
    totalExpenses,
    balance,
    expenseByCategory,
  }
}
