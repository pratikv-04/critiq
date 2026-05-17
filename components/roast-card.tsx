'use client'

import { motion } from 'framer-motion'
import { easePremium } from '@/lib/motion'

interface RoastCardProps {
  roast: string
}

export function RoastCard({ roast }: RoastCardProps) {
  return (
    <motion.div
      className="relative p-6 sm:p-8 rounded-2xl overflow-hidden border border-red-200/70 bg-gradient-to-br from-red-50 via-orange-50/50 to-red-50/30"
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: easePremium }}
    >
      {/* Glow */}
      <motion.div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-red-300/25 blur-3xl pointer-events-none"
        animate={{ opacity: [0.3, 0.55, 0.3], scale: [1, 1.15, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-16 -left-16 w-36 h-36 rounded-full bg-orange-300/20 blur-3xl pointer-events-none"
        animate={{ opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="relative z-10">
        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <span className="text-lg" aria-hidden>
            🔥
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-red-950 tracking-tight">
            The roast
          </h2>
          <motion.span
            className="ml-auto text-[10px] font-semibold uppercase tracking-widest text-red-600/70 px-2 py-1 rounded-full border border-red-200/80 bg-white/50"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Event
          </motion.span>
        </motion.div>
        <motion.p
          className="text-red-900/90 leading-relaxed text-sm sm:text-base"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {roast}
        </motion.p>
      </div>
    </motion.div>
  )
}
