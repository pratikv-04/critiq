'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import type { AnalysisResult } from '@/lib/types'

export type AppState = 'landing' | 'upload' | 'processing' | 'results'

interface AppContextType {
  currentState: AppState
  setCurrentState: (state: AppState) => void
  uploadedFile: File | null
  setUploadedFile: (file: File | null) => void
  analysisResult: AnalysisResult | null
  setAnalysisResult: (result: AnalysisResult | null) => void
  analysisError: string | null
  setAnalysisError: (error: string | null) => void
  isRoastMode: boolean
  setIsRoastMode: (mode: boolean) => void
  resetForNewAnalysis: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentState, setCurrentState] = useState<AppState>('landing')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [isRoastMode, setIsRoastMode] = useState(false)

  const resetForNewAnalysis = () => {
    setUploadedFile(null)
    setAnalysisResult(null)
    setAnalysisError(null)
    setCurrentState('upload')
  }

  return (
    <AppContext.Provider
      value={{
        currentState,
        setCurrentState,
        uploadedFile,
        setUploadedFile,
        analysisResult,
        setAnalysisResult,
        analysisError,
        setAnalysisError,
        isRoastMode,
        setIsRoastMode,
        resetForNewAnalysis,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
