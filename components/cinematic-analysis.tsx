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

/** Draws gorgeous, active-step contextual telemetry overlays over the screenshot */
function StepScannerOverlay({ stepId, isRoastMode }: { stepId: string; isRoastMode: boolean }) {
  const color = isRoastMode ? '#ef4444' : '#6366f1'
  const secondaryColor = isRoastMode ? '#f97316' : '#3b82f6'

  switch (stepId) {
    case 'upload':
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Scanning sweep lines */}
          <motion.line
            x1="0"
            y1="0"
            x2="100"
            y2="0"
            stroke={color}
            strokeWidth="0.8"
            opacity="0.8"
            animate={{ y: ['0%', '100%', '0%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* Tech grid dots */}
          <circle cx="10" cy="10" r="0.5" fill={color} opacity="0.3" />
          <circle cx="90" cy="10" r="0.5" fill={color} opacity="0.3" />
          <circle cx="10" cy="90" r="0.5" fill={color} opacity="0.3" />
          <circle cx="90" cy="90" r="0.5" fill={color} opacity="0.3" />
        </svg>
      )

    case 'hierarchy':
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          {/* Gaze focal points */}
          <motion.circle
            cx="50"
            cy="25"
            r="8"
            fill="none"
            stroke={color}
            strokeWidth="1"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="35"
            cy="60"
            r="12"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="0.8"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
          {/* Connect gaze vector */}
          <motion.path
            d="M50 25 L35 60"
            stroke={color}
            strokeWidth="0.6"
            strokeDasharray="2,2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          <text x="52" y="22" fill={color} fontSize="3" className="font-mono font-bold tracking-tight">FOCAL_01</text>
          <text x="37" y="57" fill={secondaryColor} fontSize="3" className="font-mono font-bold tracking-tight">FOCAL_02</text>
        </svg>
      )

    case 'accessibility':
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          {/* Contrast testing targets */}
          <motion.rect
            x="20"
            y="20"
            width="60"
            height="10"
            rx="1"
            fill="none"
            stroke="#10b981"
            strokeWidth="0.8"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <text x="22" y="17" fill="#10b981" fontSize="3" className="font-mono font-bold">CONTRAST OK [6.4:1]</text>

          <motion.rect
            x="20"
            y="42"
            width="40"
            height="8"
            rx="1"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="0.8"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          <text x="22" y="39" fill="#f59e0b" fontSize="3" className="font-mono font-bold">CONTRAST FAIL [2.8:1]</text>
        </svg>
      )

    case 'cognitive':
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          {/* Density mesh network */}
          <motion.circle cx="30" cy="30" r="2" fill={color} />
          <motion.circle cx="70" cy="35" r="2" fill={color} />
          <motion.circle cx="40" cy="70" r="2" fill={color} />
          <motion.circle cx="65" cy="75" r="2" fill={color} />

          <motion.path
            d="M30 30 L70 35 L65 75 L40 70 Z"
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            strokeDasharray="1,2"
            animate={{ strokeDashoffset: [0, -10] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          />
          <text x="32" y="27" fill={color} fontSize="3" className="font-mono">NODE_DENSITY: HIGH</text>
        </svg>
      )

    case 'friction':
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          {/* Layout anti-pattern callout */}
          <motion.rect
            x="15"
            y="50"
            width="70"
            height="35"
            fill="none"
            stroke="#ef4444"
            strokeWidth="0.8"
            strokeDasharray="3,2"
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {/* Attention warnings */}
          <line x1="15" y1="50" x2="85" y2="85" stroke="#ef4444" strokeWidth="0.5" opacity="0.3" />
          <line x1="85" y1="50" x2="15" y2="85" stroke="#ef4444" strokeWidth="0.5" opacity="0.3" />
          <text x="18" y="47" fill="#ef4444" fontSize="3.5" className="font-mono font-bold">⚠️ FRICTION: ALIGNMENT SHIFT</text>
        </svg>
      )

    case 'cta':
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          {/* CTA highlight focus target */}
          <motion.rect
            x="30"
            y="75"
            width="40"
            height="10"
            rx="5"
            fill="none"
            stroke={color}
            strokeWidth="1.2"
            animate={{ scale: [0.97, 1.03, 0.97], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '50px 80px' }}
          />
          <motion.circle
            cx="50"
            cy="80"
            r="12"
            fill="none"
            stroke={secondaryColor}
            strokeWidth="0.5"
            strokeDasharray="2,2"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          <text x="50" y="72" fill={color} fontSize="3" textAnchor="middle" className="font-mono font-bold tracking-widest">PRIMARY_TARGET</text>
        </svg>
      )

    case 'interaction':
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
          {/* User interaction flow path */}
          <motion.path
            d="M10 20 Q50 10 90 20 T50 80"
            fill="none"
            stroke={color}
            strokeWidth="0.8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="10"
            cy="20"
            r="4"
            fill={color}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <text x="16" y="21" fill={color} fontSize="3" className="font-mono font-bold">ENTRY_POINT</text>
        </svg>
      )

    default:
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Cyber scan radar */}
          <motion.line
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            stroke={color}
            strokeWidth="0.5"
            opacity="0.6"
            animate={{ y: ['-50%', '50%', '-50%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </svg>
      )
  }
}

/** Micro-telemetry lines shown below details to convey visual intelligence */
function TelemetryTelemetry({ stepId }: { stepId: string }) {
  const [val1, setVal1] = useState(104)
  const [val2, setVal2] = useState(502)

  useEffect(() => {
    const int = setInterval(() => {
      setVal1(Math.floor(Math.random() * 200) + 50)
      setVal2(Math.floor(Math.random() * 800) + 100)
    }, 450)
    return () => clearInterval(int)
  }, [])

  const getLog = () => {
    switch (stepId) {
      case 'upload':
        return `VIEWPORT_DIMENSIONS: [w: 1200, h: 900] | GEOMETRY_DELTA: 0.00`
      case 'hierarchy':
        return `EYE_GAZE_VECTORS: [${val1}, ${val2}] | ATTENTION_COEFFICIENT: 0.892`
      case 'accessibility':
        return `WCAG_CONTRAST_SCORE: 4.82:1 (AA) | TARGET_SPACING: [min: 8px] OK`
      case 'cognitive':
        return `NODE_COMPLEXITY_INDEX: 0.64 | SPATIAL_DENSITY: ${val1}px`
      case 'friction':
        return `SPACING_RHYTHM_ERROR: [x: ${val1}, y: ${val2}, offset: 4px]`
      case 'cta':
        return `CTA_ATTENTION_SHARE: 74% | ALTERNATE_NOISE_LEAK: LOW`
      case 'interaction':
        return `FLOW_COMPREHENSION: 0.95 | JAKOBS_LAW_COMPLIANCE: 98%`
      case 'critique':
        return `COMPILING_SPECIFICATIONS: FIGMA_V3.81 | NORMALIZING SCORECARDS…`
      case 'damage':
        return `CALCULATING_EMOTIONAL_DAMAGE_INDEX: 99.8% | SPICINESS: EXTREME`
      default:
        return `SYSTEM_TELEMETRY: ACTIVE | BUFFER: 100%`
    }
  }

  return (
    <motion.p
      key={stepId + val1}
      className="font-mono text-[10px] text-foreground/30 tracking-wider text-center mt-3 uppercase"
      initial={{ opacity: 0.3 }}
      animate={{ opacity: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      {getLog()}
    </motion.p>
  )
}

export function CinematicAnalysis({
  isRoastMode,
  previewUrl,
  activeStep,
  isFinishing,
}: CinematicAnalysisProps) {
  const steps = getAnalysisSteps(isRoastMode)
  const currentStep = steps[Math.min(activeStep, steps.length - 1)] || steps[0]
  const [statusIndex, setStatusIndex] = useState(0)
  const messages = isRoastMode ? ROAST_STATUS_MESSAGES : STANDARD_STATUS_MESSAGES
  const progress = Math.min(((activeStep + (isFinishing ? 1 : 0.3)) / steps.length) * 100, 100)

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((i) => (i + 1) % messages.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [messages.length])

  return (
    <motion.div
      className={`relative min-h-screen flex flex-col items-center justify-between px-6 py-12 overflow-hidden ${
        isRoastMode
          ? 'bg-gradient-to-b from-red-50/20 via-background to-orange-50/15'
          : 'bg-gradient-to-b from-slate-50/50 via-background to-violet-50/10'
      }`}
      {...fadeIn}
      transition={{ duration: 0.8 }}
    >
      {/* Ambient orbs */}
      <motion.div
        className={`absolute top-1/4 -left-32 w-72 h-72 rounded-full blur-3xl pointer-events-none ${
          isRoastMode ? 'bg-red-300/15' : 'bg-blue-300/15'
        }`}
        animate={{ opacity: [0.3, 0.45, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={`absolute bottom-1/4 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none ${
          isRoastMode ? 'bg-orange-300/15' : 'bg-violet-300/10'
        }`}
        animate={{ opacity: [0.2, 0.35, 0.2], scale: [1.05, 1, 1.05] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Header */}
      <motion.header
        className="w-full max-w-xl text-center z-10 flex flex-col items-center pt-4"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: easePremium }}
      >
        <motion.p
          className={`text-[10px] font-semibold tracking-[0.25em] uppercase mb-2 ${
            isRoastMode ? 'text-red-500' : 'text-foreground/35'
          }`}
          animate={isRoastMode ? { opacity: [0.6, 1, 0.6] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isRoastMode ? 'Roast Mode Active' : 'AI UX Diagnostics'}
        </motion.p>
        <div className="h-6 overflow-hidden relative w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={statusIndex}
              className="text-xs text-foreground/45 tracking-wide leading-relaxed absolute"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: easePremium }}
            >
              {messages[statusIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Main Cinematic Visualizer Section */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center my-auto py-8">
        {/* Floating Screenshot Glass Viewport */}
        {previewUrl && (
          <motion.div
            className={`relative mb-10 w-full max-w-[280px] aspect-[4/3] rounded-2xl overflow-hidden border bg-foreground/5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-colors duration-500 ${
              isRoastMode ? 'border-red-200/50' : 'border-foreground/10'
            }`}
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: easePremium }}
            whileHover={{ scale: 1.01 }}
          >
            {/* Target Crosshair Corners */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-foreground/30 pointer-events-none" />
            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-foreground/30 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-foreground/30 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-foreground/30 pointer-events-none" />

            <img
              src={previewUrl}
              alt="Analyzing design interface"
              className="w-full h-full object-cover object-top filter contrast-[1.02] brightness-[0.98]"
            />

            {/* Futuristic Scanning Overlays */}
            <StepScannerOverlay stepId={currentStep.id} isRoastMode={isRoastMode} />

            {/* Sweep light reflecting off glass */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none" />
          </motion.div>
        )}

        {/* Dynamic Focus Content Display */}
        <div className="w-full text-center min-h-[140px] flex flex-col justify-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep.id}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.55, ease: easePremium }}
              className="px-4"
            >
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground tracking-tight mb-2.5 flex items-center justify-center gap-2">
                {currentStep.label}
                <motion.span
                  className={`w-1.5 h-1.5 rounded-full ${isRoastMode ? 'bg-red-500' : 'bg-indigo-500'}`}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                />
              </h2>
              <p className="text-sm text-foreground/50 leading-relaxed max-w-sm mx-auto min-h-[40px]">
                {currentStep.detail}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Telemetry Logger */}
          <TelemetryTelemetry stepId={currentStep.id} />
        </div>
      </div>

      {/* Footer tactile dot progress & percentage */}
      <footer className="w-full max-w-xs z-10 flex flex-col items-center gap-5 pb-4">
        {/* Tactile progress nodes */}
        <div className="flex items-center gap-1.5">
          {steps.map((step, idx) => {
            const isCompleted = idx < activeStep
            const isActive = idx === activeStep
            return (
              <motion.div
                key={step.id}
                className={`h-1 rounded-full transition-all duration-500 ${
                  isCompleted
                    ? isRoastMode
                      ? 'bg-red-500 w-3'
                      : 'bg-foreground/60 w-3'
                    : isActive
                      ? isRoastMode
                        ? 'bg-red-400 w-5 animate-pulse'
                        : 'bg-indigo-500 w-5 animate-pulse'
                      : 'bg-foreground/10 w-1'
                }`}
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )
          })}
        </div>

        {/* Small numeric indicators */}
        <div className="flex items-center justify-between w-full text-[10px] text-foreground/35 font-mono tracking-widest uppercase">
          <span>{Math.round(progress)}% ANALYSIS</span>
          <span>STEP {Math.min(activeStep + 1, steps.length)} OF {steps.length}</span>
        </div>
      </footer>
    </motion.div>
  )
}
