import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Search, Trash2, CheckCircle2, Circle, Calendar, MoreHorizontal, X, AlertCircle, Tag } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar as CalendarPicker } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useTodos } from "@/lib/todo-context"
import { priorityConfig, priorityOrder, isOverdue } from "@/lib/task-utils"
import type { Category, CategoryConfig } from "@/lib/types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const taskSchema = z.object({
  text: z.string().min(1, "Task name is required"),
  date: z.string().optional(),
  tags: z.string().optional(),
})

const categoryConfig: Record<"Others", CategoryConfig> = {
  Others: { color: "bg-black/40 backdrop-blur-xl border-b border-white/10", accentColor: "indigo", textColor: "text-indigo-400", btnColor: "from-indigo-700 to-indigo-600" },
}

interface OthersItemsProps {
  category?: Category
}

export function OthersItems({ category = "Others" }: OthersItemsProps) {
  const navigate = useNavigate()
  const { todos, toggleTodo, deleteTodo, addTodo, loading } = useTodos()
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)
  const [filterTag, setFilterTag] = useState<string | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: { text: "", date: "", tags: "" },
  })

  const config = categoryConfig[category as keyof typeof categoryConfig]

  const periodTodos = useMemo(
    () => todos.filter((t) => {
      if (t.category !== category) return false
      if (filterDate) {
        const d = new Date(t.createdAt)
        return d.getFullYear() === filterDate.getFullYear() &&
               d.getMonth() === filterDate.getMonth() &&
               d.getDate() === filterDate.getDate()
      }
      if (filterTag && !(t.tags?.split(",").map(tag => tag.trim()).includes(filterTag))) return false
      return true
    }),
    [todos, filterDate, filterTag, category]
  )

  const filteredTodos = useMemo(
    () => {
      if (!searchQuery.trim()) return periodTodos
      return periodTodos.filter((t) => t.text.toLowerCase().includes(searchQuery.toLowerCase()) || (t.tags?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()))
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

  const allTags = useMemo(
    () => {
      const tagsSet = new Set<string>()
      todos.filter(t => t.category === category && t.tags).forEach(t => {
        t.tags?.split(",").forEach(tag => {
          tagsSet.add(tag.trim())
        })
      })
      return Array.from(tagsSet).sort()
    },
    [todos, category]
  )

  const progress = filteredTodos.length > 0 ? Math.round((completedTodos.length / filteredTodos.length) * 100) : 0

  return (
    <div className="h-svh flex flex-col">
      {/* Header */}
      <div className={`${config.color} sticky top-0 z-40`}>
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
                <MoreHorizontal className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 text-white" />
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Miscellaneous</h1>
              </div>
              <p className="text-white/80 text-xs sm:text-sm truncate">{activeTodos.length} active • {completedTodos.length} completed {allTags.length > 0 && `• ${allTags.length} tags`}</p>
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
                  placeholder="Search tasks or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-11 border-white/10 bg-black/30 backdrop-blur-xl text-white placeholder:text-slate-500"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 border-white/10 bg-black/30 text-slate-300 hover:text-white hover:bg-black/50">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">{filterDate ? format(filterDate, "MMM d") : "Filter by date"}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarPicker mode="single" selected={filterDate} onSelect={(date) => setFilterDate(date)} />
                </PopoverContent>
              </Popover>

              {allTags.length > 0 && (
                <Select value={filterTag || "all"} onValueChange={(v) => setFilterTag(v === "all" ? undefined : v)}>
                  <SelectTrigger className="w-40 h-9 border-white/10 bg-black/30 backdrop-blur-xl text-white text-xs flex-shrink-0">
                    <Tag className="w-3 h-3 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-black/90 text-white text-xs">
                    <SelectItem value="all">All Tags</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <div className="flex gap-1">
                {filterDate && (
                  <Button type="button" variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => setFilterDate(undefined)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
                {filterTag && (
                  <Button type="button" variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => setFilterTag(undefined)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <>
              {sortedActiveTodos.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Circle className="w-5 h-5 text-indigo-400" />
                    Active Tasks
                  </h2>
                  <div className="space-y-3">
                    {sortedActiveTodos.map((todo) => {
                      const overdue = isOverdue(todo.dueDate)
                      const pCfg = todo.priority ? priorityConfig[todo.priority] : null
                      const tags = todo.tags?.split(",").map(tag => tag.trim()) || []
                      return (
                        <Card key={todo.id} className="border-white/10 bg-black/30 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all group">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <button
                                onClick={() => toggleTodo(todo.id)}
                                className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer border-indigo-600 hover:bg-indigo-100 mt-0.5"
                              >
                                {todo.completed && <Circle className="w-4 h-4 text-indigo-400" />}
                              </button>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{todo.text}</p>
                                <div className="flex items-center gap-2 flex-wrap mt-2">
                                  {tags.length > 0 && tags.map((tag) => (
                                    <span key={tag} className="text-xs px-2 py-1 rounded bg-indigo-600/20 text-indigo-300 flex items-center gap-1">
                                      <Tag className="w-3 h-3" />
                                      {tag}
                                    </span>
                                  ))}
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
                                      {format(new Date(todo.dueDate + "T00:00:00"), "MMM d")}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={() => deleteTodo(todo.id)}
                                className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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
                    Completed ({completedTodos.length})
                  </h2>
                  <div className="space-y-2">
                    {completedTodos.slice(0, 10).map((todo) => {
                      const tags = todo.tags?.split(",").map(tag => tag.trim()) || []
                      return (
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
                                <p className="text-sm text-slate-500 line-through truncate">{todo.text}</p>
                                {tags.length > 0 && (
                                  <div className="flex gap-1 flex-wrap mt-1">
                                    {tags.map((tag) => (
                                      <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-indigo-600/20 text-indigo-300">{tag}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <button
                                onClick={() => deleteTodo(todo.id)}
                                className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}

              {activeTodos.length === 0 && completedTodos.length === 0 && (
                <div className="text-center py-16">
                  <div className="inline-flex p-4 bg-black/30 backdrop-blur-xl rounded-full mb-4">
                    <MoreHorizontal className="w-10 h-10 text-indigo-600" />
                  </div>
                  <p className="text-slate-300 font-medium">No miscellaneous tasks yet</p>
                  <p className="text-sm text-slate-500 mt-1">Add tasks with flexible tags</p>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-700 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center cursor-pointer"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Task Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md mx-4 max-sm:p-4 bg-gradient-to-b from-zinc-900 to-zinc-950">
          <DialogHeader className="text-center">
            <DialogTitle>Add Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit((data) => {
            addTodo(data.text.trim(), category, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, data.tags || undefined)
            reset()
            setAddOpen(false)
          })} className="flex flex-col items-center gap-4 mt-2">
            <div className="w-full max-w-sm">
              <label className="text-xs text-slate-400 mb-1 block">Task</label>
              <Input
                type="text"
                placeholder="What needs to be done?"
                {...register("text")}
                className="w-full h-11 bg-zinc-800/80 border-zinc-700 text-white placeholder:text-zinc-400 shadow-lg"
              />
              {errors.text && <p className="text-red-400 text-xs mt-1">{errors.text.message as string}</p>}
            </div>
            <div className="w-full max-w-sm">
              <label className="text-xs text-slate-400 mb-1 block">Tags</label>
              <Input
                type="text"
                placeholder="comma-separated: work, urgent, etc"
                {...register("tags")}
                className="w-full h-11 bg-zinc-800/80 border-zinc-700 text-white placeholder:text-zinc-400 shadow-lg"
              />
            </div>
            <Button type="submit" className="w-full max-w-sm bg-gradient-to-r from-indigo-700 to-indigo-600 text-white hover:shadow-lg transition-all cursor-pointer h-11">
              <Plus className="w-5 h-5 mr-2" />
              Add Task
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
