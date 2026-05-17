import { useState, useMemo, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Plus, Search, Trash2, CheckCircle2, Circle, Calendar, ShoppingCart, X, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar as CalendarPicker } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useTodos, matchesPeriod } from "@/lib/todo-context"
import { priorityConfig, priorityOrder, isOverdue } from "@/lib/task-utils"
import type { PeriodFilter, Category, Priority, CategoryConfig } from "@/lib/types"
import { SubtaskSection } from "@/components/SubtaskSection"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const taskSchema = z.object({
  text: z.string().min(1, "Task text is required"),
  date: z.string().optional(),
  price: z.string().optional(),
})

const categoryConfig: Record<"Shopping", CategoryConfig> = {
  Shopping: { color: "bg-black/40 backdrop-blur-xl border-b border-white/10", accentColor: "cyan", textColor: "text-cyan-400", btnColor: "from-teal-700 to-teal-600" },
}

interface ShoppingItemsProps {
  category?: Category
}

export function ShoppingItems({ category = "Shopping" }: ShoppingItemsProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { todos, toggleTodo, deleteTodo, addTodo, toggleSubtask, addSubtask } = useTodos()
  const [loading, setLoading] = useState(true)
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [taskPriority, setTaskPriority] = useState<Priority>("medium")
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: { text: "", date: "" },
  })

  const period: PeriodFilter = (location.state as { period?: PeriodFilter })?.period ?? "Day"
  const config = categoryConfig[category]

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(t)
  }, [])

  const periodTodos = useMemo(
    () => todos.filter((t) => {
      if (t.category !== category) return false
      if (filterDate) {
        const d = new Date(t.createdAt)
        return d.getFullYear() === filterDate.getFullYear() &&
               d.getMonth() === filterDate.getMonth() &&
               d.getDate() === filterDate.getDate()
      }
      return matchesPeriod(t.createdAt, period)
    }),
    [todos, period, filterDate, category]
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

  const sortedActiveTodos = useMemo(
    () => [...activeTodos].sort((a, b) => {
      const pa = priorityOrder[a.priority ?? "low"]
      const pb = priorityOrder[b.priority ?? "low"]
      if (pa !== pb) return pa - pb
      const oa = isOverdue(a.dueDate) ? 0 : 1
      const ob = isOverdue(b.dueDate) ? 0 : 1
      return oa - ob
    }),
    [activeTodos]
  )

  const progress = filteredTodos.length > 0 ? Math.round((completedTodos.length / filteredTodos.length) * 100) : 0

  return (
    <div className="h-svh flex flex-col">
      {/* Header */}
      <div className={`${config.color} sticky top-0 z-40`}>
        <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Button
              onClick={() => navigate("/todos")}
              variant="ghost"
              size="icon"
              className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 rounded-lg flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Shopping</h1>
              </div>
              <p className="text-white/80 text-xs sm:text-sm truncate">{activeTodos.length} active • {completedTodos.length} completed</p>
            </div>
          </div>

          {filteredTodos.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white transition-all duration-500" style={{ width: `${Math.max(progress, 3)}%` }} />
              </div>
              <span className="text-xs font-semibold text-white/90">{progress}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
          {/* Search */}
          <div className="flex gap-2 sm:gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 z-10 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-11 border-white/10 bg-black/30 backdrop-blur-xl text-white placeholder:text-slate-500"
              />
            </div>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 border-white/10 bg-black/30 text-slate-300 hover:text-white hover:bg-black/50">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">{filterDate ? format(filterDate, "MMM d") : "Filter"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarPicker mode="single" selected={filterDate} onSelect={(date) => setFilterDate(date)} />
                </PopoverContent>
              </Popover>
              {filterDate && (
                <Button type="button" variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => setFilterDate(undefined)}>
                  <X className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Clear</span>
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <>
              {sortedActiveTodos.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Circle className={`w-5 h-5 text-${config.accentColor}-600`} />
                    Active Items
                  </h2>
                  <div className="space-y-2">
                    {sortedActiveTodos.map((todo) => {
                      const overdue = isOverdue(todo.dueDate)
                      const pCfg = todo.priority ? priorityConfig[todo.priority] : null
                      return (
                        <Card key={todo.id} className="border-white/10 bg-black/30 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all group">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <button
                                onClick={() => toggleTodo(todo.id)}
                                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer border-${config.accentColor}-600 hover:bg-${config.accentColor}-100`}
                              >
                                {todo.completed && <Circle className={`w-4 h-4 text-${config.accentColor}-600`} />}
                              </button>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{todo.text}</p>
                                <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                  {pCfg && (
                                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${pCfg.bg} ${pCfg.color}`}>
                                      {pCfg.label}
                                    </span>
                                  )}
                                  {overdue && (
                                    <span className="text-xs px-1.5 py-0.5 rounded font-medium bg-red-500/20 text-red-400 flex items-center gap-1">
                                      <AlertCircle className="w-3 h-3" />Overdue
                                    </span>
                                  )}
                                  {todo.dueDate && (
                                    <span className={`text-xs ${overdue ? "text-red-400" : "text-slate-400"}`}>
                                      Due {format(new Date(todo.dueDate + "T00:00:00"), "MMM d, yyyy")}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => deleteTodo(todo.id)}
                                className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <SubtaskSection todo={todo} onToggle={toggleSubtask} onAdd={addSubtask} />
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}

              {completedTodos.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Completed Items
                  </h2>
                  <div className="space-y-2">
                    {completedTodos.slice(0, 10).map((todo) => (
                      <Card key={todo.id} className="border-white/5 bg-black/20 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all group">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <button
                              onClick={() => toggleTodo(todo.id)}
                              className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center hover:bg-emerald-500/50 transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-slate-500 line-through truncate">{todo.text}</p>
                            </div>
                            <button
                              onClick={() => deleteTodo(todo.id)}
                              className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <SubtaskSection todo={todo} onToggle={toggleSubtask} onAdd={addSubtask} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTodos.length === 0 && completedTodos.length === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex p-4 bg-black/30 backdrop-blur-xl rounded-full mb-4">
                    <ShoppingCart className="w-10 h-10 text-cyan-600" />
                  </div>
                  <p className="text-slate-300 font-medium">No items yet</p>
                  <p className="text-sm text-slate-500 mt-1">Add something you need to buy</p>
                </div>
              )}
            </>
          )}

          <div className="h-20" />
        </div>
      </div>

      {/* Add Item Footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <form
            onSubmit={handleSubmit((data) => {
              addTodo(data.text.trim(), category, data.date || undefined, data.price ? parseFloat(data.price) : undefined, taskPriority)
              reset()
              setTaskPriority("medium")
            })}
            className="flex gap-2 sm:gap-3 flex-col sm:flex-row"
          >
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Add a new item..."
                {...register("text")}
                className="w-full h-11 border-white/10 bg-black/30 backdrop-blur-xl text-white placeholder:text-slate-500"
              />
              {errors.text && <p className="text-red-400 text-xs mt-1">{errors.text.message as string}</p>}
            </div>
            <div className="flex gap-2">
              <Select value={taskPriority} onValueChange={(v) => setTaskPriority(v as Priority)}>
                <SelectTrigger className="h-11 w-28 border-white/10 bg-black/30 backdrop-blur-xl text-white text-sm flex-shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-black/90 text-white">
                  <SelectItem value="high" className="text-red-400 focus:bg-white/10 focus:text-red-400">High</SelectItem>
                  <SelectItem value="medium" className="text-amber-400 focus:bg-white/10 focus:text-amber-400">Medium</SelectItem>
                  <SelectItem value="low" className="text-slate-400 focus:bg-white/10 focus:text-slate-400">Low</SelectItem>
                </SelectContent>
              </Select>
              <Input type="date" {...register("date")} className="h-11 border-white/10 bg-black/30 backdrop-blur-xl text-white placeholder:text-slate-500 flex-1 sm:flex-none" />
              <Input type="number" step="0.01" min="0" placeholder="Price" {...register("price")} className="h-11 w-28 border-white/10 bg-black/30 backdrop-blur-xl text-white placeholder:text-slate-500 shadow-lg" />
              <Button type="submit" size="icon" className={`bg-gradient-to-r ${config.btnColor} text-white hover:shadow-lg transition-all flex-shrink-0 cursor-pointer`}>
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
