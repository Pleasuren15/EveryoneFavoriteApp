import { useState, useMemo, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Search, ListTodo, ShoppingCart, User, Briefcase, MoreHorizontal, Wallet, ChevronRight, Clock, CheckCircle2, Circle, LogOut, CalendarDays, ArrowRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTodos, matchesPeriod } from "@/lib/todo-context"
import { useCountUp } from "@/lib/hooks"
import { useBudget } from "@/lib/use-budget"
import type { Category, PeriodFilter } from "@/lib/types"

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

export function TodoList() {
  const navigate = useNavigate()
  const { todos, toggleTodo } = useTodos()
  const [activeFilter, setActiveFilter] = useState<PeriodFilter>("Day")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  const { balance } = useBudget()

  const scrollRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [statIndex, setStatIndex] = useState(0)

  const scrollToStat = useCallback((i: number) => {
    cardRefs.current[i]?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" })
    setStatIndex(i)
  }, [])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const onScroll = () => {
      const idx = Math.round(container.scrollLeft / container.clientWidth)
      setStatIndex(Math.min(idx, stats.length - 1))
    }
    container.addEventListener("scroll", onScroll, { passive: true })
    return () => container.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const filters: Array<{ id: PeriodFilter; label: string }> = [
    { id: "Day", label: "Today" },
    { id: "Week", label: "This Week" },
    { id: "Month", label: "This Month" },
    { id: "Year", label: "This Year" },
  ]

  const periodTodos = useMemo(
    () => todos.filter((t) => matchesPeriod(t.createdAt, activeFilter)),
    [todos, activeFilter]
  )

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

  const stats = useMemo(() => [
    { label: "Total Tasks", value: totalTasks, icon: ListTodo, border: "border-white/10", iconBg: "bg-gradient-to-br from-slate-500 to-slate-600", labelColor: "text-slate-400", valueColor: "text-white" },
    { label: "Active", value: activeTodos.length, icon: Circle, border: "border-purple-500/20", iconBg: "bg-gradient-to-br from-purple-500 to-purple-600", labelColor: "text-purple-400", valueColor: "text-white" },
    { label: "Completed", value: completedTodos.length, icon: CheckCircle2, border: "border-emerald-500/20", iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-600", labelColor: "text-emerald-400", valueColor: "text-white" },
    { label: "Progress", value: `${completionRate}%`, icon: Clock, border: "border-blue-500/20", iconBg: "bg-gradient-to-br from-blue-500 to-blue-600", labelColor: "text-blue-400", valueColor: "text-white" },
    { label: "Balance", value: `R${Math.abs(balance).toFixed(2)}`, icon: Wallet, border: "border-amber-500/20", iconBg: "bg-gradient-to-br from-amber-500 to-amber-600", labelColor: "text-amber-400", valueColor: balance >= 0 ? "text-emerald-400" : "text-red-400" },
  ], [totalTasks, activeTodos.length, completedTodos.length, completionRate, balance])

  return (
    <div className="h-svh flex flex-col font-sans">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 shadow-lg shadow-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
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

          {/* Period Filter */}
          <div className="flex items-center gap-2">
            <Select value={activeFilter} onValueChange={(v) => setActiveFilter(v as PeriodFilter)}>
              <SelectTrigger className="w-40 border-white/20 bg-black/30 backdrop-blur-xl text-white text-sm shadow-lg">
                <CalendarDays className="w-4 h-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-black/90 text-white">
                {filters.map((filter) => (
                  <SelectItem key={filter.id} value={filter.id} className="text-white focus:bg-white/10 focus:text-white">{filter.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              {/* Stats Carousel */}
              <div className="space-y-3">
                {/* Breadcrumbs */}
                <div className="flex gap-1.5 justify-center md:hidden">
                  {stats.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollToStat(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === statIndex ? "bg-white w-4" : "bg-white/30 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>

                {/* Stats Cards */}
                <div
                  ref={scrollRef}
                  className="flex gap-0 overflow-x-auto snap-x snap-mandatory scrollbar-none md:grid md:grid-cols-2 lg:grid-cols-6 md:overflow-x-visible md:gap-4"
                >
                  {stats.map((stat, i) => (
                    <Card
                      key={stat.label}
                      ref={(el) => { cardRefs.current[i] = el }}
                      className={`${stat.border} bg-black/30 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all group snap-start shrink-0 w-[calc(100vw-2rem)] md:w-auto ${i === 5 ? 'lg:col-span-2' : ''}`}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className={`p-2.5 ${stat.iconBg} rounded-xl shadow-md flex-shrink-0`}>
                            <stat.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-right">
                            <p className={`text-xs ${stat.labelColor} font-semibold uppercase tracking-wider`}>{stat.label}</p>
                            <p className={`text-2xl font-bold mt-1 ${stat.valueColor}`}>{stat.value}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
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
                        onClick={() => navigate(`/todos/${category.toLowerCase()}`, { state: { period: activeFilter } })}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Tasks Lists */}
              {activeTodos.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Circle className="w-5 h-5 text-purple-400" />
                    Active Tasks
                  </h2>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {activeTodos.slice(0, 5).map((todo) => {
                      return (
                        <Card
                          key={todo.id}
                          className="border-white/10 bg-black/30 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-200 group cursor-pointer"
                          onClick={() => navigate(`/todos/${todo.category.toLowerCase()}`, { state: { period: activeFilter } })}
                        >
                          <CardContent className="p-4 flex items-start gap-4">
                            <div onClick={(e) => { e.stopPropagation(); toggleTodo(todo.id) }} className="flex-shrink-0">
                              <div className="w-6 h-6 rounded-full border-2 border-purple-500 flex items-center justify-center transition-all cursor-pointer">
                                {todo.completed && <div className="w-3 h-3 bg-purple-500 rounded-full" />}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{todo.text}</p>
                              <Badge variant="secondary" className="mt-1 text-xs bg-white/10 text-slate-300">{todo.category}</Badge>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-colors flex-shrink-0" />
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                  {activeTodos.length > 5 && (
                    <Button variant="ghost" className="w-full mt-4 text-slate-400 hover:text-white">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      View all {activeTodos.length} tasks
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
     </div>
    )
}
