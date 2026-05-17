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
      className={`relative rounded-full transition-all duration-700 flex-shrink-0 flex items-center select-none ${
        compact ? 'w-11 h-6.5' : 'w-14 h-8'
      } ${
        enabled
          ? 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 shadow-[0_0_20px_rgba(239,68,68,0.35)] border border-red-400/20'
          : 'bg-foreground/10 hover:bg-foreground/15 border border-transparent'
      }`}
      aria-pressed={enabled}
      aria-label="Toggle roast mode"
    >
      {/* Background glowing aura */}
      {enabled && (
        <motion.span
          className="absolute inset-0 rounded-full bg-red-500/25 blur-md"
          animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Floating mechanical dial knob */}
      <motion.span
        className={`absolute rounded-full bg-white flex items-center justify-center shadow-md ${
          compact ? 'w-5.5 h-5.5' : 'w-6.5 h-6.5'
        } ${enabled ? 'right-0.5' : 'left-0.5'}`}
        layout
        transition={springSnappy}
      >
        {enabled ? (
          <motion.svg
            className="w-3.5 h-3.5 text-red-500"
            fill="currentColor"
            viewBox="0 0 24 24"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 18 }}
          >
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </motion.svg>
        ) : (
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-foreground/30"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.span>
    </button>
  )
}
