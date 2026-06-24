import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Search, Trash2, Flame, Calendar, RotateCcw, CheckCircle2, Zap, Trophy } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { StreakEntry } from "@/lib/types"

const INITIAL_STREAKS: StreakEntry[] = [
  {
    id: "s1",
    title: "of running",
    rules: "Run at least 2km every day. No excuses.",
    currentStreak: 15,
    longestStreak: 42,
    startDate: "2026-06-01",
    lastCheckIn: "2026-06-21",
    isActive: true,
    createdAt: new Date("2026-06-01"),
  },
  {
    id: "s2",
    title: "of meditation",
    rules: "Meditate for at least 10 minutes. Morning preferred.",
    currentStreak: 7,
    longestStreak: 30,
    startDate: "2026-06-10",
    lastCheckIn: "2026-06-21",
    isActive: true,
    createdAt: new Date("2026-06-10"),
  },
  {
    id: "s3",
    title: "of no sugar",
    rules: "No added sugar in meals or drinks. Fruit is ok.",
    currentStreak: 0,
    longestStreak: 14,
    startDate: "2026-06-05",
    lastCheckIn: "2026-06-19",
    isActive: false,
    createdAt: new Date("2026-06-05"),
  },
  {
    id: "s4",
    title: "of reading",
    rules: "Read at least 20 pages every day.",
    currentStreak: 3,
    longestStreak: 8,
    startDate: "2026-06-18",
    lastCheckIn: "2026-06-21",
    isActive: true,
    createdAt: new Date("2026-06-18"),
  },
]

const streakSchema = z.object({
  title: z.string().min(1, "Habit name is required"),
  rules: z.string().optional(),
})

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—"
  return format(new Date(dateStr + "T00:00:00"), "MMM d, yyyy")
}

function daysBetween(from: string | null, to: string): number {
  if (!from) return 0
  const f = new Date(from + "T00:00:00")
  const t = new Date(to + "T00:00:00")
  return Math.floor((t.getTime() - f.getTime()) / (1000 * 60 * 60 * 24))
}

export function StreakItems() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState<StreakEntry[]>(INITIAL_STREAKS)
  const [searchQuery, setSearchQuery] = useState("")
  const [addOpen, setAddOpen] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(streakSchema),
    defaultValues: { title: "", rules: "" },
  })

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries
    const q = searchQuery.toLowerCase()
    return entries.filter((e) =>
      e.title.toLowerCase().includes(q) ||
      (e.rules ?? "").toLowerCase().includes(q)
    )
  }, [entries, searchQuery])

  const activeEntries = filteredEntries.filter((e) => e.isActive)
  const brokenEntries = filteredEntries.filter((e) => !e.isActive)

  const sortedActive = useMemo(
    () => [...activeEntries].sort((a, b) => {
      if (b.currentStreak !== a.currentStreak) return b.currentStreak - a.currentStreak
      return new Date(b.lastCheckIn ?? b.startDate).getTime() - new Date(a.lastCheckIn ?? a.startDate).getTime()
    }),
    [activeEntries]
  )

  function handleCheckIn(id: string) {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e
        const today = new Date()
        const todayStr = format(today, "yyyy-MM-dd")
        if (e.lastCheckIn === todayStr) return e
        if (e.lastCheckIn) {
          const diff = daysBetween(e.lastCheckIn, todayStr)
          if (diff > 1) {
            return { ...e, currentStreak: 1, lastCheckIn: todayStr, isActive: true }
          }
          const newStreak = e.currentStreak + 1
          return {
            ...e,
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, e.longestStreak),
            lastCheckIn: todayStr,
            isActive: true,
          }
        }
        return { ...e, currentStreak: 1, lastCheckIn: todayStr, isActive: true }
      })
    )
  }

  function handleBreak(id: string) {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, currentStreak: 0, isActive: false } : e
      )
    )
  }

  function handleRestart(id: string) {
    const today = format(new Date(), "yyyy-MM-dd")
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, currentStreak: 1, lastCheckIn: today, startDate: today, isActive: true }
          : e
      )
    )
  }

  function handleDelete(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  function handleAdd(data: { title: string; rules?: string }) {
    const today = format(new Date(), "yyyy-MM-dd")
    const newEntry: StreakEntry = {
      id: crypto.randomUUID(),
      title: `of ${data.title.trim().toLowerCase()}`,
      rules: data.rules ?? "",
      currentStreak: 1,
      longestStreak: 1,
      startDate: today,
      lastCheckIn: today,
      isActive: true,
      createdAt: new Date(),
    }
    setEntries((prev) => [newEntry, ...prev])
    reset()
    setAddOpen(false)
  }

  const totalActive = entries.filter((e) => e.isActive).length

  function StreakCard({ entry }: { entry: StreakEntry }) {
    const daysSinceStart = daysBetween(entry.startDate, format(new Date(), "yyyy-MM-dd"))
    const pctOfLongest = entry.longestStreak > 0
      ? Math.round((entry.currentStreak / entry.longestStreak) * 100)
      : 0

    return (
      <Card className={`border-white/10 bg-black/30 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all ${!entry.isActive ? "opacity-70" : ""}`}>
        <CardContent className="p-5">
          <div className="flex items-start gap-5">
            <div className="relative shrink-0">
              <div className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center ${entry.isActive ? "bg-gradient-to-br from-orange-500 to-amber-600" : "bg-white/10"}`}>
                <span className={`font-black leading-none ${entry.currentStreak >= 100 ? "text-3xl" : entry.currentStreak >= 10 ? "text-4xl" : "text-5xl"}`}>
                  {entry.currentStreak}
                </span>
                {entry.isActive && entry.currentStreak > 0 && (
                  <Flame className="w-4 h-4 text-yellow-200 mt-0.5" />
                )}
              </div>
              {entry.isActive && entry.currentStreak >= entry.longestStreak && entry.currentStreak > 1 && (
                <div className="absolute -top-2 -right-2">
                  <Trophy className="w-5 h-5 text-yellow-400 drop-shadow-lg" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="text-lg font-bold text-white truncate">
                  Day {entry.currentStreak} {entry.title}
                </h3>
                {!entry.isActive && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-medium shrink-0">
                    Broken
                  </span>
                )}
              </div>

              {entry.rules && (
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">{entry.rules}</p>
              )}

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Started {formatDate(entry.startDate)}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Last: {formatDate(entry.lastCheckIn)}
                </span>
                <span className="flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  Best: {entry.longestStreak} days
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  {daysSinceStart} days total
                </span>
              </div>

              {entry.longestStreak > 1 && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${entry.isActive ? "bg-gradient-to-r from-orange-500 to-amber-400" : "bg-white/20"}`}
                      style={{ width: `${Math.max(pctOfLongest, 2)}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 shrink-0">{pctOfLongest}% of best</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 flex-nowrap">
                {entry.isActive ? (
                  <Button
                    onClick={() => handleCheckIn(entry.id)}
                    size="sm"
                    className="h-8 text-xs shrink-0 bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:shadow-lg hover:shadow-orange-600/30"
                  >
                    <Flame className="w-3.5 h-3.5 mr-1" />
                    Check In
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleRestart(entry.id)}
                    size="sm"
                    className="h-8 text-xs shrink-0 bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:shadow-lg"
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    Restart
                  </Button>
                )}
                {entry.isActive && entry.currentStreak > 0 && (
                  <Button
                    onClick={() => handleBreak(entry.id)}
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs shrink-0 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                  >
                    Break
                  </Button>
                )}
                <Button
                  onClick={() => handleDelete(entry.id)}
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs shrink-0 text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
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
                <Flame className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 text-orange-400" />
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Streaks</h1>
              </div>
              <p className="text-white/80 text-xs sm:text-sm truncate">
                {totalActive} active streak{totalActive !== 1 ? "s" : ""} &middot;{" "}
                {entries.reduce((s, e) => s + e.currentStreak, 0)} total days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 z-10 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search streaks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-11 border-white/10 bg-black/30 backdrop-blur-xl text-white placeholder:text-slate-500"
            />
          </div>

          {/* Active Streaks */}
          {sortedActive.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                Active Streaks
              </h2>
              <div className="space-y-4">
                {sortedActive.map((entry) => (
                  <StreakCard key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          )}

          {/* Broken Streaks */}
          {brokenEntries.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                Broken Streaks
              </h2>
              <div className="space-y-4">
                {brokenEntries.map((entry) => (
                  <StreakCard key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          )}

          {entries.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex p-4 bg-black/30 backdrop-blur-xl rounded-full mb-4">
                <Flame className="w-10 h-10 text-orange-500" />
              </div>
              <p className="text-slate-300 font-medium">No streaks yet</p>
              <p className="text-sm text-slate-500 mt-1">              Start your first streak</p>
            </div>
          )}
        </div>
      </div>

      {/* FAB */}
      <button
        onClick={() => setAddOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Streak Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md mx-4 max-sm:p-4 bg-gradient-to-b from-zinc-900 to-zinc-950">
          <DialogHeader className="text-center">
              <DialogTitle className="flex items-center justify-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  New Streak
                </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAdd)} className="flex flex-col items-center gap-4 mt-2">
            <div className="w-full max-w-sm">
              <label className="text-xs text-slate-400 mb-1 block">I want a streak of...</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none">of </span>
                <Input
                  type="text"
                  placeholder="running, meditation, no sugar..."
                  {...register("title")}
                  className="w-full h-11 pl-10 bg-zinc-800/80 border-zinc-700 text-white placeholder:text-zinc-400 shadow-lg"
                />
              </div>
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message as string}</p>}
            </div>
            <div className="w-full max-w-sm">
              <label className="text-xs text-slate-400 mb-1 block">Rules (what breaks the streak?)</label>
              <Input
                type="text"
                placeholder="e.g. Run at least 2km every day"
                {...register("rules")}
                className="w-full h-11 bg-zinc-800/80 border-zinc-700 text-white placeholder:text-zinc-400 shadow-lg"
              />
            </div>
            <Button type="submit" className="w-full max-w-sm bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:shadow-lg transition-all cursor-pointer h-11">
                  <Flame className="w-5 h-5 mr-2" />
                  Start Streak
                </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
