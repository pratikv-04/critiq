'use client'

import { motion } from 'framer-motion'
import { easePremium, fadeUp } from '@/lib/motion'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  retryLabel?: string
}

export function ErrorState({
  title = 'Diagnostics suspended',
  message,
  onRetry,
  retryLabel = 'Trace steps back',
}: ErrorStateProps) {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-gradient-to-b from-slate-500/[0.01] via-background to-transparent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="max-w-md w-full text-center flex flex-col items-center"
        {...fadeUp}
        transition={{ duration: 0.75, ease: easePremium }}
      >
        {/* Futuristic geometric visual alignment icon */}
        <div className="relative mb-8 w-16 h-16 rounded-2xl bg-foreground/[0.03] border border-foreground/8 flex items-center justify-center group overflow-hidden">
          {/* Subtle spinning background grid */}
          <motion.div
            className="absolute inset-0 border border-dashed border-foreground/5 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          />
          <svg
            className="w-6 h-6 text-foreground/45 relative z-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.2}
              d="M12 9v3.75m0 3.75h.008v.008H12v-.008zM12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707"
            />
          </svg>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground mb-3 tracking-tight">
          {title}
        </h2>
        <p className="text-foreground/50 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
          {message}
        </p>

        {onRetry && (
          <motion.button
            onClick={onRetry}
            className="px-8 py-3.5 rounded-full bg-foreground text-background font-medium shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-shadow duration-500"
            whileHover={{ scale: 1.015, y: -0.5 }}
            whileTap={{ scale: 0.985 }}
            transition={{ type: 'spring', stiffness: 380, damping: 25 }}
          >
            {retryLabel}
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  )
}
