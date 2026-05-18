'use client'

import { motion } from 'framer-motion'
import { useApp } from '@/lib/app-context'
import { DecorativeBackground } from './decorative-background'

export function Landing() {
  const { setCurrentState } = useApp()

  const handleAnalyze = () => {
    setCurrentState('upload')
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <DecorativeBackground />
      
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex items-center px-6 py-6 sm:px-12 sm:py-8">
          <div className="font-serif text-2xl font-medium text-foreground tracking-wide">
            Critiq
          </div>
        </nav>

        {/* Hero Section */}
        <motion.div 
          className="flex flex-col items-center justify-center px-4 py-16 sm:py-24"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Headline */}
          <div className="max-w-2xl text-center mb-6 sm:mb-8">
            <h1 className="font-serif text-5xl sm:text-7xl font-normal text-foreground leading-tight tracking-tight">
              Intelligent UX Auditing in Seconds
            </h1>
          </div>

          {/* Subheadline */}
          <motion.p
            className="text-center text-lg sm:text-xl text-foreground/70 max-w-xl mb-10 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Upload any interface and get AI-powered UX insights, feedback, and recommendations instantly.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 mb-16"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <motion.button
              onClick={handleAnalyze}
              className="px-8 py-4 bg-foreground text-background rounded-full font-medium shadow-lg"
              whileHover={{ scale: 1.02, boxShadow: '0 12px 40px rgba(0,0,0,0.12)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            >
              Analyze Design
            </motion.button>
          </motion.div>

          {/* Decorative elements - Dashboard preview */}
          <motion.div
            className="relative w-full max-w-3xl h-96 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {/* Central dashboard mockup */}
            <div className="relative w-full h-full max-w-lg">
              {/* Main dashboard card */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md border border-white/60 shadow-2xl p-6"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-lg font-normal text-foreground">Design Analysis</h3>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  </div>
                </div>
                
                {/* Dashboard content */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gradient-to-r from-green-300 to-transparent rounded-full"></div>
                    <span className="text-xs font-medium text-green-600">Accessibility</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gradient-to-r from-blue-300 to-transparent rounded-full"></div>
                    <span className="text-xs font-medium text-blue-600">Hierarchy</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gradient-to-r from-yellow-300 to-transparent rounded-full"></div>
                    <span className="text-xs font-medium text-yellow-600">Usability</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating feedback card 1 - top right */}
              <motion.div
                className="absolute -top-8 right-0 w-44 rounded-xl bg-white/90 backdrop-blur-sm border border-white/80 shadow-lg p-4"
                animate={{ y: [0, 8, 0], rotate: [0, 2, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0 }}
              >
                <p className="text-xs font-semibold text-foreground mb-1">Clarity Issue</p>
                <p className="text-xs text-foreground/70">Button text is too small. Increase to 14px.</p>
              </motion.div>

              {/* Floating feedback card 2 - bottom left */}
              <motion.div
                className="absolute -bottom-8 left-0 w-44 rounded-xl bg-white/90 backdrop-blur-sm border border-white/80 shadow-lg p-4"
                animate={{ y: [0, -8, 0], rotate: [0, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                <p className="text-xs font-semibold text-foreground mb-1">Color Contrast</p>
                <p className="text-xs text-foreground/70">WCAG AA compliance failed.</p>
              </motion.div>

              {/* Floating feedback card 3 - bottom right */}
              <motion.div
                className="absolute bottom-2 -right-8 w-44 rounded-xl bg-white/90 backdrop-blur-sm border border-white/80 shadow-lg p-4"
                animate={{ y: [0, 6, 0], rotate: [0, 1, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
              >
                <p className="text-xs font-semibold text-foreground mb-1">Great UX</p>
                <p className="text-xs text-foreground/70">Excellent white space usage.</p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Trust indicator */}
        <motion.div
          className="text-center py-12 text-sm text-foreground/50 opacity-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
        </motion.div>
      </div>
    </div>
  )
}
