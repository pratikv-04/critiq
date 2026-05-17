/** Apple-like easing — restrained, intentional motion. */
export const easePremium = [0.22, 1, 0.36, 1] as const
export const easeOutSoft = [0.25, 0.1, 0.25, 1] as const

export const springSnappy = { type: 'spring' as const, stiffness: 400, damping: 30 }
export const springGentle = { type: 'spring' as const, stiffness: 120, damping: 20 }
export const springSoft = { type: 'spring' as const, stiffness: 80, damping: 18 }

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
}

/** Stagger delay for child index (seconds). */
export function staggerDelay(index: number, base = 0.08): number {
  return index * base
}

/** Section reveal delay for results page (seconds). */
export const RESULTS_REVEAL = {
  summary: 0,
  scores: 0.35,
  positives: 0.65,
  issues: 0.95,
  suggestions: 1.25,
  roast: 1.55,
  footer: 1.85,
} as const
