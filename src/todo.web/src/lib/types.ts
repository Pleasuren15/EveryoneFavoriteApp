export type Category = "Todo" | "Shopping" | "Personal" | "Work" | "Others" | "Birthday"
export type PeriodFilter = "Day" | "Week" | "Month" | "Year"
export type Priority = "low" | "medium" | "high"
export type EntryType = "income" | "expense"
export type ExpenseCategory =
  | "Food"
  | "Transport"
  | "Entertainment"
  | "Bills"
  | "Shopping"
  | "Health"
  | "Education"
  | "Other"
export type BudgetCategory = "Income" | ExpenseCategory

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
  type: EntryType
  category: BudgetCategory
  amount: number
  description: string
  date: string
  createdAt: Date
}

// GraphQL API response types — mirror the HotChocolate DTOs
export interface CategoryStats {
  categoryId: string
  categoryName: string
  totalTodos: number
  completedTodos: number
}

export interface CategoryProgress {
  categoryId: string
  categoryName: string
  sortOrder: number
  totalTodos: number
  completedTodos: number
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
  quantity?: number
  store?: string
  assignee?: string
  team?: string
  notes?: string
  moodRating?: number
  tags?: string
  contactId?: string
  contactName?: string
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

export type ContactGroup = "Family" | "Friend" | "Work" | "Other"

export interface Contact {
  id: string
  name: string
  phone: string
  email: string
  group: ContactGroup
  isFavorite: boolean
}
