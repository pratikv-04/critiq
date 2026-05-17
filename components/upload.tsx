'use client'

import { motion } from 'framer-motion'
import { useApp } from '@/lib/app-context'
import { useState } from 'react'
import { RoastToggle } from './roast-toggle'
import { easePremium, fadeUp } from '@/lib/motion'

export function Upload() {
  const { setCurrentState, setUploadedFile, setAnalysisError, isRoastMode, setIsRoastMode } = useApp()
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setLocalFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    setFileError(null)
    if (!file.type.startsWith('image/')) {
      setFileError('Please upload a PNG, JPG, or WebP image.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError('This file exceeds the 10 MB limit. Try a smaller screenshot.')
      return
    }
    setLocalFile(file)
  }

  const handleAnalyze = () => {
    if (uploadedFile) {
      setAnalysisError(null)
      setUploadedFile(uploadedFile)
      setCurrentState('processing')
    }
  }

  const handleBack = () => {
    setLocalFile(null)
    setFileError(null)
    setCurrentState('landing')
  }

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mb-10 sm:mb-12 text-center max-w-lg"
        {...fadeUp}
        transition={{ duration: 0.6, ease: easePremium }}
      >
        <p className="text-xs font-medium tracking-[0.15em] uppercase text-foreground/40 mb-3">
          Step 1 of 2
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">
          Upload your design
        </h1>
        <p className="text-foreground/55 text-base sm:text-lg leading-relaxed">
          Any interface screenshot — we&apos;ll run a senior-level UX audit in seconds.
        </p>
      </motion.div>

      <motion.div
        className="w-full max-w-lg mb-6"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.55, ease: easePremium }}
      >
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center p-10 sm:p-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-foreground/50 bg-foreground/[0.04] scale-[1.01]'
              : 'border-foreground/15 hover:border-foreground/30 hover:bg-foreground/[0.02]'
          }`}
        >
          <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" />

          {uploadedFile ? (
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            >
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </div>
              <motion.div className="text-center">
                <p className="font-medium text-foreground">{uploadedFile.name}</p>
                <p className="text-sm text-foreground/50 mt-0.5">
                  {(uploadedFile.size / 1024).toFixed(1)} KB · Ready to analyze
                </p>
              </motion.div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  setLocalFile(null)
                  setFileError(null)
                }}
                className="text-sm text-foreground/50 hover:text-foreground transition-colors"
              >
                Choose a different file
              </button>
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center gap-4"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-14 h-14 rounded-full bg-foreground/[0.04] border border-foreground/10 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-foreground/35"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Drop your screenshot here</p>
                <p className="text-sm text-foreground/50 mt-1">or click to browse</p>
              </div>
              <p className="text-xs text-foreground/35">PNG, JPG, WebP · max 10 MB</p>
            </motion.div>
          )}
        </label>

        {fileError && (
          <motion.p
            className="mt-3 text-sm text-red-600/90 text-center"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {fileError}
          </motion.p>
        )}
      </motion.div>

      {/* Roast mode */}
      <motion.div
        className={`flex items-center justify-between gap-4 w-full max-w-lg mb-8 px-4 sm:px-5 py-3.5 rounded-xl border transition-shadow duration-500 ${
          isRoastMode
            ? 'border-red-200/70 bg-red-50/40 shadow-[0_0_28px_rgba(239,68,68,0.08)]'
            : 'border-foreground/10 bg-foreground/[0.02]'
        }`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: easePremium }}
      >
        <div>
          <p className="text-sm font-medium text-foreground">Roast mode</p>
          <p className="text-xs text-foreground/45 mt-0.5">
            {isRoastMode ? 'Witty verdict — still actionable' : 'Professional senior review'}
          </p>
        </div>
        <RoastToggle enabled={isRoastMode} onChange={setIsRoastMode} />
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row gap-3 w-full max-w-lg"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5, ease: easePremium }}
      >
        <motion.button
          onClick={handleBack}
          className="px-6 py-3.5 rounded-full border border-foreground/15 text-foreground font-medium hover:bg-foreground/[0.03]"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          Back
        </motion.button>
        <motion.button
          onClick={handleAnalyze}
          disabled={!uploadedFile}
          className="flex-1 px-6 py-3.5 rounded-full bg-foreground text-background font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          whileHover={uploadedFile ? { scale: 1.01 } : {}}
          whileTap={uploadedFile ? { scale: 0.98 } : {}}
        >
          Begin analysis
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
