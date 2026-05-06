import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Plus, Search, Calendar, CalendarDays, ListTodo, ShoppingCart, User, Briefcase, MoreHorizontal, Info, LogOut } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function TodoList() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState("Day")
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const currentDateRef = useRef<HTMLDivElement>(null)

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
    { id: "Month", label: "Month", icon: CalendarDays },
    { id: "Year", label: "Year", icon: CalendarDays },
  ]

  const activeFilterData = filters.find(f => f.id === activeFilter) || filters[0]

  useEffect(() => {
    if (currentDateRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const currentElement = currentDateRef.current
      const containerWidth = container.offsetWidth
      const elementLeft = currentElement.offsetLeft
      const elementWidth = currentElement.offsetWidth
      const scrollPosition = elementLeft - (containerWidth / 2) + (elementWidth / 2)
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' })
    }
  }, [activeFilter])

  const categories = [
    { name: "Todo", count: 5, color: "bg-cornflower-blue-500", shadowColor: "shadow-cornflower-blue-500/20", icon: ListTodo },
    { name: "Shopping", count: 3, color: "bg-grapefruit-pink-500", shadowColor: "shadow-grapefruit-pink-500/20", icon: ShoppingCart },
    { name: "Personal", count: 7, color: "bg-icy-blue-500", shadowColor: "shadow-icy-blue-500/20", icon: User },
    { name: "Work", count: 4, color: "bg-powder-blush-500", shadowColor: "shadow-powder-blush-500/20", icon: Briefcase },
    { name: "Others", count: 2, color: "bg-taupe-500", shadowColor: "shadow-taupe-500/20", icon: MoreHorizontal },
  ]

  const renderDateColumns = () => {
    if (activeFilter === "Day") {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      const dates = []
      // 7 days before, current day, 7 days after
      for (let i = -7; i < 8; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        const dayName = days[date.getDay()]
        const isToday = i === 0
        dates.push(
          <div 
            key={i}
            ref={isToday ? currentDateRef : null}
            className={`backdrop-blur-lg p-2 text-center flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
              isToday 
                ? 'bg-white shadow-[0_0_30px_8px_rgba(92,149,255,0.8)] scale-125 ring-4 ring-white min-w-[48px] h-[52px]' 
                : 'bg-white/80 border-[0.25px] border-white/40 hover:bg-white hover:shadow-lg hover:scale-105 min-w-[40px] h-[44px]'
            }`}
          >
            <div className={`text-[9px] font-semibold uppercase tracking-wide ${isToday ? 'text-cornflower-blue-500' : 'text-taupe-500'}`}>{dayName}</div>
            <div className={`text-sm font-extrabold ${isToday ? 'text-cornflower-blue-600' : 'text-taupe-800'}`}>{date.getDate()}</div>
          </div>
        )
      }
      return dates
    }
    if (activeFilter === "Month") {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const currentMonth = today.getMonth()
      const monthsToShow = []
      // 7 months before, current month, 7 months after
      for (let i = -7; i < 8; i++) {
        const monthIndex = (currentMonth + i + 12) % 12
        const isCurrentMonth = i === 0
        monthsToShow.push(
          <div 
            key={i}
            ref={isCurrentMonth ? currentDateRef : null}
            className={`backdrop-blur-lg p-2 text-center flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
              isCurrentMonth 
                ? 'bg-white shadow-[0_0_30px_8px_rgba(92,149,255,0.8)] scale-125 ring-4 ring-white min-w-[48px] h-[52px]' 
                : 'bg-white/80 border-[0.25px] border-white/40 hover:bg-white hover:shadow-lg hover:scale-105 min-w-[40px] h-[44px]'
            }`}
          >
            <div className={`text-sm font-extrabold ${isCurrentMonth ? 'text-cornflower-blue-600' : 'text-taupe-800'}`}>{months[monthIndex]}</div>
          </div>
        )
      }
      return monthsToShow
    }
    if (activeFilter === "Year") {
      const currentYear = today.getFullYear()
      const years = []
      // 7 years before, current year, 7 years after
      for (let i = -7; i < 8; i++) {
        const isCurrentYear = i === 0
        years.push(
          <div 
            key={i}
            ref={isCurrentYear ? currentDateRef : null}
            className={`backdrop-blur-lg p-2 text-center flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
              isCurrentYear 
                ? 'bg-white shadow-[0_0_30px_8px_rgba(92,149,255,0.8)] scale-125 ring-4 ring-white min-w-[48px] h-[52px]' 
                : 'bg-white/80 border-[0.25px] border-white/40 hover:bg-white hover:shadow-lg hover:scale-105 min-w-[40px] h-[44px]'
            }`}
          >
            <div className={`text-sm font-extrabold ${isCurrentYear ? 'text-cornflower-blue-600' : 'text-taupe-800'}`}>{currentYear + i}</div>
          </div>
        )
      }
      return years
    }
    return null
  }

  return (
    <div className="min-h-svh bg-taupe-50 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-cornflower-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-icy-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 right-1/4 w-60 h-60 bg-powder-blush-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative bg-cover bg-center" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWJzdHJhY3R8ZW58MHx8MHx8fDA%3D)'}}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 h-[30vh] flex flex-col">
          <div className="absolute top-4 left-4">
            <div className="text-white">
              <div className="text-sm opacity-80">Today</div>
              <div className="text-xl font-bold">{dateStr}</div>
            </div>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="p-2 bg-icy-blue-500 backdrop-blur-sm text-white hover:bg-icy-blue-600 transition-colors rounded-full shadow-md">
              <Info className="w-5 h-5" />
            </button>
            <button className="p-2 bg-cornflower-blue-500 text-white hover:bg-cornflower-blue-600 transition-colors rounded-full shadow-md">
              <Plus className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/')} className="p-2 bg-grapefruit-pink-500 backdrop-blur-sm text-white hover:bg-grapefruit-pink-600 transition-colors rounded-full shadow-md">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 max-w-2xl">
            <p className="text-white text-base md:text-lg font-medium italic mb-2 leading-relaxed text-left">
              "{randomQuote.quote}"
            </p>
            <p className="text-white/80 text-sm font-semibold text-left">
              — {randomQuote.author}
            </p>
          </div>
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <Select value={activeFilter} onValueChange={(value) => setActiveFilter(value)}>
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
        <div className="relative z-10 px-4 pb-3 pt-2">
          <div ref={scrollContainerRef} className="overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-3 w-max">
              {renderDateColumns()}
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex-1 px-4 py-6 overflow-y-auto">
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-taupe-700" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border border-taupe-200/70 rounded-xl text-taupe-900 placeholder:text-taupe-400 focus:outline-none focus:border-cornflower-blue-500 focus:ring-2 focus:ring-cornflower-blue-500/20 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((category) => (
                <div
                key={category.name}
                className={`${category.color} backdrop-blur-sm border border-white/20 p-2 rounded-xl hover:shadow-lg ${category.shadowColor} transition-all duration-200 active:scale-[0.98] cursor-pointer`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white">{category.name}</span>
                  <category.icon className="w-3.5 h-3.5 text-white/80" />
                </div>
                <span className="text-2xl font-bold text-white">{category.count}</span>
                <span className="text-xs text-white/80 ml-1">tasks</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
