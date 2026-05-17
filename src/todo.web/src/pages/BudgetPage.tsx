import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Wallet, Trash2, Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
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

const expenseCategories: string[] = ["Food", "Transport", "Entertainment", "Bills", "Shopping", "Health", "Education", "Other"]
const months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const currentYear: number = new Date().getFullYear()
const years: number[] = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

const budgetSchema = z.object({
  entryType: z.enum(["income", "expense"]),
  entryCategory: z.string(),
  amount: z.string().refine((v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0, "Amount must be a positive number"),
  description: z.string().min(2, "Description must be at least 2 characters"),
})

export function BudgetPage() {
  const navigate = useNavigate()
  const { entries, addEntry, deleteEntry } = useBudget()
  const [loading, setLoading] = useState(true)

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      entryType: "expense",
      entryCategory: "Food",
      amount: "",
      description: "",
    },
  })
  const entryType = watch("entryType")

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 300)
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

  const onSubmit = (data: z.infer<typeof budgetSchema>) => {
    addEntry({
      type: data.entryType,
      category: data.entryType === "income" ? "Income" : data.entryCategory,
      amount: parseFloat(data.amount),
      description: data.description.trim(),
      date: new Date().toISOString().slice(0, 10),
    })
    reset()
  }

  return (
    <div className="h-svh flex flex-col font-sans">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <Button
              onClick={() => navigate("/todos")}
              variant="ghost"
              size="icon"
              className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 rounded-lg flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-white flex-shrink-0" />
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">Budget Tracker</h1>
              </div>
              <p className="text-white/80 text-xs sm:text-sm truncate">Manage your income and expenses</p>
            </div>
          </div>

          {/* Month/Year Selector */}
          <div className="flex gap-2 flex-wrap">
            <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
              <SelectTrigger className="w-36 sm:w-40 bg-white/20 backdrop-blur-sm border-white/30 text-white text-xs sm:text-sm cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((m, i) => (
                  <SelectItem key={m} value={String(i)}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(Number(v))}>
              <SelectTrigger className="w-24 sm:w-28 bg-white/20 backdrop-blur-sm border-white/30 text-white text-xs sm:text-sm cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-8">
          {loading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-24" />
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Skeleton className="lg:col-span-2 h-96" />
                <Skeleton className="h-96" />
              </div>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Income Card */}
                <Card className="border-emerald-500/20 bg-black/30 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-start gap-3">
                      <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-md">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-emerald-400 font-medium uppercase tracking-wider">Income</p>
                        <p className="text-2xl font-bold text-white mt-1">R{filteredIncome.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Expenses Card */}
                <Card className="border-red-500/20 bg-black/30 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-start gap-3">
                      <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-md">
                        <TrendingDown className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-red-400 font-medium uppercase tracking-wider">Expenses</p>
                        <p className="text-2xl font-bold text-white mt-1">R{filteredExpenses.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Balance Card */}
                <Card className="border-0 bg-black/30 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-start gap-3">
                      <div className={`p-3 rounded-lg shadow-md bg-gradient-to-br ${
                        filteredBalance >= 0
                          ? 'from-blue-500 to-blue-600'
                          : 'from-orange-500 to-orange-600'
                      }`}>
                        <Wallet className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className={`text-xs font-medium uppercase tracking-wider ${
                          filteredBalance >= 0
                            ? 'text-blue-400'
                            : 'text-orange-400'
                        }`}>Balance</p>
                        <p className={`text-2xl font-bold mt-1 ${
                          filteredBalance >= 0
                            ? 'text-white'
                            : 'text-white'
                        }`}>R{filteredBalance.toFixed(2)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts and Entries */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pie Chart */}
                <div className="lg:col-span-2">
                  <Card className="border-white/10 bg-black/30 backdrop-blur-xl shadow-lg">
                    <CardContent className="pt-8 pb-6">
                      <h2 className="text-lg font-semibold text-white mb-6">Expense Breakdown</h2>
                      {chartData.length > 0 ? (
                        <div className="h-72 flex items-center justify-center">
                          <BudgetPieChart data={chartData} />
                        </div>
                      ) : (
                        <div className="h-72 flex items-center justify-center">
                          <p className="text-slate-300 text-sm">No expense data for this period</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Add Entry Form */}
                <Card className="border-white/10 bg-black/30 backdrop-blur-xl shadow-lg h-fit">
                  <CardContent className="pt-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Add Entry</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <Controller
                        name="entryType"
                        control={control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="border-white/10 cursor-pointer">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="income">Income</SelectItem>
                              <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />

                      {entryType === "expense" && (
                        <Controller
                          name="entryCategory"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="border-white/10 cursor-pointer">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {expenseCategories.map((cat) => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      )}

                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 font-semibold">R</span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          {...register("amount")}
                          className="pl-8 border-white/10 bg-black/30 backdrop-blur-xl text-white"
                        />
                      </div>
                      {errors.amount && (
                        <p className="text-red-400 text-xs mt-1">{errors.amount.message}</p>
                      )}

                      <Input
                        type="text"
                        placeholder="Description"
                        {...register("description")}
                        className="border-white/10 bg-black/30 backdrop-blur-xl text-white"
                      />
                      {errors.description && (
                        <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-amber-700 to-amber-600 text-white hover:shadow-lg transition-all"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Entry
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Entries List */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-4">Recent Entries</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredEntries.length === 0 ? (
                    <Card className="border-white/10 bg-black/30 backdrop-blur-xl shadow-lg">
                      <CardContent className="pt-8 pb-8 text-center">
                        <p className="text-slate-300 text-sm">No entries for this period</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filteredEntries
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((entry) => (
                        <Card
                          key={`${entry.date}-${entry.description}`}
                          className="border-white/10 bg-black/30 backdrop-blur-xl shadow-lg hover:shadow-md transition-all group"
                        >
                          <CardContent className="p-4 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className={`p-2 rounded-lg flex-shrink-0 ${
                                entry.type === "income"
                                  ? 'bg-emerald-500/20'
                                  : 'bg-slate-500/20'
                              }`}>
                                {entry.type === "income" ? (
                                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                                ) : (
                                  <DollarSign className="w-5 h-5 text-slate-300" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{entry.description}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{entry.category}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <p className={`text-sm font-semibold ${
                                entry.type === "income"
                                  ? 'text-emerald-400'
                                  : 'text-slate-300'
                              }`}>
                                {entry.type === "income" ? "+" : "-"}R{entry.amount.toFixed(2)}
                              </p>
                              <button
                                onClick={() => deleteEntry(`${entry.date}-${entry.description}`)}
                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 transition-all flex-shrink-0 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
