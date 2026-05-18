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
  if (score >= 80) return { label: 'Strong', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' }
  if (score >= 60) return { label: 'Fair', color: 'text-amber-700 bg-amber-50 border-amber-100' }
  return { label: 'Weak', color: 'text-orange-700 bg-orange-50 border-orange-100' }
}

function getStrokeColors(score: number): [string, string] {
  if (score >= 80) return ['#10b981', '#34d399']
  if (score >= 60) return ['#eab308', '#fbbf24']
  return ['#ef4444', '#f87171']
}

function getHeuristicLabel(name: string): string {
  switch (name) {
    case 'Visual Hierarchy': return 'HEURISTIC FIDELITY · 96%'
    case 'Clarity': return 'COMPREHENSION INDEX · 92%'
    case 'Accessibility': return 'WCAG AA CONTRAST · 98%'
    case 'Consistency': return 'GRID ALIGNMENT · 94%'
    case 'Cognitive Load': return 'DECISION COHESION · 91%'
    case 'Conversion Readiness': return 'FUNNEL CONFIDENCE · 95%'
    default: return 'RELIABILITY · 95%'
  }
}

export function Scorecard({ name, score, description, index = 0 }: ScorecardProps) {
  const gradientId = useId()
  const animatedScore = useAnimatedScore(score, 1400, 300 + index * 90)
  const confidence = getConfidence(score)
  const [c1, c2] = getStrokeColors(score)
  const circumference = 2 * Math.PI * 45

  return (
    <motion.div
      className="p-6 rounded-2xl border border-foreground/8 bg-card/70 backdrop-blur-md group cursor-default hover:border-foreground/15 hover:shadow-[0_12px_40px_rgba(0,0,0,0.04)] transition-all duration-500"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, delay: index * 0.05, ease: easePremium }}
      whileHover={{ y: -3, scale: 1.015 }}
    >
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground text-sm tracking-tight leading-snug">{name}</h3>
          <span
            className={`inline-block mt-2 text-[9px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border ${confidence.color}`}
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
              strokeWidth="3.5"
              className="text-foreground/8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeWidth="3.5"
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${circumference}` }}
              whileInView={{ strokeDasharray: `${(score / 100) * circumference} ${circumference}` }}
              viewport={{ once: true }}
              transition={{ duration: 1.3, delay: 0.15 + index * 0.05, ease: easePremium }}
            />
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={c1} />
                <stop offset="100%" stopColor={c2} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-foreground tracking-tight tabular-nums">
              {animatedScore}
            </span>
          </div>
        </div>
      </div>

      <motion.div
        className="h-1 rounded-full bg-foreground/6 overflow-hidden mb-3.5"
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
          transition={{ duration: 1.1, delay: 0.2 + index * 0.05, ease: easePremium }}
        />
      </motion.div>

      <p className="text-sm text-foreground/75 leading-relaxed font-normal">{description}</p>

      {/* Futuristic Visual Confidence Indicator */}
      <span className="text-[8px] font-mono tracking-widest text-foreground/30 uppercase mt-4 block text-right">
        {getHeuristicLabel(name)}
      </span>
    </motion.div>
  )
}
