import { useState, useMemo, useEffect, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Wallet, Trash2, Plus } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useBudget } from "@/lib/use-budget"
import { BudgetPieChart, COLORS } from "@/components/BudgetPieChart"

const expenseCategories = ["Food", "Transport", "Entertainment", "Bills", "Shopping", "Health", "Education", "Other"]
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const currentYear = new Date().getFullYear()
const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

export function BudgetPage() {
  const navigate = useNavigate()
  const { entries, addEntry, deleteEntry } = useBudget()
  const [loading, setLoading] = useState(true)

  const [entryType, setEntryType] = useState<"income" | "expense">("expense")
  const [entryCategory, setEntryCategory] = useState("Food")
  const [entryAmount, setEntryAmount] = useState("")
  const [entryDescription, setEntryDescription] = useState("")

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const filteredEntries = useMemo(
    () => entries.filter((e) => {
      const d = new Date(e.date + "T00:00:00")
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear
    }),
    [entries, selectedMonth, selectedYear]
  )

  const filteredIncome = filteredEntries.filter((e) => e.type === "income").reduce((s, e) => s + e.amount, 0)
  const filteredExpenses = filteredEntries.filter((e) => e.type === "expense").reduce((s, e) => s + e.amount, 0)
  const filteredBalance = filteredIncome - filteredExpenses

  const filteredExpenseByCategory = filteredEntries
    .filter((e) => e.type === "expense")
    .reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount
      return acc
    }, {})

  const chartData = [
    ...(filteredIncome > 0 ? [{ label: "Income", value: filteredIncome, color: COLORS.Income }] : []),
    ...Object.entries(filteredExpenseByCategory).map(([cat, val]) => ({
      label: cat, value: val, color: COLORS[cat] || COLORS.Other,
    })),
  ]

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(entryAmount)
    if (!amount || amount <= 0) return
    if (!entryDescription.trim()) return
    addEntry({
      type: entryType,
      category: entryType === "income" ? "Income" : entryCategory,
      amount,
      description: entryDescription.trim(),
      date: new Date().toISOString().slice(0, 10),
    })
    setEntryAmount("")
    setEntryDescription("")
  }

  return (
    <div className="h-svh flex flex-col bg-white">

      <div className="relative bg-emerald-600 px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate("/todos")}
            className="p-2 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
              <SelectTrigger className="w-32 bg-white/15 backdrop-blur-sm border-white/20 text-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-md border-emerald-200">
                {months.map((name, i) => (
                  <SelectItem key={i} value={String(i)} className="text-emerald-800">{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
              <SelectTrigger className="w-24 bg-white/15 backdrop-blur-sm border-white/20 text-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/95 backdrop-blur-md border-emerald-200">
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)} className="text-emerald-800">{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 backdrop-blur-sm">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Budget</h1>
            <p className="text-sm text-emerald-200/70">
              {months[selectedMonth]} {selectedYear}
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex-1 px-4 py-4 overflow-y-auto space-y-4">
        {loading ? (
          <>
            <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 p-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-center">
                  <Skeleton className="w-[180px] h-[180px] rounded-full" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-emerald-100">
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="p-4 space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 p-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-center">
                  {filteredEntries.length > 0 ? (
                    <BudgetPieChart data={chartData} />
                  ) : (
                    <div className="text-center py-8">
                      <Wallet className="w-12 h-12 text-emerald-200 mx-auto mb-2" />
                      <p className="text-emerald-400 text-sm">No entries for {months[selectedMonth]} {selectedYear}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-emerald-700">Total Income</span>
                      <span className="font-mono font-semibold text-emerald-600">R{filteredIncome.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <span className="text-emerald-700">Total Expenses</span>
                      <span className="font-mono font-semibold text-red-500">-R{filteredExpenses.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-emerald-100 pt-2 flex justify-between text-sm items-center">
                      <span className="font-semibold text-emerald-800">Balance</span>
                      <span className={`font-mono font-bold ${filteredBalance >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {filteredBalance >= 0 ? "+" : ""}R{filteredBalance.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="flex gap-2">
                      <Select value={entryType} onValueChange={(v) => setEntryType(v as "income" | "expense")}>
                        <SelectTrigger className="flex-1 bg-white border-emerald-200 text-emerald-800">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-emerald-200">
                          <SelectItem value="income" className="text-emerald-700">Income</SelectItem>
                          <SelectItem value="expense" className="text-emerald-700">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex-1 relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-mono text-emerald-400">R</span>
                        <input
                          type="number" step="0.01" min="0" placeholder="0.00"
                          value={entryAmount} onChange={(e) => setEntryAmount(e.target.value)}
                          className="w-full pl-7 pr-3 py-2 bg-white border border-emerald-200 text-emerald-800 placeholder:text-emerald-300 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text" placeholder="Description"
                        value={entryDescription} onChange={(e) => setEntryDescription(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-emerald-200 text-emerald-800 placeholder:text-emerald-300 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      />
                      {entryType === "expense" && (
                        <Select value={entryCategory} onValueChange={setEntryCategory}>
                          <SelectTrigger className="w-28 bg-white border-emerald-200 text-emerald-800">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white border-emerald-200">
                            {expenseCategories.map((cat) => (
                              <SelectItem key={cat} value={cat} className="text-emerald-700">{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Entry
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm border border-emerald-100 overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-emerald-100 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Entries</h3>
                <span className="text-[10px] font-mono text-emerald-400">{filteredEntries.length} entries</span>
              </div>
              <div className="divide-y divide-emerald-50 max-h-60 overflow-y-auto">
                {filteredEntries.length === 0 ? (
                  <div className="text-center py-8">
                    <Wallet className="w-10 h-10 text-emerald-200 mx-auto mb-2" />
                    <p className="text-emerald-400 text-sm">No entries for {months[selectedMonth]} {selectedYear}</p>
                  </div>
                ) : (
                  [...filteredEntries].reverse().map((entry) => (
                    <div key={entry.id} className="group flex items-center justify-between px-4 py-2.5 hover:bg-emerald-50/50 transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm text-emerald-800 truncate">{entry.description}</span>
                        <span className="text-[10px] font-mono text-emerald-400 shrink-0">{entry.category}</span>
                        <span className="text-[10px] font-mono text-emerald-300">{entry.date}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-mono font-semibold ${entry.type === "income" ? "text-emerald-600" : "text-red-500"}`}>
                          {entry.type === "income" ? "+" : "-"}R{entry.amount.toFixed(2)}
                        </span>
                        <button onClick={() => deleteEntry(entry.id)} className="opacity-0 group-hover:opacity-100 p-1 text-emerald-300 hover:text-red-500 transition-all">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
