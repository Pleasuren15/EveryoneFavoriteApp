import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, Calendar, CalendarDays, ListTodo, ShoppingCart, User, Briefcase, MoreHorizontal, Info, LogOut, ChevronDown, Wallet } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { useTodos, matchesPeriod } from "@/lib/todo-context"
import { useCountUp } from "@/lib/hooks"
import { useBudget } from "@/lib/use-budget"
import type { Category, PeriodFilter } from "@/lib/types"

const bgUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWJzdHJhY3R8ZW58MHx8MHx8fDA%3D"

const categoryMeta: Record<Category, { color: string; shadowColor: string; icon: typeof ListTodo; badge: string }> = {
  Todo: { color: "bg-blue-600", shadowColor: "shadow-blue-600/20", icon: ListTodo, badge: "bg-blue-600" },
  Shopping: { color: "bg-emerald-600", shadowColor: "shadow-emerald-600/20", icon: ShoppingCart, badge: "bg-emerald-600" },
  Personal: { color: "bg-purple-600", shadowColor: "shadow-purple-600/20", icon: User, badge: "bg-purple-600" },
  Work: { color: "bg-pink-500", shadowColor: "shadow-pink-500/20", icon: Briefcase, badge: "bg-pink-500" },
  Others: { color: "bg-amber-500", shadowColor: "shadow-amber-500/20", icon: MoreHorizontal, badge: "bg-amber-500" },
}

const categories: { name: Category; color: string; shadowColor: string; icon: typeof ListTodo }[] = [
  { name: "Todo", color: "bg-blue-600", shadowColor: "shadow-blue-600/20", icon: ListTodo },
  { name: "Shopping", color: "bg-emerald-600", shadowColor: "shadow-emerald-600/20", icon: ShoppingCart },
  { name: "Personal", color: "bg-purple-600", shadowColor: "shadow-purple-600/20", icon: User },
  { name: "Work", color: "bg-pink-500", shadowColor: "shadow-pink-500/20", icon: Briefcase },
  { name: "Others", color: "bg-amber-500", shadowColor: "shadow-amber-500/20", icon: MoreHorizontal },
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
    <div className="h-svh flex flex-col bg-neutral-50">

      <div className="relative bg-cover bg-center" style={{ backgroundImage: `url(${bgUrl})` }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative px-4 pt-12 pb-4">
          <div className="flex items-start justify-between">
            <div className="text-white">
              <div className="text-sm opacity-80">Today</div>
              <div className="text-xl font-bold">{dateStr}</div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-sky-400 text-white hover:bg-sky-500 transition-colors shadow-md">
                <Info className="w-5 h-5" />
              </button>
              <button onClick={() => navigate('/')} className="p-2 bg-rose-500 text-white hover:bg-rose-600 transition-colors shadow-md">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="mt-3 max-w-2xl">
            <p className="text-white text-base md:text-lg font-medium italic mb-2 leading-relaxed">
              "{randomQuote.quote}"
            </p>
            <p className="text-white/80 text-sm font-semibold">
              — {randomQuote.author}
            </p>
          </div>

          <div className="mt-3 flex gap-1.5">
            {filters.map((filter) => {
              const Icon = filter.icon
              const isActive = activeFilter === filter.id
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as PeriodFilter)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white/90"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {filter.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="relative flex-1 px-4 py-4 overflow-y-auto space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-taupe-200/70 text-taupe-900 placeholder:text-taupe-400 text-sm focus:outline-none focus:border-cornflower-blue-500 focus:ring-2 focus:ring-cornflower-blue-500/20 transition-all"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
            <Skeleton className="h-8 w-24 mt-4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
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
            <div className="flex items-center gap-2 px-1 mb-2">
              <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                Active
              </span>
              <span className="text-xs font-medium text-neutral-400 ml-auto">{activeTodos.length}</span>
            </div>
            <div className="space-y-2">
              {displayedActive.map((todo) => {
                const meta = categoryMeta[todo.category]
                const BadgeIcon = meta.icon
                return (
                  <div
                    key={todo.id}
                    className="group relative flex items-center gap-3 bg-white pl-4 pr-3 py-3 shadow-sm border border-neutral-200/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/todos/${todo.category.toLowerCase()}`, { state: { period: activeFilter } })}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${meta.color}`} />
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900"
                      />
                    </div>
                    <span className="flex-1 text-sm text-neutral-800">{todo.text}</span>
                    <div className={`${meta.badge} p-1`}>
                      <BadgeIcon className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )
              })}
            </div>
            {activeTodos.length > 3 && (
              <button
                onClick={() => setShowAllActive(!showAllActive)}
                className="w-full mt-2 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-neutral-500 hover:text-neutral-700 bg-white/60 backdrop-blur-sm border border-neutral-200/40 hover:bg-white/90 transition-all"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllActive ? "rotate-180" : ""}`} />
                {showAllActive ? "Show less" : `Show all (${activeTodos.length})`}
              </button>
            )}
          </div>
        )}

        {completedTodos.length > 0 && (
          <div>
            <div className="flex items-center gap-2 px-1 mb-2">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Completed
              </span>
              <span className="text-xs font-medium text-neutral-300 ml-auto">{completedTodos.length}</span>
            </div>
            <div className="space-y-2">
              {displayedCompleted.map((todo) => {
                const meta = categoryMeta[todo.category]
                const BadgeIcon = meta.icon
                return (
                  <div
                    key={todo.id}
                    className="group relative flex items-center gap-3 bg-white/60 pl-4 pr-3 py-2.5 border border-neutral-200/40 hover:bg-white transition-all duration-200 cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/todos/${todo.category.toLowerCase()}`, { state: { period: activeFilter } })}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-neutral-300" />
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="data-[state=checked]:bg-neutral-400 data-[state=checked]:border-neutral-400"
                      />
                    </div>
                    <span className="flex-1 text-sm text-neutral-400 line-through">{todo.text}</span>
                    <div className={`${meta.badge} p-1 opacity-50`}>
                      <BadgeIcon className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )
              })}
            </div>
            {completedTodos.length > 3 && (
              <button
                onClick={() => setShowAllCompleted(!showAllCompleted)}
                className="w-full mt-2 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-neutral-500 hover:text-neutral-700 bg-white/60 backdrop-blur-sm border border-neutral-200/40 hover:bg-white/90 transition-all"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAllCompleted ? "rotate-180" : ""}`} />
                {showAllCompleted ? "Show less" : `Show all (${completedTodos.length})`}
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
      className={`${category.color} p-4 hover:shadow-xl ${category.shadowColor} hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.97] cursor-pointer flex flex-col gap-3`}
    >
      <div className="flex items-center justify-between">
        <div className="p-2 bg-white/20 backdrop-blur-sm">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">{category.name}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold text-white">{animatedCount}</span>
        <span className="text-xs text-white/70">tasks</span>
      </div>
    </div>
  )
}

function BudgetCard({ balance, activeFilter }: { balance: number; activeFilter: string }) {
  const navigate = useNavigate()
  const animatedCount = useCountUp(Math.round(Math.abs(balance)))
  return (
    <div
      onClick={() => navigate("/todos/budget", { state: { period: activeFilter } })}
      className="bg-emerald-600 p-4 hover:shadow-xl shadow-emerald-500/20 hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.97] cursor-pointer flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div className="p-2 bg-white/20 backdrop-blur-sm">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <span className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Budget</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold text-white">R{animatedCount}</span>
      </div>
    </div>
  )
}
