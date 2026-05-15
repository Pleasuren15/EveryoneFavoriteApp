export type Category = "Todo" | "Shopping" | "Personal" | "Work" | "Others"
export type PeriodFilter = "Day" | "Week" | "Month" | "Year"
export type Priority = "low" | "medium" | "high"

export interface Subtask {
  id: string
  todoId: string
  text: string
  completed: boolean
  sortOrder: number
}

export interface BudgetEntry {
  id: string
  type: "income" | "expense"
  category: string
  amount: number
  description: string
  date: string
  createdAt: Date
}

export interface Todo {
  id: string
  text: string
  completed: boolean
  category: Category
  createdAt: Date
  dueDate?: string
  priority?: Priority
  price?: number
  subtasks?: Subtask[]
}
