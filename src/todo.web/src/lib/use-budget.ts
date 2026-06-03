import { useCallback } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import type { ErrorLike } from "@apollo/client"
import type { BudgetEntry, EntryType, BudgetCategory, ExpenseCategory } from "./types"
import { GET_BUDGET_ENTRIES, CREATE_BUDGET_ENTRY, DELETE_BUDGET_ENTRY } from "./operations"

const DEMO_USER_ID = "00000000-0000-0000-0000-00000000000a"
const BUDGET_QUERY_VARS = { variables: { userId: DEMO_USER_ID } }
const REFETCH_BUDGET = [{ query: GET_BUDGET_ENTRIES, variables: { userId: DEMO_USER_ID } }]

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
  const { data, loading, error } = useQuery(GET_BUDGET_ENTRIES, BUDGET_QUERY_VARS)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const entries: BudgetEntry[] = ((data as any)?.budgetEntries ?? []).map(mapBudgetEntry)

  const [createBudgetEntryMut] = useMutation(CREATE_BUDGET_ENTRY, { refetchQueries: REFETCH_BUDGET })
  const [deleteBudgetEntryMut] = useMutation(DELETE_BUDGET_ENTRY, { refetchQueries: REFETCH_BUDGET })

  const addEntry = useCallback(
    (entry: Omit<BudgetEntry, "id" | "createdAt" | "userId">) => {
      createBudgetEntryMut({
        variables: {
          input: {
            userId: DEMO_USER_ID,
            type: entry.type,
            category: entry.category,
            amount: entry.amount,
            description: entry.description,
            date: entry.date,
          },
        },
      })
    },
    [createBudgetEntryMut]
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
