import { useState } from "react"
import { Plus, Circle, CheckCircle2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Todo } from "@/lib/types"

interface SubtaskSectionProps {
  todo: Todo
  onToggle: (todoId: string, subtaskId: string) => void
  onAdd: (todoId: string, text: string) => void
}

export function SubtaskSection({ todo, onToggle, onAdd }: SubtaskSectionProps) {
  const [input, setInput] = useState("")

  const handleAdd = () => {
    const text = input.trim()
    if (!text) return
    onAdd(todo.id, text)
    setInput("")
  }

  const sorted = [...(todo.subtasks ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)
  if (sorted.length === 0 && !todo.completed) {
    return (
      <div className="mt-3 pl-2">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Add a subtask..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd() } }}
            className="h-8 text-xs border-white/5 bg-white/5 text-white placeholder:text-slate-500"
          />
          <button
            onClick={handleAdd}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-3 pl-2 space-y-1">
      {sorted.map((st) => (
        <div key={st.id} className="flex items-center gap-2 group/sub">
          <button
            onClick={() => onToggle(todo.id, st.id)}
            className="flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-all cursor-pointer"
          >
            {st.completed ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>
          <span className={`text-xs flex-1 ${st.completed ? "line-through text-slate-500" : "text-slate-300"}`}>
            {st.text}
          </span>
        </div>
      ))}
      {!todo.completed && (
        <div className="flex gap-2 pt-1">
          <Input
            type="text"
            placeholder="Add a subtask..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd() } }}
            className="h-8 text-xs border-white/5 bg-white/5 text-white placeholder:text-slate-500"
          />
          <button
            onClick={handleAdd}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}
