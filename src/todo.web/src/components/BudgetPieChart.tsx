import { useMemo } from "react"
import type { BudgetCategory } from "@/lib/types"

interface Slice {
  label: string
  value: number
  color: string
}

interface BudgetPieChartProps {
  data: Slice[]
  size?: number
}

const COLORS: Record<BudgetCategory, string> = {
  Income: "#22c55e",
  Food: "#f97316",
  Transport: "#3b82f6",
  Entertainment: "#a855f7",
  Bills: "#ef4444",
  Shopping: "#ec4899",
  Health: "#14b8a6",
  Education: "#eab308",
  Other: "#6b7280",
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const x1 = cx + r * Math.cos(startAngle)
  const y1 = cy + r * Math.sin(startAngle)
  const x2 = cx + r * Math.cos(endAngle)
  const y2 = cy + r * Math.sin(endAngle)
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
}

export function BudgetPieChart({ data, size = 180 }: BudgetPieChartProps) {
  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data])

  const slices = useMemo(() => {
    if (total === 0) return []
    let currentAngle = -Math.PI / 2
    return data.map((d) => {
      const sliceAngle = (d.value / total) * 2 * Math.PI
      const start = currentAngle
      const end = currentAngle + sliceAngle
      currentAngle = end
      return { ...d, path: describeArc(size / 2, size / 2, size / 2 - 2, start, end), percentage: (d.value / total) * 100 }
    })
  }, [data, total, size])

  if (total === 0) {
    return (
      <div className="flex flex-col items-center gap-3">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
          <circle cx={size / 2} cy={size / 2} r={size / 2 - 2} fill="none" stroke="#e5e7eb" strokeWidth="2" />
          <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" className="fill-neutral-400 text-xs font-mono">No data</text>
        </svg>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        {slices.map((slice, i) => (
          <path key={i} d={slice.path} fill={slice.color || "#6b7280"} stroke="#fff" strokeWidth="1.5" className="hover:opacity-80 transition-opacity" />
        ))}
        <circle cx={size / 2} cy={size / 2} r={size / 4} fill="#fff" />
        <text x={size / 2} y={size / 2 - 4} textAnchor="middle" dominantBaseline="central" className="fill-neutral-800 text-sm font-bold">
          R{total.toFixed(0)}
        </text>
        <text x={size / 2} y={size / 2 + 12} textAnchor="middle" dominantBaseline="central" className="fill-neutral-400 text-[9px] font-mono">
          total
        </text>
      </svg>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
        {slices.map((slice, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 shrink-0" style={{ backgroundColor: slice.color || "#6b7280" }} />
            <span className="text-[11px] text-neutral-600 font-medium">{slice.label}</span>
            <span className="text-[11px] text-neutral-400 font-mono">{slice.percentage.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { COLORS }
