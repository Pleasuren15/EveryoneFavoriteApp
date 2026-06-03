/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useCallback, type ReactNode } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import type { ErrorLike } from "@apollo/client"
import type { Todo, Category, PeriodFilter, Priority, Subtask } from "./types"
import {
  GET_TODOS,
  CREATE_TODO,
  UPDATE_TODO,
  DELETE_TODO,
  ADD_SUBTASK,
  TOGGLE_SUBTASK,
} from "./operations"

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
  loading: boolean
  error?: ErrorLike
  addTodo: (text: string, category: Category, dueDate?: string, price?: number, priority?: Priority) => void
  toggleTodo: (id: string) => void
  deleteTodo: (id: string) => void
  toggleSubtask: (todoId: string, subtaskId: string) => void
  addSubtask: (todoId: string, text: string) => void
  getCategoryCount: (category: Category, period?: PeriodFilter) => number
  getFilteredTodos: (category: Category, period: PeriodFilter) => Todo[]
}

const TodoContext = createContext<TodoContextType | null>(null)

const DEMO_USER_ID = "00000000-0000-0000-0000-00000000000a"

const CATEGORY_IDS: Record<Category, string> = {
  Todo: "00000000-0000-0000-0000-000000000001",
  Shopping: "00000000-0000-0000-0000-000000000002",
  Personal: "00000000-0000-0000-0000-000000000003",
  Work: "00000000-0000-0000-0000-000000000004",
  Others: "00000000-0000-0000-0000-000000000005",
}

const TODO_QUERY_VARS = { variables: { userId: DEMO_USER_ID } }
const REFETCH_TODOS = [{ query: GET_TODOS, variables: { userId: DEMO_USER_ID } }]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTodo(raw: any): Todo {
  return {
    id: raw.id as string,
    userId: raw.userId as string,
    categoryId: raw.categoryId as string,
    text: raw.text as string,
    completed: raw.completed as boolean,
    createdAt: new Date(raw.createdAt as string),
    dueDate: raw.dueDate ?? undefined,
    price: raw.price != null ? Number(raw.price) : undefined,
    priority: raw.priority as Priority | undefined,
    category: (raw.category?.name ?? "Todo") as Category,
    subtasks: (raw.subtasks as any[] | undefined)?.map(
      (s): Subtask => ({
        id: s.id as string,
        todoId: s.todoId as string,
        text: s.text as string,
        completed: s.completed as boolean,
        sortOrder: s.sortOrder as number,
      })
    ),
  }
}

export function TodoProvider({ children }: { children: ReactNode }) {
  const { data, loading, error } = useQuery(GET_TODOS, TODO_QUERY_VARS)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const todos: Todo[] = ((data as any)?.todos ?? []).map(mapTodo)

  const [createTodoMut] = useMutation(CREATE_TODO, { refetchQueries: REFETCH_TODOS })
  const [updateTodoMut] = useMutation(UPDATE_TODO, { refetchQueries: REFETCH_TODOS })
  const [deleteTodoMut] = useMutation(DELETE_TODO, { refetchQueries: REFETCH_TODOS })
  const [addSubtaskMut] = useMutation(ADD_SUBTASK, { refetchQueries: REFETCH_TODOS })
  const [toggleSubtaskMut] = useMutation(TOGGLE_SUBTASK, { refetchQueries: REFETCH_TODOS })

  const addTodo = useCallback(
    (text: string, category: Category, dueDate?: string, price?: number, priority?: Priority) => {
      createTodoMut({
        variables: {
          input: {
            userId: DEMO_USER_ID,
            categoryId: CATEGORY_IDS[category],
            text,
            dueDate: dueDate ?? null,
            price: price ?? null,
            priority: priority ?? null,
          },
        },
      })
    },
    [createTodoMut]
  )

  const toggleTodo = useCallback(
    (id: string) => {
      const todo = todos.find((t) => t.id === id)
      if (!todo) return
      updateTodoMut({ variables: { input: { id, completed: !todo.completed } } })
    },
    [todos, updateTodoMut]
  )

  const deleteTodo = useCallback(
    (id: string) => {
      deleteTodoMut({ variables: { id } })
    },
    [deleteTodoMut]
  )

  const toggleSubtask = useCallback(
    (_todoId: string, subtaskId: string) => {
      toggleSubtaskMut({ variables: { id: subtaskId } })
    },
    [toggleSubtaskMut]
  )

  const addSubtask = useCallback(
    (todoId: string, text: string) => {
      addSubtaskMut({ variables: { input: { todoId, text } } })
    },
    [addSubtaskMut]
  )

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
      value={{
        todos,
        loading,
        error,
        addTodo,
        toggleTodo,
        deleteTodo,
        toggleSubtask,
        addSubtask,
        getCategoryCount,
        getFilteredTodos,
      }}
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
