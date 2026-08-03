'use client'

import { useApp } from '@/lib/app-context'
import { useEffect, useRef, useState } from 'react'
import type { AnalysisResult, GeminiAuditResponse } from '@/lib/types'
import { getAnalysisSteps } from '@/lib/analysis-messages'
import { CinematicAnalysis } from './cinematic-analysis'
import { ErrorState } from './error-state'

const STEP_MS = 1100
const FINISH_MS = 600

export function Processing() {
  const {
    uploadedFile,
    isRoastMode,
    setCurrentState,
    setAnalysisResult,
    setAnalysisError,
    analysisError,
  } = useApp()

  const [activeStep, setActiveStep] = useState(0)
  const [isFinishing, setIsFinishing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const hasStarted = useRef(false)
  const auditRef = useRef<AnalysisResult | null>(null)
  const steps = getAnalysisSteps(isRoastMode)

  useEffect(() => {
    if (!uploadedFile) return
    const url = URL.createObjectURL(uploadedFile)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [uploadedFile])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (auditRef.current && prev >= steps.length - 2) {
          return prev
        }
        return Math.min(prev + 1, steps.length - 1)
      })
    }, STEP_MS)

    return () => clearInterval(interval)
  }, [steps.length])

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true

    async function runAnalysis() {
      if (!uploadedFile) {
        setAnalysisError('No image found. Please upload a screenshot again.')
        return
      }

      try {
        const formData = new FormData()
        formData.append('image', uploadedFile)
        formData.append('roastMode', String(isRoastMode))

        const response = await fetch('/api/analyze', {
          method: 'POST',
          body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Analysis failed. Please try again.')
        }

        const audit = data as GeminiAuditResponse
        const screenshotUrl = URL.createObjectURL(uploadedFile)

        auditRef.current = {
          screenshotUrl,
          scorecards: audit.scorecards,
          whatWorking: audit.whatWorking,
          issues: audit.issues,
          roastSummary: audit.roastSummary,
          improvements: audit.improvements ?? [],
          verdictScore: audit.verdictScore,
        }

        setIsFinishing(true)

        const finishSteps = async () => {
          setActiveStep(steps.length - 1)
          await new Promise((r) => setTimeout(r, FINISH_MS))
          if (auditRef.current) {
            setAnalysisResult(auditRef.current)
            setCurrentState('results')
          }
        }

        finishSteps()
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Something went wrong. Please try again.'
        setAnalysisError(message)
      }
    }

    runAnalysis()
  }, [uploadedFile, isRoastMode, setAnalysisResult, setCurrentState, setAnalysisError, steps.length])

  if (analysisError) {
    return (
      <ErrorState
        title="Analysis interrupted"
        message={analysisError}
        onRetry={() => {
          setAnalysisError(null)
          setCurrentState('upload')
        }}
      />
    )
  }

  return (
    <CinematicAnalysis
      isRoastMode={isRoastMode}
      previewUrl={previewUrl}
      activeStep={activeStep}
      isFinishing={isFinishing}
    />
  )
}
