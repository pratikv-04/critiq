'use client'

import { motion } from 'framer-motion'
import { useId } from 'react'
import { useAnimatedScore } from '@/hooks/use-animated-score'
import { easePremium } from '@/lib/motion'

interface ScorecardProps {
  name: string
  score: number
  description: string
  index?: number
}

function getConfidence(score: number): { label: string; color: string } {
  if (score >= 80) return { label: 'Strong', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' }
  if (score >= 60) return { label: 'Fair', color: 'text-amber-700 bg-amber-50 border-amber-200' }
  return { label: 'Weak', color: 'text-orange-700 bg-orange-50 border-orange-200' }
}

function getStrokeColors(score: number): [string, string] {
  if (score >= 80) return ['#22c55e', '#10b981']
  if (score >= 60) return ['#eab308', '#f59e0b']
  return ['#ef4444', '#f97316']
}

export function Scorecard({ name, score, description, index = 0 }: ScorecardProps) {
  const gradientId = useId()
  const animatedScore = useAnimatedScore(score, 1200, 300 + index * 80)
  const confidence = getConfidence(score)
  const [c1, c2] = getStrokeColors(score)
  const circumference = 2 * Math.PI * 45

  return (
    <motion.div
      className="p-5 sm:p-6 rounded-xl border border-foreground/10 bg-card/80 backdrop-blur-sm group cursor-default hover:border-foreground/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-shadow duration-500"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: easePremium }}
      whileHover={{ y: -3 }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground text-sm leading-snug">{name}</h3>
          <span
            className={`inline-block mt-2 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${confidence.color}`}
          >
            {confidence.label}
          </span>
        </div>
        <div className="relative w-14 h-14 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-foreground/8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${circumference}` }}
              whileInView={{ strokeDasharray: `${(score / 100) * circumference} ${circumference}` }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.2 + index * 0.05, ease: easePremium }}
            />
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={c1} />
                <stop offset="100%" stopColor={c2} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-base font-bold text-foreground tabular-nums">
              {animatedScore}
            </span>
          </div>
        </div>
      </div>

      <motion.div
        className="h-1 rounded-full bg-foreground/6 overflow-hidden mb-3"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${c1}, ${c2})`,
          }}
          initial={{ width: 0 }}
          whileInView={{ width: `${score}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.25 + index * 0.05, ease: easePremium }}
        />
      </motion.div>

      <p className="text-xs text-foreground/55 leading-relaxed">{description}</p>
    </motion.div>
  )
}
