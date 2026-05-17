'use client'

import { motion } from 'framer-motion'
import { springSnappy } from '@/lib/motion'

interface RoastToggleProps {
  enabled: boolean
  onChange: (value: boolean) => void
  compact?: boolean
}

export function RoastToggle({ enabled, onChange, compact }: RoastToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative rounded-full transition-shadow duration-500 flex-shrink-0 ${
        compact ? 'w-11 h-6' : 'w-12 h-7'
      } ${
        enabled
          ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-[0_0_20px_rgba(239,68,68,0.45)]'
          : 'bg-foreground/15 hover:bg-foreground/20'
      }`}
      aria-pressed={enabled}
      aria-label="Toggle roast mode"
    >
      {enabled && (
        <motion.span
          className="absolute inset-0 rounded-full bg-red-400/30 blur-md"
          animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <motion.span
        className={`absolute top-0.5 rounded-full bg-white shadow-sm ${
          compact ? 'w-5 h-5' : 'w-5 h-5'
        }`}
        layout
        transition={springSnappy}
        style={{ left: enabled ? (compact ? 22 : 22) : 2 }}
      />
    </button>
  )
}
