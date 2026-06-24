import { useState, useEffect } from "react"
import { Check, X, ListTodo, ShoppingCart, User, Briefcase, MoreHorizontal, Cake, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUserCategories } from "@/lib/use-user-categories"
import type { Category } from "@/lib/types"

interface CategorySelectDialogProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
}

const ALL_CATEGORIES: Category[] = ["Todo", "Shopping", "Personal", "Work", "Others", "Birthday", "Streak"]

const CATEGORY_NAME_TO_ID: Record<string, string> = {
  Todo: "00000000-0000-0000-0000-000000000001",
  Shopping: "00000000-0000-0000-0000-000000000002",
  Personal: "00000000-0000-0000-0000-000000000003",
  Work: "00000000-0000-0000-0000-000000000004",
  Others: "00000000-0000-0000-0000-000000000005",
  Birthday: "00000000-0000-0000-0000-000000000006",
  Streak: "00000000-0000-0000-0000-000000000007",
}

const CATEGORY_ICON: Record<Category, typeof ListTodo> = {
  Todo: ListTodo,
  Shopping: ShoppingCart,
  Personal: User,
  Work: Briefcase,
  Others: MoreHorizontal,
  Birthday: Cake,
  Streak: Flame,
}

const COLOR_MAP: Record<Category, string> = {
  Todo: "from-purple-600 to-indigo-700",
  Shopping: "from-cyan-500 to-teal-600",
  Personal: "from-pink-500 to-rose-600",
  Work: "from-amber-500 to-orange-600",
  Others: "from-indigo-600 to-blue-700",
  Birthday: "from-pink-500 to-rose-600",
  Streak: "from-orange-500 to-amber-600",
}

export function CategorySelectDialog({
  open,
  onClose,
  title = "Choose Your Categories",
  description = "Select which categories you want to see. You can change this anytime.",
}: CategorySelectDialogProps) {
  const { selectedCategoryIds, setSelectedCategories } = useUserCategories()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open && selectedCategoryIds.length > 0) {
      setSelected(new Set(selectedCategoryIds))
    } else if (open) {
      setSelected(new Set())
    }
  }, [open, selectedCategoryIds])

  function toggle(categoryId: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  async function handleSave() {
    if (selected.size === 0) return
    setSaving(true)
    await setSelectedCategories(Array.from(selected))
    setSaving(false)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 pb-2">
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="text-sm text-slate-400 mt-1">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 pt-4">
          <div className="space-y-1.5">
            {ALL_CATEGORIES.map((cat) => {
              const catId = CATEGORY_NAME_TO_ID[cat]
              const isSelected = selected.has(catId)
              const Icon = CATEGORY_ICON[cat]
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggle(catId)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-white/20 bg-white/10"
                      : "border-white/5 bg-black/30 hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`relative w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${COLOR_MAP[cat]} shrink-0`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-medium ${isSelected ? "text-white" : "text-slate-400"}`}>
                      {cat}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-6 pt-2">
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving || selected.size === 0}
            className="w-full h-11 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-lg shadow-primary/30 active:scale-[0.98]"
          >
            {saving ? "Saving..." : `Save (${selected.size} selected)`}
          </Button>
        </div>
      </div>
    </div>
  )
}
