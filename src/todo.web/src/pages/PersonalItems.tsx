import { useState, useMemo, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, User, Trash2, Calendar, CalendarDays, Plus, Search, Heart } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { useTodos, matchesPeriod } from "@/lib/todo-context"
import type { PeriodFilter } from "@/lib/types"

const periodIcons: Record<PeriodFilter, typeof Calendar> = {
  Day: Calendar,
  Week: CalendarDays,
  Month: CalendarDays,
  Year: CalendarDays,
}

export function PersonalItems() {
  const navigate = useNavigate()
  const location = useLocation()
  const { todos, toggleTodo, deleteTodo, addTodo } = useTodos()
  const [loading, setLoading] = useState(true)

  const [newTodoText, setNewTodoText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const period: PeriodFilter = (location.state as { period?: PeriodFilter })?.period ?? "Day"

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const periodTodos = useMemo(
    () => todos.filter((t) => t.category === "Personal" && matchesPeriod(t.createdAt, period)),
    [todos, period]
  )

  const filteredTodos = useMemo(
    () => {
      if (!searchQuery.trim()) return periodTodos
      return periodTodos.filter((t) => t.text.toLowerCase().includes(searchQuery.toLowerCase()))
    },
    [periodTodos, searchQuery]
  )

  const completedTodos = filteredTodos.filter((t) => t.completed)
  const activeTodos = filteredTodos.filter((t) => !t.completed)

  return (
    <div className="h-svh flex flex-col bg-white">
      <div className="relative bg-purple-600 px-4 pt-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/todos")}
            className="p-2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-purple-200 text-sm font-medium bg-white/15 backdrop-blur-sm px-3 py-1.5">
            {(() => {
              const Icon = periodIcons[period]
              return <Icon className="w-4 h-4" />
            })()}
            <span>{period}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 backdrop-blur-sm">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Personal</h1>
            <p className="text-sm text-purple-200/70">
              {activeTodos.length} {activeTodos.length === 1 ? "thing" : "things"} to take care of
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex-1 px-4 py-4 overflow-y-auto space-y-4 pb-20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Search personal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white/90 backdrop-blur-sm border border-rose-200/50 text-neutral-800 placeholder:text-neutral-400 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all shadow-sm"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-24" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
            <Skeleton className="h-6 w-32 mt-6" />
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <>
            {activeTodos.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <div className="p-1.5 bg-purple-600">
                    <Heart className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                    Active
                  </span>
                  <span className="text-xs font-medium text-neutral-400 ml-auto">{activeTodos.length}</span>
                </div>
                <div className="space-y-2">
                  {activeTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="group relative flex items-center gap-3 bg-white pl-4 pr-3 py-3 shadow-sm border border-neutral-200/60 hover:shadow-md hover:border-purple-300 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600" />
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                      <span className="flex-1 text-sm font-medium text-neutral-800">{todo.text}</span>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {completedTodos.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Completed
                  </span>
                  <span className="text-xs font-medium text-neutral-300 ml-auto">{completedTodos.length}</span>
                </div>
                <div className="space-y-2">
                  {completedTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="group relative flex items-center gap-3 bg-white/60 pl-4 pr-3 py-2.5 border border-neutral-200/40 hover:bg-white transition-all duration-200 overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-neutral-300" />
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="data-[state=checked]:bg-neutral-400 data-[state=checked]:border-neutral-400"
                      />
                      <span className="flex-1 text-sm text-neutral-400 line-through">{todo.text}</span>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredTodos.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex p-4 bg-purple-50 mb-3">
                  <User className="w-10 h-10 text-purple-400" />
                </div>
                <p className="text-neutral-700 text-sm font-medium">Nothing personal yet</p>
                <p className="text-neutral-400 text-xs mt-1">Add a self-care task or reminder</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-4 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!newTodoText.trim()) return
            addTodo(newTodoText.trim(), "Personal")
            setNewTodoText("")
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Add a personal task..."
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            className="flex-1 px-3 py-2.5 bg-white/90 backdrop-blur-sm border border-rose-200/50 text-neutral-800 placeholder:text-neutral-400 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all shadow-sm"
          />
          <button
            type="submit"
            className="px-3 py-2.5 bg-purple-600 text-white hover:bg-purple-500 transition-all shadow-md"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  )
}
