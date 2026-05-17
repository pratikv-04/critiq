'use client'

import { motion } from 'framer-motion'

export function DecorativeBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-background to-purple-50" />

      {/* Vertical line streaks */}
      <motion.div
        className="absolute top-0 left-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-blue-200/30 to-transparent"
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-0 right-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-purple-200/30 to-transparent"
        animate={{ x: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Subtle radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-blue-200/20 blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-purple-200/10 blur-3xl" />

      {/* Horizontal dividers */}
      <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="absolute bottom-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/5 to-transparent" />

      {/* Floating dots */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-1 h-1 bg-foreground/20 rounded-full"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 30}%`,
          }}
          animate={{
            y: [0, 20, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
          }}
        />
      ))}
    </div>
  )
}
