import { useState, useMemo, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, ShoppingCart, Trash2, Plus, Search, Minus, Hash, Receipt, CalendarIcon, Sparkles } from "lucide-react"
import { format } from "date-fns"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import { useTodos, matchesPeriod } from "@/lib/todo-context"
import type { PeriodFilter } from "@/lib/types"

function parseQuantity(text: string): { label: string; qty: number } {
  const match = text.match(/^(.+?)\s+x(\d+)$/i)
  if (match) return { label: match[1].trim(), qty: parseInt(match[2]) }
  return { label: text, qty: 1 }
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
  else { text = due.toLocaleDateString("en-US", { month: "short", day: "numeric" }); color = "text-neutral-500" }
  return <span className={`text-[10px] font-mono ${color}`}>{text}</span>
}

export function ShoppingItems() {
  const navigate = useNavigate()
  const location = useLocation()
  const { todos, toggleTodo, deleteTodo, addTodo } = useTodos()
  const [loading, setLoading] = useState(true)

  const [newItemText, setNewItemText] = useState("")
  const [newItemQty, setNewItemQty] = useState(1)
  const [newItemPrice, setNewItemPrice] = useState("")
  const [newItemDate, setNewItemDate] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const period: PeriodFilter = (location.state as { period?: PeriodFilter })?.period ?? "Day"

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const periodTodos = useMemo(
    () => todos.filter((t) => t.category === "Shopping" && matchesPeriod(t.createdAt, period)),
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
  const totalQty = activeTodos.reduce((sum, t) => sum + parseQuantity(t.text).qty, 0)
  const totalPrice = activeTodos.reduce((sum, t) => sum + (t.price ?? 0) * parseQuantity(t.text).qty, 0)

  return (
    <div className="min-h-svh bg-neutral-950 relative flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative bg-gradient-to-b from-emerald-700 to-emerald-900 px-4 pt-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate("/todos")} className="p-2 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-mono bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5">
            <Receipt className="w-3.5 h-3.5" />
            <span>#{Math.floor(Math.random() * 9000 + 1000)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-600/40 backdrop-blur-sm rounded-xl">
            <ShoppingCart className="w-6 h-6 text-emerald-200" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Shopping List</h1>
            {loading ? (
              <Skeleton className="h-4 w-40 mt-1" />
            ) : (
              <p className="text-sm text-emerald-300/70 font-mono mt-0.5">
                {activeTodos.length} items &middot; {totalQty} units &middot; R{totalPrice.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="relative flex-1 px-4 pt-4 pb-4 overflow-y-auto space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input type="text" placeholder="Search items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-neutral-800/80 backdrop-blur-sm border border-neutral-700/50 rounded-xl text-neutral-100 placeholder:text-neutral-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (!newItemText.trim()) return; addTodo(newItemText.trim(), "Shopping", newItemDate || undefined, newItemPrice ? parseFloat(newItemPrice) : undefined); setNewItemText(""); setNewItemQty(1); setNewItemPrice(""); setNewItemDate("") }} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input type="text" placeholder="Add item..." value={newItemText} onChange={(e) => setNewItemText(e.target.value)}
              className="flex-1 px-3 py-2.5 bg-neutral-800/80 backdrop-blur-sm border border-neutral-700/50 rounded-xl text-neutral-100 placeholder:text-neutral-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
            <div className="flex items-center gap-1 bg-neutral-800/80 backdrop-blur-sm border border-neutral-700/50 rounded-xl px-2">
              <button type="button" onClick={() => setNewItemQty(Math.max(1, newItemQty - 1))} className="p-1 text-neutral-400 hover:text-neutral-200 transition-colors"><Minus className="w-3.5 h-3.5" /></button>
              <span className="text-sm font-mono text-neutral-200 w-5 text-center">{newItemQty}</span>
              <button type="button" onClick={() => setNewItemQty(newItemQty + 1)} className="p-1 text-neutral-400 hover:text-neutral-200 transition-colors"><Plus className="w-3.5 h-3.5" /></button>
            </div>
            <button type="submit" className="px-3 py-2.5 bg-emerald-600 text-white hover:bg-emerald-500 transition-colors rounded-xl shadow-md font-medium text-sm"><Plus className="w-5 h-5" /></button>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-mono text-neutral-500">R</span>
              <input type="number" step="0.01" min="0" placeholder="0.00" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-neutral-800/80 backdrop-blur-sm border border-neutral-700/50 rounded-xl text-neutral-100 placeholder:text-neutral-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all" />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex-1 flex items-center gap-2 px-3 py-2 bg-neutral-800/80 backdrop-blur-sm border border-neutral-700/50 rounded-xl text-neutral-100 text-sm hover:border-emerald-500/50 transition-all">
                  <CalendarIcon className="w-3.5 h-3.5 text-neutral-500" />
                  <span className="flex-1 text-left">{newItemDate ? format(new Date(newItemDate + "T00:00:00"), "PP") : "Due date"}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-neutral-900 border-neutral-700" align="start">
                <Calendar
                  mode="single"
                  selected={newItemDate ? new Date(newItemDate + "T00:00:00") : undefined}
                  onSelect={(date) => setNewItemDate(date ? format(date, "yyyy-MM-dd") : "")}
                  className="[&_.rdp-day]:text-neutral-200"
                />
              </PopoverContent>
            </Popover>
          </div>
        </form>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-24 bg-neutral-800" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl bg-neutral-800" />
            ))}
            <Skeleton className="h-6 w-32 mt-6 bg-neutral-800" />
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl bg-neutral-800" />
            ))}
          </div>
        ) : (
          <>
            {activeTodos.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                    To Buy
                  </span>
                  <span className="text-xs font-medium text-neutral-500 ml-auto">{activeTodos.length}</span>
                </div>
                <div className="space-y-2">
                  {activeTodos.map((todo) => {
                    const { label, qty } = parseQuantity(todo.text)
                    return (
                      <div
                        key={todo.id}
                        className="group relative flex items-center gap-3 bg-neutral-800 rounded-xl pl-4 pr-3 py-3 shadow-sm border border-neutral-700/60 hover:shadow-md hover:border-emerald-500/60 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-emerald-700" />
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodo(todo.id)}
                          className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 border-neutral-600"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium text-neutral-100">{label}</span>
                          <div className="mt-0.5"><DueDateBadge dueDate={todo.dueDate} /></div>
                        </div>
                        <div className="flex items-center gap-2">
                          {todo.price != null && (
                            <span className="text-xs font-mono text-emerald-400">R{(todo.price * qty).toFixed(2)}</span>
                          )}
                          <div className="flex items-center gap-1 bg-neutral-700/60 rounded-lg px-2 py-1">
                            <Hash className="w-3 h-3 text-neutral-500" />
                            <span className="text-xs font-mono text-emerald-400 font-semibold">{qty}</span>
                          </div>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {completedTodos.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Checked Off
                  </span>
                  <span className="text-xs font-medium text-neutral-600 ml-auto">{completedTodos.length}</span>
                </div>
                <div className="space-y-2">
                  {completedTodos.map((todo) => {
                    const { label, qty } = parseQuantity(todo.text)
                    return (
                      <div
                        key={todo.id}
                        className="group relative flex items-center gap-3 bg-neutral-800/60 rounded-xl pl-4 pr-3 py-2.5 border border-neutral-700/40 hover:bg-neutral-800 transition-all duration-200 overflow-hidden"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-neutral-600" />
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodo(todo.id)}
                          className="data-[state=checked]:bg-neutral-500 data-[state=checked]:border-neutral-500 border-neutral-700"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-neutral-500 line-through">{label}</span>
                          <div className="mt-0.5"><DueDateBadge dueDate={todo.dueDate} /></div>
                        </div>
                        <div className="flex items-center gap-2">
                          {todo.price != null && <span className="text-xs font-mono text-neutral-600">R{(todo.price * qty).toFixed(2)}</span>}
                          <span className="text-xs font-mono text-neutral-600">{qty}</span>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {(activeTodos.length > 0 || completedTodos.length > 0) && (
              <div className="bg-neutral-800/80 rounded-xl border border-neutral-700/60 px-4 py-3 flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-400">{activeTodos.length} items &middot; {totalQty} units</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-neutral-500">TOTAL</span>
                  <span className="text-base font-mono text-emerald-400 font-bold">R{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}

            {filteredTodos.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex p-4 bg-emerald-500/10 rounded-2xl mb-3">
                  <ShoppingCart className="w-10 h-10 text-emerald-400" />
                </div>
                <p className="text-neutral-200 text-sm font-medium">No items on your list</p>
                <p className="text-neutral-500 text-xs mt-1">Add something you need to buy</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
