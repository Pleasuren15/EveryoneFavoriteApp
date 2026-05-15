/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Todo, Category, PeriodFilter } from "./types"

export function matchesPeriod(date: Date, period: PeriodFilter): boolean {
  const now = new Date()
  const d = new Date(date)

  if (period === "Day") {
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    )
  }

  if (period === "Week") {
    const dayOfWeek = now.getDay()
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)
    const weekStart = new Date(now.getFullYear(), now.getMonth(), diff)
    weekStart.setHours(0, 0, 0, 0)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    weekEnd.setHours(23, 59, 59, 999)
    return d >= weekStart && d <= weekEnd
  }

  if (period === "Month") {
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth()
    )
  }

  return d.getFullYear() === now.getFullYear()
}

interface TodoContextType {
  todos: Todo[]
  addTodo: (text: string, category: Category, dueDate?: string, price?: number) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  toggleSubtask: (todoId: string, subtaskId: string) => void
  addSubtask: (todoId: string, text: string) => void
  getCategoryCount: (category: Category, period?: PeriodFilter) => number
  getFilteredTodos: (category: Category, period: PeriodFilter) => Todo[]
}

const TodoContext = createContext<TodoContextType | null>(null)

const defaultTodos: Todo[] = [
  { id: "1", text: "Review project proposal", completed: false, category: "Work", createdAt: new Date(), dueDate: "2026-05-10", subtasks: [{ id: "s1", todoId: "1", text: "Read through draft", completed: true, sortOrder: 0 }, { id: "s2", todoId: "1", text: "Add feedback notes", completed: false, sortOrder: 1 }, { id: "s3", todoId: "1", text: "Send to manager", completed: false, sortOrder: 2 }] },
  { id: "2", text: "Buy groceries for the week", completed: true, category: "Shopping", createdAt: new Date(), price: 85 },
  { id: "3", text: "Morning exercise routine", completed: false, category: "Personal", createdAt: new Date(), dueDate: "2026-05-07" },
  { id: "4", text: "Prepare team presentation", completed: false, category: "Work", createdAt: new Date(), dueDate: "2026-05-12", subtasks: [{ id: "s4", todoId: "4", text: "Create slides", completed: false, sortOrder: 0 }, { id: "s5", todoId: "4", text: "Gather metrics", completed: false, sortOrder: 1 }] },
  { id: "5", text: "Read a chapter of a book", completed: false, category: "Personal", createdAt: new Date(), dueDate: "2026-05-10" },
  { id: "6", text: "Plan weekend trip", completed: false, category: "Others", createdAt: new Date(), dueDate: "2026-05-08" },
  { id: "7", text: "Organize desk workspace", completed: false, category: "Todo", createdAt: new Date(), dueDate: "2026-05-07" },
  { id: "8", text: "Call plumber about leak", completed: false, category: "Others", createdAt: new Date() },
  { id: "9", text: "Pick up dry cleaning", completed: true, category: "Shopping", createdAt: new Date(), price: 15 },
  { id: "10", text: "Write daily journal entry", completed: false, category: "Personal", createdAt: new Date() },
  { id: "11", text: "Fix login page bug", completed: false, category: "Work", createdAt: new Date(), dueDate: "2026-05-09", subtasks: [{ id: "s6", todoId: "11", text: "Reproduce the bug", completed: true, sortOrder: 0 }, { id: "s7", todoId: "11", text: "Fix the issue", completed: false, sortOrder: 1 }, { id: "s8", todoId: "11", text: "Write tests", completed: false, sortOrder: 2 }] },
  { id: "12", text: "Clean out email inbox", completed: false, category: "Todo", createdAt: new Date() },
]

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>(defaultTodos)

  const addTodo = useCallback((text: string, category: Category, dueDate?: string, price?: number) => {
    setTodos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text,
        completed: false,
        category,
        createdAt: new Date(),
        dueDate,
        price,
      },
    ])
  }, [])

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }, [])

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  const toggleSubtask = useCallback((todoId: string, subtaskId: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id !== todoId ? todo : {
          ...todo,
          subtasks: todo.subtasks?.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          ),
        }
      )
    )
  }, [])

  const addSubtask = useCallback((todoId: string, text: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id !== todoId ? todo : {
          ...todo,
          subtasks: [...(todo.subtasks ?? []), {
            id: crypto.randomUUID(),
            todoId,
            text,
            completed: false,
            sortOrder: (todo.subtasks ?? []).length,
          }],
        }
      )
    )
  }, [])

  const getCategoryCount = useCallback(
    (category: Category, period?: PeriodFilter) => {
      if (!period) return todos.filter((t) => t.category === category).length
      return todos.filter((t) => t.category === category && matchesPeriod(t.createdAt, period)).length
    },
    [todos]
  )

  const getFilteredTodos = useCallback(
    (category: Category, period: PeriodFilter) => {
      return todos.filter((todo) => todo.category === category && matchesPeriod(todo.createdAt, period))
    },
    [todos]
  )

  return (
    <TodoContext.Provider
      value={{ todos, addTodo, toggleTodo, deleteTodo, toggleSubtask, addSubtask, getCategoryCount, getFilteredTodos }}
    >
      {children}
    </TodoContext.Provider>
  )
}

export function useTodos() {
  const ctx = useContext(TodoContext)
  if (!ctx) throw new Error("useTodos must be used within a TodoProvider")
  return ctx
}
