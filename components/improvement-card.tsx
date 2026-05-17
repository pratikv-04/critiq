'use client'

import { motion } from 'framer-motion'
import type { Improvement } from '@/lib/types'
import { easePremium } from '@/lib/motion'

interface ImprovementCardProps {
  improvement: Improvement
  index?: number
}

export function ImprovementCard({ improvement, index = 0 }: ImprovementCardProps) {
  return (
    <motion.div
      className="p-5 sm:p-6 rounded-xl border border-foreground/10 bg-card/60 hover:border-foreground/15 hover:shadow-[0_6px_24px_rgba(0,0,0,0.03)] transition-shadow duration-400 group"
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-foreground/5 border border-foreground/10 flex items-center justify-center text-xs font-semibold text-foreground/50 tabular-nums">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground mb-2 leading-snug">
            {improvement.title}
          </h3>
          <p className="text-foreground/60 text-sm mb-4 leading-relaxed">
            {improvement.description}
          </p>
          <motion.span
            className="inline-block text-xs font-medium text-foreground/70 bg-foreground/5 border border-foreground/10 px-2.5 py-1 rounded-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, ease: easePremium }}
          >
            Impact · {improvement.impact}
          </motion.span>
        </div>
      </div>
    </motion.div>
  )
}
