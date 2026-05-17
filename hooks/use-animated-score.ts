'use client'

import { useEffect, useState } from 'react'

/**
 * Smooth count-up for score displays.
 */
export function useAnimatedScore(target: number, duration = 1400, delay = 0): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frame: number
    let start: number | null = null

    const timeout = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (start === null) start = timestamp
        const elapsed = timestamp - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Math.round(eased * target))

        if (progress < 1) {
          frame = requestAnimationFrame(animate)
        }
      }
      frame = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(frame)
    }
  }, [target, duration, delay])

  return value
}
