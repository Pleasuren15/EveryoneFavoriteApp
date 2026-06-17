import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Search, Trash2, CheckCircle2, Circle, Calendar, Cake, X, Gift, Phone, Mail } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar as CalendarPicker } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useTodos } from "@/lib/todo-context"
import type { Category, Contact } from "@/lib/types"
import { SubtaskSection } from "@/components/SubtaskSection"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const INITIAL_CONTACTS: Contact[] = [
  { id: "1", name: "Alice Johnson", phone: "+27 82 123 4567", email: "alice@example.com", group: "Friend", isFavorite: true },
  { id: "2", name: "Bob Smith", phone: "+27 72 234 5678", email: "bob@example.com", group: "Work", isFavorite: false },
  { id: "3", name: "Carol Williams", phone: "+27 62 345 6789", email: "carol@example.com", group: "Family", isFavorite: true },
  { id: "4", name: "David Brown", phone: "+27 82 456 7890", email: "david@example.com", group: "Work", isFavorite: false },
  { id: "5", name: "Eve Davis", phone: "+27 72 567 8901", email: "eve@example.com", group: "Friend", isFavorite: false },
  { id: "6", name: "Frank Miller", phone: "+27 62 678 9012", email: "frank@example.com", group: "Other", isFavorite: true },
  { id: "7", name: "Grace Wilson", phone: "+27 82 789 0123", email: "grace@example.com", group: "Family", isFavorite: false },
  { id: "8", name: "Henry Taylor", phone: "+27 72 890 1234", email: "henry@example.com", group: "Work", isFavorite: false },
]

const category: Category = "Birthday"

const taskSchema = z.object({
  text: z.string().min(1, "Birthday person is required"),
  date: z.string().min(1, "Birthday date is required"),
  contactId: z.string().optional(),
})

function getAge(birthDate: string): number {
  const today = new Date()
  const bd = new Date(birthDate + "T00:00:00")
  let age = today.getFullYear() - bd.getFullYear()
  const m = today.getMonth() - bd.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < bd.getDate())) age--
  return age
}

function getNextBirthday(birthDate: string): Date {
  const today = new Date()
  const bd = new Date(birthDate + "T00:00:00")
  const next = new Date(today.getFullYear(), bd.getMonth(), bd.getDate())
  if (next < today) next.setFullYear(next.getFullYear() + 1)
  return next
}

function daysUntil(date: Date): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function BirthdayItems() {
  const navigate = useNavigate()
  const { todos, toggleTodo, deleteTodo, addTodo, toggleSubtask, addSubtask, loading } = useTodos()
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContactId, setSelectedContactId] = useState<string>("")
  const [addOpen, setAddOpen] = useState(false)
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: { text: "", date: "", contactId: "" },
  })

  const contacts = INITIAL_CONTACTS

  const periodTodos = useMemo(
    () => todos.filter((t) => {
      if (t.category !== category) return false
      if (filterDate) {
        const d = new Date(t.createdAt)
        return d.getFullYear() === filterDate.getFullYear() &&
               d.getMonth() === filterDate.getMonth() &&
               d.getDate() === filterDate.getDate()
      }
      return true
    }),
    [todos, filterDate]
  )

  const filteredTodos = useMemo(
    () => {
      if (!searchQuery.trim()) return periodTodos
      const q = searchQuery.toLowerCase()
      return periodTodos.filter((t) =>
        t.text.toLowerCase().includes(q) ||
        (t.contactName ?? "").toLowerCase().includes(q)
      )
    },
    [periodTodos, searchQuery]
  )

  const completedTodos = filteredTodos.filter((t) => t.completed)
  const activeTodos = filteredTodos.filter((t) => !t.completed)

  const upcomingBirthdays = useMemo(
    () => [...activeTodos].sort((a, b) => {
      const aNext = a.dueDate ? getNextBirthday(a.dueDate).getTime() : Infinity
      const bNext = b.dueDate ? getNextBirthday(b.dueDate).getTime() : Infinity
      return aNext - bNext
    }),
    [activeTodos]
  )

  const progress = filteredTodos.length > 0 ? Math.round((completedTodos.length / filteredTodos.length) * 100) : 0

  function handleContactSelect(contactId: string) {
    setSelectedContactId(contactId)
    const contact = contacts.find(c => c.id === contactId)
    if (contact) {
      setValue("text", contact.name)
    }
  }

  return (
    <div className="h-svh flex flex-col font-sans">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Button
              onClick={() => navigate("/todos")}
              variant="ghost"
              size="icon"
              className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 rounded-lg flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <Cake className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 text-pink-400" />
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Birthdays</h1>
              </div>
              <p className="text-white/80 text-xs sm:text-sm truncate">
                {activeTodos.length} upcoming &middot; {completedTodos.length} done
              </p>
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
          {/* Search & Filters */}
          <div className="space-y-3">
            <div className="flex gap-2 sm:gap-3 flex-col sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 z-10 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search birthdays..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-11 border-white/10 bg-black/30 backdrop-blur-xl text-white placeholder:text-slate-500"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 border-white/10 bg-black/30 text-slate-300 hover:text-white hover:bg-black/50">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">{filterDate ? format(filterDate, "MMM d") : "Filter by date added"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-white/10 bg-black/90 text-white" align="start">
                  <CalendarPicker mode="single" selected={filterDate} onSelect={(date) => setFilterDate(date)} />
                </PopoverContent>
              </Popover>
              {filterDate && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setFilterDate(undefined)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <>
              {/* Upcoming Birthdays */}
              {upcomingBirthdays.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-pink-400" />
                    Upcoming Birthdays
                  </h2>
                  <div className="space-y-3">
                    {upcomingBirthdays.map((todo) => {
                      const nextBday = todo.dueDate ? getNextBirthday(todo.dueDate) : null
                      const days = nextBday ? daysUntil(nextBday) : null
                      const age = todo.dueDate ? getAge(todo.dueDate) : null
                      const contact = todo.contactId ? contacts.find(c => c.id === todo.contactId) : undefined

                      return (
                        <Card key={todo.id} className="border-white/10 bg-black/30 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all group">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <button
                                onClick={() => toggleTodo(todo.id)}
                                className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer border-pink-500 hover:bg-pink-500/20 mt-0.5"
                              >
                                {todo.completed && <Circle className="w-4 h-4 text-pink-400" />}
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                      {todo.contactName ? todo.contactName.charAt(0).toUpperCase() : todo.text.charAt(0).toUpperCase()}
                                    </div>
                                    <p className="text-sm font-medium text-white truncate">{todo.contactName || todo.text}</p>
                                  </div>
                                  {days !== null && days <= 30 && (
                                    <span className="text-xs px-2 py-1 rounded-full bg-pink-500/20 text-pink-300 font-medium flex-shrink-0">
                                      {days === 0 ? "Today!" : `${days}d`}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  {todo.dueDate && (
                                    <span className="text-xs px-2 py-1 rounded bg-pink-600/20 text-pink-300 flex items-center gap-1">
                                      <Cake className="w-3 h-3" />
                                      {format(new Date(todo.dueDate + "T00:00:00"), "MMM d")}
                                      {age !== null && ` (turns ${age + 1})`}
                                    </span>
                                  )}
                                  {contact && (
                                    <>
                                      {contact.phone && (
                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                          <Phone className="w-3 h-3" />
                                          {contact.phone}
                                        </span>
                                      )}
                                      {contact.email && (
                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                          <Mail className="w-3 h-3" />
                                          {contact.email}
                                        </span>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => deleteTodo(todo.id)}
                                className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
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

              {/* Completed Birthdays */}
              {completedTodos.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Done ({completedTodos.length})
                  </h2>
                  <div className="space-y-2">
                    {completedTodos.slice(0, 10).map((todo) => (
                      <Card key={todo.id} className="border-white/5 bg-black/20 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all group">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => toggleTodo(todo.id)}
                              className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/30 flex items-center justify-center hover:bg-emerald-500/50 transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-slate-500 line-through truncate">{todo.contactName || todo.text}</p>
                            </div>
                            <button
                              onClick={() => deleteTodo(todo.id)}
                              className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeTodos.length === 0 && completedTodos.length === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex p-4 bg-black/30 backdrop-blur-xl rounded-full mb-4">
                    <Cake className="w-10 h-10 text-pink-500" />
                  </div>
                  <p className="text-slate-300 font-medium">No birthdays tracked yet</p>
                  <p className="text-sm text-slate-500 mt-1">Add birthdays linked to your contacts to never forget one</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Birthday Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md mx-4 max-sm:p-4 bg-gradient-to-b from-zinc-900 to-zinc-950">
          <DialogHeader className="text-center">
            <DialogTitle className="flex items-center justify-center gap-2">
              <Cake className="w-4 h-4 text-pink-400" />
              Add Birthday
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit((data) => {
            const contact = contacts.find(c => c.id === data.contactId)
            addTodo(
              data.text.trim(),
              category,
              data.date || undefined,
              undefined, undefined, undefined, undefined,
              undefined, undefined, undefined, undefined, undefined,
              data.contactId || undefined,
              contact?.name || data.text.trim()
            )
            reset()
            setSelectedContactId("")
            setAddOpen(false)
          })} className="flex flex-col items-center gap-4 mt-2">
            <div className="w-full max-w-sm">
              <label className="text-xs text-slate-400 mb-1 block">Select Contact</label>
              <Select value={selectedContactId} onValueChange={handleContactSelect}>
                <SelectTrigger className="!h-11 w-full bg-zinc-800/80 border-zinc-700 text-white text-sm">
                  <SelectValue placeholder="Choose a contact..." />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-white focus:bg-white/10 focus:text-white">
                      <div className="flex items-center gap-2">
                        <span>{c.name}</span>
                        <span className="text-xs text-slate-500">({c.group})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full max-w-sm">
              <label className="text-xs text-slate-400 mb-1 block">Or type a name</label>
              <Input
                type="text"
                placeholder="Birthday person's name..."
                {...register("text")}
                className="w-full h-11 bg-zinc-800/80 border-zinc-700 text-white placeholder:text-zinc-400 shadow-lg"
              />
              {errors.text && <p className="text-red-400 text-xs mt-1">{errors.text.message as string}</p>}
            </div>
            <div className="w-full max-w-sm">
              <label className="text-xs text-slate-400 mb-1 block">Birthday Date</label>
              <Input
                type="date"
                {...register("date")}
                className="w-full h-11 bg-zinc-800/80 border-zinc-700 text-white [color-scheme:dark] shadow-lg"
              />
              {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date.message as string}</p>}
            </div>
            <input type="hidden" {...register("contactId")} />
            <Button type="submit" className="w-full max-w-sm bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:shadow-lg transition-all cursor-pointer h-11">
              <Plus className="w-5 h-5 mr-2" />
              Add Birthday
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
