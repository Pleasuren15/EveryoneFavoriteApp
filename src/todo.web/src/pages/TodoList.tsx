import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Calendar, CalendarDays, ListTodo, ShoppingCart, User, Briefcase, MoreHorizontal, Info, LogOut, ChevronDown, Wallet } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useTodos, matchesPeriod } from "@/lib/todo-context"
import { useCountUp } from "@/lib/hooks"
import { useBudget } from "@/lib/use-budget"
import type { Category, PeriodFilter } from "@/lib/types"

const categoryMeta: Record<Category, { color: string; shadowColor: string; icon: typeof ListTodo; badge: string }> = {
  Todo: { color: "bg-cornflower-blue-500", shadowColor: "shadow-cornflower-blue-500/20", icon: ListTodo, badge: "bg-cornflower-blue-500" },
  Shopping: { color: "bg-grapefruit-pink-500", shadowColor: "shadow-grapefruit-pink-500/20", icon: ShoppingCart, badge: "bg-grapefruit-pink-500" },
  Personal: { color: "bg-icy-blue-500", shadowColor: "shadow-icy-blue-500/20", icon: User, badge: "bg-icy-blue-500" },
  Work: { color: "bg-powder-blush-500", shadowColor: "shadow-powder-blush-500/20", icon: Briefcase, badge: "bg-powder-blush-500" },
  Others: { color: "bg-taupe-500", shadowColor: "shadow-taupe-500/20", icon: MoreHorizontal, badge: "bg-taupe-500" },
}

const categories: { name: Category; color: string; shadowColor: string; icon: typeof ListTodo }[] = [
  { name: "Todo", color: "bg-cornflower-blue-500", shadowColor: "shadow-cornflower-blue-500/20", icon: ListTodo },
  { name: "Shopping", color: "bg-grapefruit-pink-500", shadowColor: "shadow-grapefruit-pink-500/20", icon: ShoppingCart },
  { name: "Personal", color: "bg-icy-blue-500", shadowColor: "shadow-icy-blue-500/20", icon: User },
  { name: "Work", color: "bg-powder-blush-500", shadowColor: "shadow-powder-blush-500/20", icon: Briefcase },
  { name: "Others", color: "bg-taupe-500", shadowColor: "shadow-taupe-500/20", icon: MoreHorizontal },
]

export function TodoList() {
  const navigate = useNavigate()
  const { todos, toggleTodo } = useTodos()
  const [activeFilter, setActiveFilter] = useState<PeriodFilter>("Day")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAllActive, setShowAllActive] = useState(false)
  const [showAllCompleted, setShowAllCompleted] = useState(false)

  const { balance } = useBudget()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  const quotes = [
    { quote: "Failing to plan is planning to fail.", author: "Alan Lakein" },
    { quote: "Plans are nothing; planning is everything.", author: "Dwight D. Eisenhower" },
    { quote: "By failing to prepare, you are preparing to fail.", author: "Benjamin Franklin" },
    { quote: "A goal without a plan is just a wish.", author: "Antoine de Saint-Exupéry" },
    { quote: "Plans are only good intentions unless they immediately degenerate into hard work.", author: "Peter Drucker" },
    { quote: "A goal is a dream with a deadline.", author: "Napoleon Hill" },
    { quote: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
    { quote: "The plans of the diligent lead surely to abundance.", author: "King Solomon" },
    { quote: "The general who wins a battle makes many calculations in his temple before the battle is fought.", author: "Sun Tzu" },
    { quote: "You were born to win, but to be a winner, you must plan to win.", author: "Zig Ziglar" },
    { quote: "Every minute you spend in planning saves 10 minutes in execution.", author: "Brian Tracy" },
    { quote: "Begin with the end in mind.", author: "Stephen R. Covey" },
    { quote: "Give me six hours to chop down a tree and I will spend the first four sharpening the axe.", author: "Abraham Lincoln" },
    { quote: "A good plan violently executed now is better than a perfect plan next week.", author: "George S. Patton" },
    { quote: "If one does not know to which port one is sailing, no wind is favorable.", author: "Seneca" },
    { quote: "If you don't know where you are going, you'll end up someplace else.", author: "Yogi Berra" },
    { quote: "Setting goals is the first step in turning the invisible into the visible.", author: "Tony Robbins" },
    { quote: "If you don't know where you are going, any road will get you there.", author: "Lewis Carroll" },
    { quote: "No plan survives contact with the enemy.", author: "Helmuth von Moltke" },
    { quote: "Commit to the Lord whatever you do, and he will establish your plans.", author: "King Solomon" },
    { quote: "Time stays long enough for anyone who will use it.", author: "Leonardo da Vinci" },
    { quote: "Careful planning is the key to success.", author: "Alexander Graham Bell" },
    { quote: "Unless you have definite, precise, clearly set goals, you are not going to realize the maximum potential that lies within you.", author: "Zig Ziglar" },
    { quote: "Long-range planning works best in the short run.", author: "Doug Evelyn" },
    { quote: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { quote: "A budget is telling your money where to go instead of wondering where it went.", author: "John C. Maxwell" },
    { quote: "Good fortune is what happens when opportunity meets with planning.", author: "Thomas Edison" },
    { quote: "He who every morning plans the transactions of the day and follows out that plan carries a thread that will guide him through the labyrinth of the most busy life.", author: "Victor Hugo" },
    { quote: "Plans are useless, but planning is indispensable.", author: "Dwight D. Eisenhower" },
    { quote: "Well begun is half done.", author: "Aristotle" }
  ]

  const [randomQuote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)])

  const filters = [
    { id: "Day", label: "Day", icon: Calendar },
    { id: "Week", label: "Week", icon: CalendarDays },
    { id: "Month", label: "Month", icon: CalendarDays },
    { id: "Year", label: "Year", icon: CalendarDays },
  ]

  const activeFilterData = filters.find(f => f.id === activeFilter) || filters[0]

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

  const displayedActive = showAllActive ? activeTodos : activeTodos.slice(0, 3)
  const displayedCompleted = showAllCompleted ? completedTodos : completedTodos.slice(0, 3)

  return (
    <div className="min-h-svh bg-taupe-50 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-cornflower-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-icy-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 right-1/4 w-60 h-60 bg-powder-blush-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative bg-cover bg-center" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWJzdHJhY3R8ZW58MHx8MHx8fDA%3D)'}}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 py-6 flex flex-col gap-4">
          <div className="flex items-start justify-between px-4">
            <div className="text-white">
              <div className="text-sm opacity-80">Today</div>
              <div className="text-xl font-bold">{dateStr}</div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-sky-400 text-white hover:bg-sky-500 transition-colors rounded-full shadow-md">
                <Info className="w-5 h-5" />
              </button>
              <button onClick={() => navigate('/')} className="p-2 bg-rose-500 text-white hover:bg-rose-600 transition-colors rounded-full shadow-md">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-4 max-w-2xl">
            <p className="text-white text-base md:text-lg font-medium italic mb-2 leading-relaxed">
              "{randomQuote.quote}"
            </p>
            <p className="text-white/80 text-sm font-semibold">
              — {randomQuote.author}
            </p>
          </div>

          <div className="px-4">
            <Select value={activeFilter} onValueChange={(value) => setActiveFilter(value as PeriodFilter)}>
              <SelectTrigger className="w-full bg-powder-blush-500 backdrop-blur-md border-white/40 text-white [&>span]:text-white shadow-md">
                <SelectValue>
                  <div className="flex items-center gap-2 text-white">
                    <activeFilterData.icon className="w-4 h-4" />
                    <span>{activeFilterData.label}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white/90 backdrop-blur-md border-taupe-200/70">
                {filters.map((filter) => {
                  const Icon = filter.icon
                  return (
                    <SelectItem key={filter.id} value={filter.id} className="text-taupe-700 focus:bg-cornflower-blue-500 focus:text-white">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{filter.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="relative flex-1 px-4 py-4 overflow-y-auto space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-taupe-200/70 rounded-xl text-taupe-900 placeholder:text-taupe-400 text-sm focus:outline-none focus:border-cornflower-blue-500 focus:ring-2 focus:ring-cornflower-blue-500/20 transition-all"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-8 w-24 mt-4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : (
        <>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((category) => {
            const count = periodTodos.filter((t) => t.category === category.name).length
            return <CategoryCard key={category.name} category={category} count={count} activeFilter={activeFilter} />
          })}
          <BudgetCard balance={balance} activeFilter={activeFilter} />
        </div>

        {activeTodos.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-taupe-500 uppercase tracking-wider mb-2">
              Active — {activeTodos.length}
            </h2>
            <div className="space-y-1.5">
              {displayedActive.map((todo) => {
                const meta = categoryMeta[todo.category]
                const BadgeIcon = meta.icon
                return (
                  <div
                    key={todo.id}
                    className="group flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-taupe-200/50 rounded-xl px-3 py-2.5 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => navigate(`/todos/${todo.category.toLowerCase()}`, { state: { period: activeFilter } })}
                  >
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900"
                      />
                    </div>
                    <span className="flex-1 text-sm text-taupe-900">{todo.text}</span>
                    <div className={`${meta.badge} rounded-full p-1`}>
                      <BadgeIcon className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )
              })}
            </div>
            {activeTodos.length > 3 && (
              <button
                onClick={() => setShowAllActive(!showAllActive)}
                className="w-full mt-1.5 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-taupe-500 hover:text-taupe-700 bg-white/60 backdrop-blur-sm border border-taupe-200/40 rounded-xl hover:bg-white/90 transition-all"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllActive ? "rotate-180" : ""}`} />
                {showAllActive ? "Show less" : `Show all (${activeTodos.length} tasks)`}
              </button>
            )}
          </div>
        )}

        {completedTodos.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-taupe-500 uppercase tracking-wider mb-2">
              Completed — {completedTodos.length}
            </h2>
            <div className="space-y-1.5">
              {displayedCompleted.map((todo) => {
                const meta = categoryMeta[todo.category]
                const BadgeIcon = meta.icon
                return (
                  <div
                    key={todo.id}
                    className="group flex items-center gap-3 bg-white/70 backdrop-blur-sm border border-taupe-200/30 rounded-xl px-3 py-2.5 hover:shadow-sm transition-all cursor-pointer"
                    onClick={() => navigate(`/todos/${todo.category.toLowerCase()}`, { state: { period: activeFilter } })}
                  >
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900"
                      />
                    </div>
                    <span className="flex-1 text-sm text-taupe-400 line-through">{todo.text}</span>
                    <div className={`${meta.badge} rounded-full p-1`}>
                      <BadgeIcon className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )
              })}
            </div>
            {completedTodos.length > 3 && (
              <button
                onClick={() => setShowAllCompleted(!showAllCompleted)}
                className="w-full mt-1.5 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-taupe-500 hover:text-taupe-700 bg-white/60 backdrop-blur-sm border border-taupe-200/40 rounded-xl hover:bg-white/90 transition-all"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllCompleted ? "rotate-180" : ""}`} />
                {showAllCompleted ? "Show less" : `Show all (${completedTodos.length} tasks)`}
              </button>
            )}
          </div>
        )}

        {!loading && searchedTodos.length === 0 && searchQuery.trim() && (
          <div className="text-center py-8">
            <p className="text-taupe-500 text-sm">No tasks match your search</p>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  )
}

function CategoryCard({ category, count, activeFilter }: { category: typeof categories[0]; count: number; activeFilter: string }) {
  const navigate = useNavigate()
  const animatedCount = useCountUp(count)
  const Icon = category.icon
  return (
    <div
      onClick={() => navigate(`/todos/${category.name.toLowerCase()}`, { state: { period: activeFilter } })}
      className={`${category.color} backdrop-blur-sm border border-white/20 p-2 rounded-xl hover:shadow-lg ${category.shadowColor} transition-all duration-200 active:scale-[0.98] cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-white">{category.name}</span>
        <Icon className="w-3.5 h-3.5 text-white/80" />
      </div>
      <span className="text-2xl font-bold text-white">{animatedCount}</span>
      <span className="text-xs text-white/80 ml-1">tasks</span>
    </div>
  )
}

function BudgetCard({ balance, activeFilter }: { balance: number; activeFilter: string }) {
  const navigate = useNavigate()
  const animatedCount = useCountUp(Math.round(Math.abs(balance)))
  return (
    <div
      onClick={() => navigate("/todos/budget", { state: { period: activeFilter } })}
      className="bg-emerald-500 backdrop-blur-sm border border-white/20 p-2 rounded-xl hover:shadow-lg shadow-emerald-500/20 transition-all duration-200 active:scale-[0.98] cursor-pointer"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-white">Budget</span>
        <Wallet className="w-3.5 h-3.5 text-white/80" />
      </div>
      <span className="text-2xl font-bold text-white">{animatedCount}</span>
      <span className="text-xs text-white/80 ml-1">R</span>
    </div>
  )
}
