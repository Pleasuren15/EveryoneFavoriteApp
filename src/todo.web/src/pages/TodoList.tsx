import { useState, useMemo, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Search, ListTodo, ShoppingCart, User, Briefcase, MoreHorizontal, ChevronRight, CheckCircle2, Circle, LogOut, ArrowRight, RefreshCw, Plus, AlertCircle, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarPicker } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useTodos } from "@/lib/todo-context"
import { useCountUp } from "@/lib/hooks"
import { useBudget } from "@/lib/use-budget"
import { priorityConfig, priorityOrder, isOverdue } from "@/lib/task-utils"
import type { Category, Priority } from "@/lib/types"

const categoryMeta: Record<Category, { color: string; bgColor: string; icon: typeof ListTodo; accentColor: string }> = {
  Todo: { color: "text-purple-600", bgColor: "bg-purple-50 dark:bg-purple-950/30", icon: ListTodo, accentColor: "from-purple-600 to-indigo-700" },
  Shopping: { color: "text-cyan-600", bgColor: "bg-cyan-50 dark:bg-cyan-950/30", icon: ShoppingCart, accentColor: "from-cyan-500 to-teal-600" },
  Personal: { color: "text-pink-600", bgColor: "bg-pink-50 dark:bg-pink-950/30", icon: User, accentColor: "from-pink-500 to-rose-600" },
  Work: { color: "text-amber-600", bgColor: "bg-amber-50 dark:bg-amber-950/30", icon: Briefcase, accentColor: "from-amber-500 to-orange-600" },
  Others: { color: "text-indigo-600", bgColor: "bg-indigo-50 dark:bg-indigo-950/30", icon: MoreHorizontal, accentColor: "from-indigo-600 to-blue-700" },
}

const categories: Array<Category> = ["Todo", "Shopping", "Personal", "Work", "Others"]

function CategoryCard({ category, count, meta, onClick }: {
  category: string
  count: number
  meta: typeof categoryMeta[Category]
  onClick: () => void
}) {
  const animatedCount = useCountUp(count)
  const Icon = meta.icon

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer border-white/10 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-black/40 backdrop-blur-xl"
    >
      <CardContent className="pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-lg shadow-md bg-gradient-to-br ${meta.accentColor} flex-shrink-0`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <p className={`text-xs font-semibold uppercase tracking-widest ${meta.color}`}>{category}</p>
            <p className="text-3xl font-bold text-white mt-2">{animatedCount}</p>
            <p className="text-xs text-slate-400 mt-1">{count === 1 ? 'task' : 'tasks'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const emptyQuickAdd = { text: "", category: "Todo" as Category, priority: "medium" as Priority, dueDate: "" }

export function TodoList() {
  const navigate = useNavigate()
  const { todos, toggleTodo, addTodo } = useTodos()
  const [customRange, setCustomRange] = useState<{ from?: Date; to?: Date }>({})
  const [periodOpen, setPeriodOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [quickAddOpen, setQuickAddOpen] = useState(false)
  const [quickAdd, setQuickAdd] = useState(emptyQuickAdd)

  const { balance } = useBudget()



  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const periodTodos = useMemo(() => {
    if (customRange.from && customRange.to) {
      const from = new Date(customRange.from); from.setHours(0, 0, 0, 0)
      const to = new Date(customRange.to); to.setHours(23, 59, 59, 999)
      return todos.filter((t) => { const d = new Date(t.createdAt); return d >= from && d <= to })
    }
    return todos
  }, [todos, customRange])

  const searchedTodos = useMemo(
    () => {
      if (!searchQuery.trim()) return periodTodos
      return periodTodos.filter((t) => t.text.toLowerCase().includes(searchQuery.toLowerCase()))
    },
    [periodTodos, searchQuery]
  )

  const completedTodos = searchedTodos.filter((t) => t.completed)
  const activeTodos = searchedTodos.filter((t) => !t.completed)
  const totalTasks = activeTodos.length + completedTodos.length
  const completionRate = totalTasks > 0 ? Math.round((completedTodos.length / totalTasks) * 100) : 0

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

  const stats = useMemo(() => [
    { label: "Total Tasks", value: totalTasks,                           border: "border-white/25",       gradient: "from-white/25 to-white/10",         shadow: "shadow-black/20",       labelColor: "text-slate-200",  valueColor: "text-white" },
    { label: "Active",      value: activeTodos.length,                   border: "border-purple-400/50",  gradient: "from-purple-500/40 to-purple-500/15", shadow: "shadow-purple-900/40",  labelColor: "text-purple-200", valueColor: "text-white" },
    { label: "Completed",   value: completedTodos.length,                border: "border-emerald-400/50", gradient: "from-emerald-500/40 to-emerald-500/15", shadow: "shadow-emerald-900/40", labelColor: "text-emerald-200",valueColor: "text-white" },
    { label: "Progress",    value: `${completionRate}%`,                 border: "border-blue-400/50",    gradient: "from-blue-500/40 to-blue-500/15",     shadow: "shadow-blue-900/40",    labelColor: "text-blue-200",   valueColor: "text-white" },
    { label: "Balance",     value: `R${Math.abs(balance).toFixed(2)}`,   border: "border-amber-400/50",   gradient: "from-amber-500/40 to-amber-500/15",   shadow: "shadow-amber-900/40",   labelColor: "text-amber-200",  valueColor: balance >= 0 ? "text-emerald-300" : "text-red-400" },
  ], [totalTasks, activeTodos.length, completedTodos.length, completionRate, balance])

  function handleQuickAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!quickAdd.text.trim()) return
    addTodo(quickAdd.text.trim(), quickAdd.category, quickAdd.dueDate || undefined, undefined, quickAdd.priority)
    setQuickAdd(emptyQuickAdd)
    setQuickAddOpen(false)
  }

  return (
    <div className="h-svh flex flex-col font-sans">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 shadow-lg shadow-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="p-2 sm:p-2.5 bg-white/10 backdrop-blur-sm rounded-xl flex-shrink-0">
                <ListTodo className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-3xl font-bold text-white truncate">Dashboard</h1>
                <p className="text-xs sm:text-sm text-purple-200 mt-0.5 sm:mt-1 truncate">{dateStr}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => window.location.reload()} variant="ghost" size="sm" className="text-purple-200 hover:text-white hover:bg-white/10 flex-shrink-0">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button onClick={() => navigate('/')} variant="ghost" size="sm" className="text-purple-200 hover:text-white hover:bg-white/10 flex-shrink-0">
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-8">
          {loading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Period Filter + Stats */}
              <div className="flex items-center gap-2 overflow-hidden">
                <Popover open={periodOpen} onOpenChange={setPeriodOpen}>
                  <PopoverTrigger asChild>
                    <button className="border border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-purple-500/5 backdrop-blur-xl rounded-xl px-4 py-3 shrink-0 text-left hover:from-purple-500/30 hover:to-purple-500/10 transition-colors shadow-sm shadow-purple-900/40">
                      <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider whitespace-nowrap">Period</p>
                      <p className="text-base font-bold mt-0.5 text-white whitespace-nowrap">
                        {customRange.from && customRange.to
                          ? `${format(customRange.from, "MMM d")} – ${format(customRange.to, "MMM d")}`
                          : customRange.from
                          ? `${format(customRange.from, "MMM d")} – ...`
                          : "All time"}
                      </p>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-white/10 bg-black/90" align="start">
                    <CalendarPicker
                      mode="range"
                      selected={{ from: customRange.from, to: customRange.to }}
                      onSelect={(range) => {
                        setCustomRange({ from: range?.from, to: range?.to })
                        if (range?.from && range?.to) setPeriodOpen(false)
                      }}
                      numberOfMonths={1}
                      className="text-white [&_.rdp-day_button:hover]:bg-purple-500/20 [&_.rdp-day_button.rdp-day_selected]:bg-purple-600"
                    />
                    {customRange.from && (
                      <div className="px-3 pb-3">
                        <button
                          onClick={() => setCustomRange({})}
                          className="w-full text-xs text-slate-400 hover:text-white py-1.5 rounded border border-white/10 hover:bg-white/5 transition-colors"
                        >
                          Clear range
                        </button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 flex-1">
                  {stats.map((stat, i) => (
                    <div
                      key={stat.label}
                      className={`border ${stat.border} bg-gradient-to-br ${stat.gradient} backdrop-blur-xl rounded-xl px-4 py-3 shadow-sm ${stat.shadow}`}
                    >
                      <p className={`text-xs ${stat.labelColor} font-semibold uppercase tracking-wider whitespace-nowrap`}>{stat.label}</p>
                      <p className={`text-base font-bold mt-0.5 ${stat.valueColor} whitespace-nowrap`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 z-10 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-11 border-white/10 bg-black/30 backdrop-blur-xl text-white placeholder:text-slate-500 shadow-lg"
                />
              </div>

              {/* Category Grid */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Categories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {categories.map((category) => {
                    const count = periodTodos.filter((t) => t.category === category).length
                    const meta = categoryMeta[category]
                    return (
                      <CategoryCard
                        key={category}
                        category={category}
                        count={count}
                        meta={meta}
                        onClick={() => navigate(`/todos/${category.toLowerCase()}`, { state: { period: "Day" } })}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Active Tasks */}
              {sortedActiveTodos.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Circle className="w-5 h-5 text-purple-400" />
                    Active Tasks
                  </h2>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {sortedActiveTodos.slice(0, 5).map((todo) => {
                      const overdue = isOverdue(todo.dueDate)
                      const pCfg = todo.priority ? priorityConfig[todo.priority] : null
                      return (
                        <Card
                          key={todo.id}
                          className="border-white/10 bg-black/30 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-200 group cursor-pointer"
                          onClick={() => navigate(`/todos/${todo.category.toLowerCase()}`, { state: { period: "Day" } })}
                        >
                          <CardContent className="p-4 flex items-start gap-4">
                            <div onClick={(e) => { e.stopPropagation(); toggleTodo(todo.id) }} className="flex-shrink-0">
                              <div className="w-6 h-6 rounded-full border-2 border-purple-500 flex items-center justify-center transition-all cursor-pointer">
                                {todo.completed && <div className="w-3 h-3 bg-purple-500 rounded-full" />}
                              </div>
                            </div>
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
                                <Badge variant="secondary" className="text-xs bg-white/10 text-slate-300">{todo.category}</Badge>
                                {todo.dueDate && (
                                  <span className={`text-xs ${overdue ? "text-red-400" : "text-slate-400"}`}>
                                    Due {new Date(todo.dueDate + "T00:00:00").toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-colors flex-shrink-0" />
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                  {sortedActiveTodos.length > 5 && (
                    <Button variant="ghost" className="w-full mt-4 text-slate-400 hover:text-white">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      View all {sortedActiveTodos.length} tasks
                    </Button>
                  )}
                </div>
              )}

              {completedTodos.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Completed Tasks
                  </h2>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {completedTodos.slice(0, 3).map((todo) => {
                      return (
                        <Card
                          key={todo.id}
                          className="border-white/5 bg-black/20 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-200 group cursor-pointer"
                        >
                          <CardContent className="p-4 flex items-start gap-4">
                            <button
                              onClick={(e) => { e.stopPropagation(); toggleTodo(todo.id) }}
                              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-500/30 hover:bg-emerald-500/50 transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-slate-500 line-through truncate">{todo.text}</p>
                              <Badge variant="secondary" className="mt-1 text-xs bg-white/10 text-slate-500 opacity-60">{todo.category}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                  {completedTodos.length > 3 && (
                    <Button variant="ghost" className="w-full mt-4 text-slate-500 hover:text-white">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      View all {completedTodos.length} completed
                    </Button>
                  )}
                </div>
              )}

              {activeTodos.length === 0 && completedTodos.length === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex p-4 bg-black/30 backdrop-blur-xl rounded-full mb-4">
                    <ListTodo className="w-8 h-8 text-slate-500" />
                  </div>
                  <p className="text-slate-300 font-medium">No tasks found</p>
                  <p className="text-sm text-slate-500 mt-1">Start by adding a new task to a category</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Quick Add FAB */}
      <button
        onClick={() => setQuickAddOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center text-white hover:shadow-xl hover:scale-105 transition-all z-50"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Quick Add Dialog */}
      <Dialog open={quickAddOpen} onOpenChange={(open) => { setQuickAddOpen(open); if (!open) setQuickAdd(emptyQuickAdd) }}>
        <DialogContent className="bg-black/90 border-white/10 text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Flag className="w-4 h-4 text-purple-400" />
              Quick Add Task
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleQuickAdd} className="space-y-4 mt-2">
            <Input
              autoFocus
              placeholder="What needs to be done?"
              value={quickAdd.text}
              onChange={(e) => setQuickAdd((p) => ({ ...p, text: e.target.value }))}
              className="h-11 border-white/10 bg-white/5 text-white placeholder:text-slate-500"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-xs text-slate-400 font-medium">Category</p>
                <Select value={quickAdd.category} onValueChange={(v) => setQuickAdd((p) => ({ ...p, category: v as Category }))}>
                  <SelectTrigger className="h-10 border-white/10 bg-white/5 text-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-black/90 text-white">
                    {categories.map((c) => (
                      <SelectItem key={c} value={c} className="text-white focus:bg-white/10 focus:text-white">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-400 font-medium">Priority</p>
                <Select value={quickAdd.priority} onValueChange={(v) => setQuickAdd((p) => ({ ...p, priority: v as Priority }))}>
                  <SelectTrigger className="h-10 border-white/10 bg-white/5 text-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-black/90 text-white">
                    <SelectItem value="high" className="text-red-400 focus:bg-white/10 focus:text-red-400">High</SelectItem>
                    <SelectItem value="medium" className="text-amber-400 focus:bg-white/10 focus:text-amber-400">Medium</SelectItem>
                    <SelectItem value="low" className="text-slate-400 focus:bg-white/10 focus:text-slate-400">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-slate-400 font-medium">Due Date (optional)</p>
              <Input
                type="date"
                value={quickAdd.dueDate}
                onChange={(e) => setQuickAdd((p) => ({ ...p, dueDate: e.target.value }))}
                className="h-10 border-white/10 bg-white/5 text-white"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white hover:shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </form>
        </DialogContent>
      </Dialog>
     </div>
    )
}
