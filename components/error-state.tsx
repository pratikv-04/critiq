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
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
}: ErrorStateProps) {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-md w-full text-center"
        {...fadeUp}
        transition={{ duration: 0.6, ease: easePremium }}
      >
        <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-foreground/5 border border-foreground/10 flex items-center justify-center">
          <svg
            className="w-7 h-7 text-foreground/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {title}
        </h2>
        <p className="text-foreground/60 text-sm leading-relaxed mb-8 max-w-sm mx-auto">
          {message}
        </p>
        {onRetry && (
          <motion.button
            onClick={onRetry}
            className="px-8 py-3.5 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {retryLabel}
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  )
}
