'use client'

import { motion } from 'framer-motion'
import type { ScorecardData } from '@/lib/types'
import { useAnimatedScore } from '@/hooks/use-animated-score'
import { easePremium } from '@/lib/motion'

interface AuditSummaryProps {
  scorecards: ScorecardData[]
  screenshotUrl: string
  isRoastMode: boolean
  headline?: string
  safeVerdictScore: number
}

function getGrade(score: number): { label: string; description: string } {
  if (score >= 85) return { label: 'Excellent', description: 'Ship-ready with minor polish' }
  if (score >= 72) return { label: 'Strong', description: 'Solid foundation — targeted fixes will elevate' }
  if (score >= 58) return { label: 'Developing', description: 'Clear opportunities to reduce friction' }
  return { label: 'Needs work', description: 'Priority UX issues are holding the experience back' }
}

export function AuditSummary({
  scorecards,
  screenshotUrl,
  isRoastMode,
  headline,
  safeVerdictScore,
}: AuditSummaryProps) {
  const safeVerdictScore = Number.isFinite(Number(safeVerdictScore))
  ? Number(safeVerdictScore)
  : 72

const animatedOverall = useAnimatedScore(safeVerdictScore, 1600, 200)
const grade = getGrade(safeVerdictScore)

  return (
    <motion.div
      className={`rounded-2xl border overflow-hidden ${
        isRoastMode
          ? 'border-red-200/60 bg-gradient-to-br from-red-50/50 via-background to-orange-50/30'
          : 'border-foreground/10 bg-gradient-to-br from-foreground/[0.02] to-transparent'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: easePremium }}
    >
      <motion.div className="grid md:grid-cols-2 gap-0">
        <motion.div
          className="relative aspect-video md:aspect-auto md:min-h-[220px] bg-foreground/5 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <img
            src={screenshotUrl}
            alt="Analyzed design"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/10 md:to-background/30 pointer-events-none" />
        </motion.div>

        <motion.div
          className="p-6 sm:p-8 flex flex-col justify-center"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: easePremium }}
        >
          <p className="text-xs font-medium tracking-[0.15em] uppercase text-foreground/40 mb-3">
            Overall UX score
          </p>
          <div className="flex items-end gap-3 mb-2">
            <span className="font-serif text-5xl sm:text-6xl font-bold text-foreground tabular-nums">
              {animatedOverall}
            </span>
            <span className="text-foreground/40 text-lg mb-2">/ 100</span>
          </div>
          <p className="font-medium text-foreground mb-1">{grade.label}</p>
          <p className="text-sm text-foreground/55 leading-relaxed mb-4">
            {headline || grade.description}
          </p>
          <div className="h-1.5 rounded-full bg-foreground/8 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                verdictScore >= 80
                  ? 'bg-emerald-500'
                  : verdictScore >= 60
                    ? 'bg-amber-500'
                    : 'bg-orange-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${verdictScore}%` }}
              transition={{ duration: 1.2, delay: 0.3, ease: easePremium }}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
