'use client'

import { motion } from 'framer-motion'
import { easePremium } from '@/lib/motion'
import type { ReactNode } from 'react'

interface RevealSectionProps {
  children: ReactNode
  delay?: number
  className?: string
}

/** Curated section entrance for results page. */
export function RevealSection({ children, delay = 0, className }: RevealSectionProps) {
  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay, ease: easePremium }}
    >
      {children}
    </motion.section>
  )
}
