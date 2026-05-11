import { useState, useMemo, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Briefcase, Trash2, Calendar, CalendarDays, Plus, Search, TrendingUp, GitBranch, ChevronRight, ChevronDown } from "lucide-react"
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

function DueDateBadge({ dueDate }: { dueDate?: string }) {
  if (!dueDate) return null
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate + "T00:00:00")
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000)
  let text: string, color: string
  if (diff < 0) { text = `${Math.abs(diff)}d overdue`; color = "text-red-400" }
  else if (diff === 0) { text = "Today"; color = "text-orange-400" }
  else if (diff === 1) { text = "Tomorrow"; color = "text-amber-400" }
  else { text = due.toLocaleDateString("en-US", { month: "short", day: "numeric" }); color = "text-taupe-500" }
  return <span className={`text-[10px] font-mono ${color} ml-2`}>{text}</span>
}

export function WorkItems() {
  const navigate = useNavigate()
  const location = useLocation()
  const { todos, toggleTodo, deleteTodo, addTodo, toggleSubtask, addSubtask } = useTodos()

  const [newTodoText, setNewTodoText] = useState("")
  const [newTodoDate, setNewTodoDate] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedTodos, setExpandedTodos] = useState<Set<string>>(new Set())
  const [subtaskInputs, setSubtaskInputs] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  const period: PeriodFilter = (location.state as { period?: PeriodFilter })?.period ?? "Day"

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const periodTodos = useMemo(
    () => todos.filter((t) => t.category === "Work" && matchesPeriod(t.createdAt, period)),
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

  const toggleExpand = (id: string) => {
    setExpandedTodos((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="h-svh flex flex-col bg-white">

      <div className="relative bg-powder-blush-600 px-4 pt-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate("/todos")} className="p-2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-powder-blush-100 text-xs font-medium bg-white/15 backdrop-blur-sm px-3 py-1.5">
            {(() => { const Icon = periodIcons[period]; return <Icon className="w-3.5 h-3.5" /> })()}
            <span>{period}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 backdrop-blur-sm">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Work</h1>
            <p className="text-sm text-powder-blush-200">{activeTodos.length} pending · {completedTodos.length} resolved</p>
          </div>
        </div>
      </div>

      <div className="relative flex-1 px-4 py-4 overflow-y-auto space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10 pointer-events-none" />
          <input type="text" placeholder="Search work items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white/90 backdrop-blur-sm border border-powder-blush-200/50 text-taupe-800 placeholder:text-taupe-400 text-sm focus:outline-none focus:border-powder-blush-500 focus:ring-2 focus:ring-powder-blush-500/20 transition-all shadow-sm" />
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (!newTodoText.trim()) return; addTodo(newTodoText.trim(), "Work", newTodoDate || undefined); setNewTodoText(""); setNewTodoDate("") }} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input type="text" placeholder="Add work item..." value={newTodoText} onChange={(e) => setNewTodoText(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-white/90 backdrop-blur-sm border border-powder-blush-200/50 text-neutral-800 placeholder:text-neutral-400 text-sm focus:outline-none focus:border-powder-blush-500 focus:ring-2 focus:ring-powder-blush-500/20 transition-all shadow-sm" />
            <button type="submit" className="px-3 py-2.5 bg-powder-blush-600 text-white hover:bg-powder-blush-500 transition-all shadow-md"><Plus className="w-5 h-5" /></button>
          </div>
          <div className="flex gap-2">
            <input type="date" value={newTodoDate} onChange={(e) => setNewTodoDate(e.target.value)}
              className="flex-1 px-3 py-2 bg-white/90 backdrop-blur-sm border border-powder-blush-200/50 text-neutral-800 text-sm focus:outline-none focus:border-powder-blush-500 focus:ring-2 focus:ring-powder-blush-500/20 transition-all shadow-sm" />
          </div>
        </form>

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
              <div className="p-1.5 bg-gradient-to-br from-powder-blush-500 to-powder-blush-600">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">Active</span>
              <span className="text-xs font-medium text-neutral-400 ml-auto">{activeTodos.length}</span>
            </div>
            <div className="space-y-2">
              {activeTodos.map((todo) => {
                const subCount = todo.subtasks?.length ?? 0
                const doneCount = todo.subtasks?.filter((s) => s.completed).length ?? 0
                const isExpanded = expandedTodos.has(todo.id)
                return (
                  <div key={todo.id} className="relative bg-white shadow-sm border border-neutral-200/60 hover:shadow-md hover:border-powder-blush-300 transition-all duration-200 overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-powder-blush-500 to-powder-blush-600" />
                    <div className="group flex items-center gap-2 pl-4 pr-3 py-3">
                      {subCount > 0 ? (
                        <button onClick={() => toggleExpand(todo.id)} className="p-0.5 text-neutral-400 hover:text-neutral-700 transition-colors">
                          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>
                      ) : (
                        <div className="w-4" />
                      )}
                      <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)}
                        className="data-[state=checked]:bg-powder-blush-500 data-[state=checked]:border-powder-blush-500" />
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-neutral-800">{todo.text}</span>
                        <DueDateBadge dueDate={todo.dueDate} />
                      </div>
                      {subCount > 0 && (
                        <span className="text-[10px] font-mono text-powder-blush-600 bg-powder-blush-50 border border-powder-blush-200 px-1.5 py-0.5">
                          {doneCount}/{subCount}
                        </span>
                      )}
                      <button onClick={() => deleteTodo(todo.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    {isExpanded && subCount > 0 && (
                      <div className="border-t border-neutral-100 bg-neutral-50/60">
                        {todo.subtasks?.map((st) => (
                          <div key={st.id} className="flex items-center gap-2 pl-11 pr-4 py-2 hover:bg-white transition-colors">
                            <GitBranch className="w-3 h-3 text-neutral-400" />
                            <Checkbox checked={st.completed} onCheckedChange={() => toggleSubtask(todo.id, st.id)}
                              className="data-[state=checked]:bg-powder-blush-500 data-[state=checked]:border-powder-blush-500 scale-75" />
                            <span className={`text-xs ${st.completed ? "text-neutral-400 line-through" : "text-neutral-700"}`}>{st.text}</span>
                          </div>
                        ))}
                        <form onSubmit={(e) => { e.preventDefault(); const val = subtaskInputs[todo.id]?.trim(); if (!val) return; addSubtask(todo.id, val); setSubtaskInputs((prev) => ({ ...prev, [todo.id]: "" })) }} className="flex items-center gap-2 pl-11 pr-4 py-2 border-t border-neutral-100">
                          <input type="text" placeholder="Add subtask..." value={subtaskInputs[todo.id] ?? ""} onChange={(e) => setSubtaskInputs((prev) => ({ ...prev, [todo.id]: e.target.value }))}
                            className="flex-1 px-2 py-1 bg-white border border-neutral-200 text-neutral-700 placeholder:text-neutral-400 text-xs focus:outline-none focus:border-powder-blush-500 transition-all" />
                          <button type="submit" className="p-1 text-neutral-400 hover:text-powder-blush-500 transition-colors"><Plus className="w-3 h-3" /></button>
                        </form>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {completedTodos.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Resolved</span>
              <span className="text-xs font-medium text-neutral-300 ml-auto">{completedTodos.length}</span>
            </div>
            <div className="space-y-2">
              {completedTodos.map((todo) => (
                <div key={todo.id} className="group relative flex items-center gap-3 bg-white/60 pl-4 pr-3 py-2.5 border border-neutral-200/40 hover:bg-white transition-all duration-200 overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-neutral-300" />
                  <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)}
                    className="data-[state=checked]:bg-neutral-400 data-[state=checked]:border-neutral-400" />
                  <span className="flex-1 text-sm text-neutral-400 line-through">{todo.text}</span>
                  <button onClick={() => deleteTodo(todo.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && filteredTodos.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex p-4 bg-powder-blush-50 mb-3">
              <Briefcase className="w-10 h-10 text-powder-blush-400" />
            </div>
            <p className="text-neutral-700 text-sm font-medium">No work items</p>
            <p className="text-neutral-400 text-xs mt-1">Add a task to keep things moving</p>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  )
}
