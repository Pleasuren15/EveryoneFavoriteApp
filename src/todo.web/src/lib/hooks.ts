import { useState, useEffect, useRef } from "react"

export function useCountUp(target: number, duration = 500): number {
  const [value, setValue] = useState(0)
  const prevTargetRef = useRef(0)

  useEffect(() => {
    const startValue = prevTargetRef.current
    prevTargetRef.current = target
    const diff = target - startValue
    if (diff === 0) {
      setValue(target)
      return
    }

    const startTime = performance.now()
    let rafId: number

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(startValue + diff * eased))

      if (progress < 1) {
        rafId = requestAnimationFrame(animate)
      }
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [target, duration])

  return value
}
