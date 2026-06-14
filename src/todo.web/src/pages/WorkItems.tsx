import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Search, Trash2, CheckCircle2, Circle, Calendar, Briefcase, X, AlertCircle, Users, Clock } from "lucide-react"
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
import type { Category, Priority, CategoryConfig } from "@/lib/types"
import { SubtaskSection } from "@/components/SubtaskSection"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const taskSchema = z.object({
  text: z.string().min(1, "Task name is required"),
  date: z.string().optional(),
  assignee: z.string().optional(),
  team: z.string().optional(),
})

const categoryConfig: Record<"Work", CategoryConfig> = {
  Work: { color: "bg-black/40 backdrop-blur-xl border-b border-white/10", accentColor: "amber", textColor: "text-amber-400", btnColor: "from-amber-700 to-amber-600" },
}

interface WorkItemsProps {
  category?: Category
}

export function WorkItems({ category = "Work" }: WorkItemsProps) {
  const navigate = useNavigate()
  const { todos, toggleTodo, deleteTodo, addTodo, toggleSubtask, addSubtask, loading } = useTodos()
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined)
  const [filterAssignee, setFilterAssignee] = useState<string | undefined>(undefined)
  const [filterTeam, setFilterTeam] = useState<string | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [taskPriority, setTaskPriority] = useState<Priority>("medium")
  const [sortBy, setSortBy] = useState<"priority" | "deadline" | "name">("priority")
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: { text: "", date: "", assignee: "", team: "" },
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
      if (filterAssignee && t.assignee !== filterAssignee) return false
      if (filterTeam && t.team !== filterTeam) return false
      return true
    }),
    [todos, filterDate, filterAssignee, filterTeam, category]
  )

  const filteredTodos = useMemo(
    () => {
      if (!searchQuery.trim()) return periodTodos
      return periodTodos.filter((t) => t.text.toLowerCase().includes(searchQuery.toLowerCase()) || (t.assignee?.toLowerCase() ?? "").includes(searchQuery.toLowerCase()))
    },
    [periodTodos, searchQuery]
  )

  const completedTodos = filteredTodos.filter((t) => t.completed)
  const activeTodos = filteredTodos.filter((t) => !t.completed)

  const sortedActiveTodos = useMemo(
    () => [...activeTodos].sort((a, b) => {
      if (sortBy === "priority") {
        const pa = priorityOrder[a.priority ?? "low"]
        const pb = priorityOrder[b.priority ?? "low"]
        if (pa !== pb) return pa - pb
        const oa = isOverdue(a.dueDate) ? 0 : 1
        const ob = isOverdue(b.dueDate) ? 0 : 1
        return oa - ob
      } else if (sortBy === "deadline") {
        const aDate = a.dueDate ? new Date(a.dueDate) : new Date(8640000000000000)
        const bDate = b.dueDate ? new Date(b.dueDate) : new Date(8640000000000000)
        return aDate.getTime() - bDate.getTime()
      }
      return a.text.localeCompare(b.text)
    }),
    [activeTodos, sortBy]
  )

  const uniqueAssignees = useMemo(
    () => Array.from(new Set(todos.filter(t => t.category === category && t.assignee).map(t => t.assignee))),
    [todos, category]
  )

  const uniqueTeams = useMemo(
    () => Array.from(new Set(todos.filter(t => t.category === category && t.team).map(t => t.team))),
    [todos, category]
  )

  const overdueTasks = activeTodos.filter(t => isOverdue(t.dueDate)).length
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
                <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 text-white" />
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Work Tasks</h1>
              </div>
              <p className="text-white/80 text-xs sm:text-sm truncate">{activeTodos.length} active • {overdueTasks > 0 && <span className="font-semibold text-red-400">{overdueTasks} overdue • </span>}{completedTodos.length} completed</p>
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
                  placeholder="Search tasks or assignees..."
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

              {uniqueAssignees.length > 0 && (
                <Select value={filterAssignee || "all"} onValueChange={(v) => setFilterAssignee(v === "all" ? undefined : v)}>
                  <SelectTrigger className="w-40 h-9 border-white/10 bg-black/30 backdrop-blur-xl text-white text-xs flex-shrink-0">
                    <Users className="w-3 h-3 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-black/90 text-white text-xs">
                    <SelectItem value="all">All Assignees</SelectItem>
                    {uniqueAssignees.map((assignee) => (
                      <SelectItem key={assignee} value={assignee || ""}>{assignee || "Unassigned"}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {uniqueTeams.length > 0 && (
                <Select value={filterTeam || "all"} onValueChange={(v) => setFilterTeam(v === "all" ? undefined : v)}>
                  <SelectTrigger className="w-40 h-9 border-white/10 bg-black/30 backdrop-blur-xl text-white text-xs flex-shrink-0">
                    <Users className="w-3 h-3 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-black/90 text-white text-xs">
                    <SelectItem value="all">All Teams</SelectItem>
                    {uniqueTeams.map((team) => (
                      <SelectItem key={team} value={team || ""}>{team || "No Team"}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as "priority" | "deadline" | "name")}>
                <SelectTrigger className="w-32 h-9 border-white/10 bg-black/30 backdrop-blur-xl text-white text-xs flex-shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-black/90 text-white text-xs">
                  <SelectItem value="priority">Sort by Priority</SelectItem>
                  <SelectItem value="deadline">Sort by Deadline</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-1">
                {filterDate && (
                  <Button type="button" variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => setFilterDate(undefined)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
                {filterAssignee && (
                  <Button type="button" variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => setFilterAssignee(undefined)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
                {filterTeam && (
                  <Button type="button" variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => setFilterTeam(undefined)}>
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
                    <Briefcase className="w-5 h-5 text-amber-400" />
                    Active Tasks
                  </h2>
                  <div className="space-y-3">
                    {sortedActiveTodos.map((todo) => {
                      const overdue = isOverdue(todo.dueDate)
                      const pCfg = todo.priority ? priorityConfig[todo.priority] : null
                      return (
                        <Card key={todo.id} className="border-white/10 bg-black/30 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all group">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <button
                                onClick={() => toggleTodo(todo.id)}
                                className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer border-amber-600 hover:bg-amber-100 mt-0.5"
                              >
                                {todo.completed && <Circle className="w-4 h-4 text-amber-400" />}
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <p className="text-sm font-medium text-white truncate flex-1">{todo.text}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  {todo.assignee && (
                                    <span className="text-xs px-2 py-1 rounded bg-sky-600/20 text-sky-300 flex items-center gap-1">
                                      <Users className="w-3 h-3" />
                                      {todo.assignee}
                                    </span>
                                  )}
                                  {todo.team && (
                                    <span className="text-xs px-2 py-1 rounded bg-purple-600/20 text-purple-300 flex items-center gap-1">
                                      <Users className="w-3 h-3" />
                                      {todo.team}
                                    </span>
                                  )}
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
                                    <span className={`text-xs flex items-center gap-1 ${overdue ? "text-red-400" : "text-slate-400"}`}>
                                      <Clock className="w-3 h-3" />
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
                    Completed ({completedTodos.length})
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
                              <p className="text-sm text-slate-500 line-through truncate">{todo.text}</p>
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
                    <Briefcase className="w-10 h-10 text-amber-600" />
                  </div>
                  <p className="text-slate-300 font-medium">No work tasks assigned</p>
                  <p className="text-sm text-slate-500 mt-1">Create tasks below to organize team work</p>
                </div>
              )}
            </>
          )}

          <div className="h-20" />
        </div>
      </div>

      {/* Add Task Footer */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 w-full">
          <form
            onSubmit={handleSubmit((data) => {
              addTodo(data.text.trim(), category, data.date || undefined, undefined, taskPriority, undefined, undefined, data.assignee || undefined, data.team || undefined)
              reset()
              setTaskPriority("medium")
            })}
            className="space-y-3"
          >
            <div className="flex gap-2 flex-col sm:flex-row">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Task description..."
                  {...register("text")}
                  className="w-full h-11 border-white/10 bg-black/30 backdrop-blur-xl text-white placeholder:text-slate-500 shadow-lg"
                />
                {errors.text && <p className="text-red-400 text-xs mt-1">{errors.text.message as string}</p>}
              </div>
              <Input
                type="text"
                placeholder="Assignee..."
                {...register("assignee")}
                className="h-11 sm:w-32 border-white/10 bg-black/30 backdrop-blur-xl text-white placeholder:text-slate-500 shadow-lg flex-shrink-0"
              />
            </div>
            <div className="flex gap-2 flex-col sm:flex-row">
              <Input
                type="text"
                placeholder="Team..."
                {...register("team")}
                className="flex-1 h-11 border-white/10 bg-black/30 backdrop-blur-xl text-white placeholder:text-slate-500 shadow-lg"
              />
              <Select value={taskPriority} onValueChange={(v) => setTaskPriority(v as Priority)}>
                <SelectTrigger className="!h-11 sm:w-24 border-white/10 bg-black/30 backdrop-blur-xl text-white text-sm flex-shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-black/90 text-white">
                  <SelectItem value="high" className="text-red-400 focus:bg-white/10 focus:text-red-400">High</SelectItem>
                  <SelectItem value="medium" className="text-amber-400 focus:bg-white/10 focus:text-amber-400">Medium</SelectItem>
                  <SelectItem value="low" className="text-slate-400 focus:bg-white/10 focus:text-slate-400">Low</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="date"
                {...register("date")}
                className="h-11 border-white/10 bg-black/30 backdrop-blur-xl text-white placeholder:text-slate-500 flex-1 sm:flex-none shadow-lg"
              />
              <Button type="submit" size="icon" className="bg-gradient-to-r from-amber-700 to-amber-600 text-white hover:shadow-lg transition-all flex-shrink-0 cursor-pointer h-11 w-11">
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
