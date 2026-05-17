'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  getAnalysisSteps,
  ROAST_STATUS_MESSAGES,
  STANDARD_STATUS_MESSAGES,
  type AnalysisStep,
} from '@/lib/analysis-messages'
import { easePremium, fadeIn } from '@/lib/motion'

interface CinematicAnalysisProps {
  isRoastMode: boolean
  previewUrl: string | null
  activeStep: number
  isFinishing: boolean
}

function StepIcon({ status }: { status: 'pending' | 'active' | 'complete' }) {
  if (status === 'complete') {
    return (
      <motion.div
        className="w-5 h-5 rounded-full bg-foreground flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      >
        <svg className="w-3 h-3 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </motion.div>
    )
  }

  if (status === 'active') {
    return (
      <div className="relative w-5 h-5">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-foreground/20"
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-foreground"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    )
  }

  return <div className="w-2 h-2 rounded-full bg-foreground/15" />
}

function AnalysisStepRow({
  step,
  index,
  activeStep,
}: {
  step: AnalysisStep
  index: number
  activeStep: number
}) {
  const status =
    index < activeStep ? 'complete' : index === activeStep ? 'active' : 'pending'

  return (
    <motion.div
      layout
      className="flex items-start gap-4"
      initial={{ opacity: 0, x: -12 }}
      animate={{
        opacity: status === 'pending' ? 0.35 : 1,
        x: 0,
      }}
      transition={{ duration: 0.45, ease: easePremium }}
    >
      <div className="mt-0.5 w-5 flex justify-center flex-shrink-0">
        <StepIcon status={status} />
      </div>
      <div className="flex-1 min-w-0 pb-1">
        <p
          className={`text-sm font-medium tracking-tight transition-colors duration-300 ${
            status === 'active' ? 'text-foreground' : 'text-foreground/70'
          }`}
        >
          {step.label}
        </p>
        <AnimatePresence mode="wait">
          {status === 'active' && (
            <motion.p
              key={step.detail}
              className="text-xs text-foreground/45 mt-1 leading-relaxed"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: easePremium }}
            >
              {step.detail}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export function CinematicAnalysis({
  isRoastMode,
  previewUrl,
  activeStep,
  isFinishing,
}: CinematicAnalysisProps) {
  const steps = getAnalysisSteps(isRoastMode)
  const [statusIndex, setStatusIndex] = useState(0)
  const messages = isRoastMode ? ROAST_STATUS_MESSAGES : STANDARD_STATUS_MESSAGES
  const progress = Math.min(((activeStep + (isFinishing ? 1 : 0.3)) / steps.length) * 100, 100)

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((i) => (i + 1) % messages.length)
    }, 3200)
    return () => clearInterval(interval)
  }, [messages.length])

  return (
    <motion.div
      className={`relative min-h-screen flex flex-col items-center justify-center px-4 py-16 overflow-hidden ${
        isRoastMode
          ? 'bg-gradient-to-b from-red-50/40 via-background to-orange-50/30'
          : 'bg-gradient-to-b from-slate-50/80 via-background to-violet-50/20'
      }`}
      {...fadeIn}
      transition={{ duration: 0.6 }}
    >
      {/* Ambient orbs */}
      <motion.div
        className={`absolute top-1/4 -left-32 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          isRoastMode ? 'bg-red-200/30' : 'bg-blue-200/25'
        }`}
        animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={`absolute bottom-1/4 -right-32 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
          isRoastMode ? 'bg-orange-200/25' : 'bg-violet-200/20'
        }`}
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1.05, 1, 1.05] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easePremium }}
        >
          <motion.p
            className={`text-xs font-medium tracking-[0.2em] uppercase mb-3 ${
              isRoastMode ? 'text-red-500/80' : 'text-foreground/40'
            }`}
          >
            {isRoastMode ? 'Roast mode active' : 'AI design review'}
          </motion.p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            {isFinishing
              ? 'Crafting your verdict'
              : isRoastMode
                ? 'Preparing emotional damage'
                : 'Analyzing your interface'}
          </h1>
        </motion.div>

        {/* Preview + scan */}
        {previewUrl && (
          <motion.div
            className="relative mx-auto mb-10 w-full max-w-xs aspect-[4/3] rounded-xl overflow-hidden border border-foreground/10 shadow-lg bg-foreground/5"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: easePremium }}
          >
            <img
              src={previewUrl}
              alt="Analyzing"
              className="w-full h-full object-cover object-top"
            />
            <motion.div
              className={`absolute inset-x-0 h-px ${
                isRoastMode
                  ? 'bg-gradient-to-r from-transparent via-red-400/80 to-transparent'
                  : 'bg-gradient-to-r from-transparent via-foreground/40 to-transparent'
              }`}
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent pointer-events-none" />
          </motion.div>
        )}

        {/* Steps */}
        <motion.div
          className="space-y-3 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {steps.map((step, index) => (
            <AnalysisStepRow
              key={step.id}
              step={step}
              index={index}
              activeStep={activeStep}
            />
          ))}
        </motion.div>

        {/* Progress */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <div className="h-px w-full bg-foreground/8 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                isRoastMode
                  ? 'bg-gradient-to-r from-red-400 via-orange-400 to-red-500'
                  : 'bg-gradient-to-r from-foreground/30 via-foreground/60 to-foreground/30'
              }`}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: easePremium }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-foreground/35 tracking-wide uppercase">
              {Math.round(progress)}%
            </span>
            <span className="text-[10px] text-foreground/35">
              Step {Math.min(activeStep + 1, steps.length)} of {steps.length}
            </span>
          </div>
        </motion.div>

        {/* Status line */}
        <AnimatePresence mode="wait">
          <motion.p
            key={statusIndex}
            className="text-center text-sm text-foreground/50 leading-relaxed min-h-[2.5rem]"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: easePremium }}
          >
            {messages[statusIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
