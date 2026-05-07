export type Category = "Todo" | "Shopping" | "Personal" | "Work" | "Others"
export type PeriodFilter = "Day" | "Week" | "Month" | "Year"

export interface Subtask {
  id: string
  text: string
  completed: boolean
}

export interface BudgetEntry {
  id: string
  type: "income" | "expense"
  category: string
  amount: number
  description: string
  date: string
}

export interface Todo {
  id: string
  text: string
  completed: boolean
  category: Category
  createdAt: Date
  dueDate?: string
  price?: number
  subtasks?: Subtask[]
}
