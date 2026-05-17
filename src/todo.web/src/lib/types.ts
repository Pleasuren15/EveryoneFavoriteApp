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
  userId: string
  type: "income" | "expense"
  category: string
  amount: number
  description: string
  date: string
  createdAt: Date
}

export interface Todo {
  id: string
  userId: string
  categoryId: string
  text: string
  completed: boolean
  category: Category
  createdAt: Date
  dueDate?: string
  priority?: Priority
  price?: number
  subtasks?: Subtask[]
}

export interface User {
  id: string
  email: string
  displayName: string
  createdAt: Date
}

export interface CategoryConfig {
  color: string
  accentColor: string
  textColor: string
  btnColor: string
}

export interface CategoryMeta {
  color: string
  bgColor: string
  accentColor: string
}

export interface PriorityConfig {
  label: string
  color: string
  bg: string
}

export interface QuickAddState {
  text: string
  category: Category
  priority: Priority
  dueDate: string
}
