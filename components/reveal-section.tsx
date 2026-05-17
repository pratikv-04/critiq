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
      initial={{ opacity: 0, y: 24, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.85, delay: delay * 0.7, ease: easePremium }}
    >
      {children}
    </motion.section>
  )
}
