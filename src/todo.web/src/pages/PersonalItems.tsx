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
    <div className="min-h-svh bg-gradient-to-br from-rose-50 to-purple-50 relative flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      <div className="relative bg-gradient-to-br from-purple-600 via-purple-600 to-rose-500 px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/todos")}
            className="p-2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-purple-200 text-sm font-medium bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5">
            {(() => {
              const Icon = periodIcons[period]
              return <Icon className="w-4 h-4" />
            })()}
            <span>{period}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-xl">
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

      <div className="relative flex-1 px-4 py-4 overflow-y-auto space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
          <input
            type="text"
            placeholder="Search personal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white/90 backdrop-blur-sm border border-rose-200/50 rounded-xl text-neutral-800 placeholder:text-neutral-400 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all shadow-sm"
          />
        </div>

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
            className="flex-1 px-3 py-2.5 bg-white/90 backdrop-blur-sm border border-rose-200/50 rounded-xl text-neutral-800 placeholder:text-neutral-400 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all shadow-sm"
          />
          <button
            type="submit"
            className="px-3 py-2.5 bg-gradient-to-br from-purple-600 to-rose-500 text-white hover:from-purple-500 hover:to-rose-400 transition-all rounded-xl shadow-md"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-24" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-2xl" />
            ))}
            <Skeleton className="h-8 w-32 mt-6" />
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <>
            {activeTodos.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm border border-rose-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-4 py-2.5 border-b border-rose-100 flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider">
                    Active &mdash; {activeTodos.length}
                  </span>
                </div>
                <div className="divide-y divide-rose-50">
                  {activeTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="group flex items-center gap-3 px-4 py-3 hover:bg-rose-50/50 transition-colors"
                    >
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900"
                      />
                      <span className="flex-1 text-sm text-neutral-800">{todo.text}</span>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-rose-500 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {completedTodos.length > 0 && (
              <div className="bg-white/60 backdrop-blur-sm border border-rose-100/50 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-4 py-2 border-b border-rose-100/50">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Completed &mdash; {completedTodos.length}
                  </span>
                </div>
                <div className="divide-y divide-rose-50/50">
                  {completedTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="group flex items-center gap-3 px-4 py-2.5 hover:bg-rose-50/30 transition-colors"
                    >
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900"
                      />
                      <span className="flex-1 text-sm text-neutral-400 line-through">{todo.text}</span>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-rose-500 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {filteredTodos.length === 0 && (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-rose-300 mx-auto mb-3" />
                <p className="text-neutral-500 text-sm">Nothing personal yet</p>
                <p className="text-neutral-400 text-xs mt-1">Add a self-care task or reminder</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
