'use client'

import { motion } from 'framer-motion'
import { useApp } from '@/lib/app-context'
import { useState } from 'react'
import { Scorecard } from './scorecard'
import { IssueAccordion } from './issue-accordion'
import { RoastCard } from './roast-card'
import { ImprovementCard } from './improvement-card'
import { AuditSummary } from './audit-summary'
import { RevealSection } from './reveal-section'
import { RoastToggle } from './roast-toggle'
import { RESULTS_REVEAL } from '@/lib/motion'
import { easePremium } from '@/lib/motion'

export function Results() {
  const { analysisResult, isRoastMode, setIsRoastMode, resetForNewAnalysis } = useApp()
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null)

  if (!analysisResult) {
    return null
  }

  const summaryHeadline =
    analysisResult.issues.length > 0
      ? `${analysisResult.issues.filter((i) => i.severity === 'high').length} high-impact issues identified across ${analysisResult.scorecards.length} dimensions`
      : 'A focused review of your interface — see details below'

  return (
    <motion.div
      className={`min-h-screen py-10 sm:py-14 px-4 sm:px-6 relative transition-all duration-1000 ${
        isRoastMode
          ? 'bg-gradient-to-b from-red-500/[0.02] via-background to-orange-500/[0.01]'
          : 'bg-gradient-to-b from-slate-500/[0.01] via-background to-violet-500/[0.01]'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Roast Mode Theatrical Top Glow Shimmer */}
      {isRoastMode && (
        <motion.div
          className="absolute top-0 inset-x-0 h-56 bg-gradient-to-b from-red-500/[0.05] via-orange-500/[0.02] to-transparent blur-3xl pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.header
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 sm:mb-14 gap-5"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easePremium }}
        >
          <motion.div>
            <p className="text-xs font-medium tracking-[0.15em] uppercase text-foreground/40 mb-2">
              Audit complete
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-foreground tracking-tight mb-2">
              Your design verdict
            </h1>
            <p className="text-foreground/55 text-sm sm:text-base max-w-md">
              {isRoastMode
                ? 'Sharp insights, zero fluff — toggle sections below'
                : 'Curated by AI — evidence-based and ready to act on'}
            </p>
          </motion.div>

          <motion.div
            className={`flex items-center gap-3 px-4 py-2.5 rounded-full border transition-shadow duration-500 ${
              isRoastMode
                ? 'border-red-200/80 bg-red-50/50 shadow-[0_0_24px_rgba(239,68,68,0.12)]'
                : 'border-foreground/10 bg-foreground/[0.03]'
            }`}
          >
            <span className="text-sm text-foreground/60">Roast</span>
            <RoastToggle enabled={isRoastMode} onChange={setIsRoastMode} compact />
          </motion.div>
        </motion.header>

        {/* 1. Summary */}
        <RevealSection delay={RESULTS_REVEAL.summary} className="mb-14 sm:mb-16">
          <AuditSummary
            scorecards={analysisResult.scorecards}
            screenshotUrl={analysisResult.screenshotUrl}
            isRoastMode={isRoastMode}
            headline={summaryHeadline}
          />
        </RevealSection>

        {/* 2. Scores */}
        <RevealSection delay={RESULTS_REVEAL.scores} className="mb-14 sm:mb-16">
          <SectionHeader
            title="UX Scorecards"
            subtitle="Six dimensions — scored against product design standards"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {analysisResult.scorecards.map((scorecard, index) => (
              <Scorecard
                key={scorecard.name}
                name={scorecard.name}
                score={scorecard.score}
                description={scorecard.description}
                index={index}
              />
            ))}
          </div>
        </RevealSection>

        {/* 3. Positives */}
        <RevealSection delay={RESULTS_REVEAL.positives} className="mb-14 sm:mb-16">
          <SectionHeader
            title="What's working"
            subtitle="Strengths worth preserving as you iterate"
          />
          <div className="space-y-2.5">
            {analysisResult.whatWorking.map((point, index) => (
              <motion.div
                key={index}
                className="p-4 sm:p-5 rounded-xl bg-emerald-50/80 border border-emerald-200/60"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.5,
                  delay: RESULTS_REVEAL.positives + 0.08 + index * 0.07,
                  ease: easePremium,
                }}
              >
                <p className="text-sm text-foreground/80 leading-relaxed">{point}</p>
              </motion.div>
            ))}
          </div>
        </RevealSection>

        {/* 4. Issues */}
        <RevealSection delay={RESULTS_REVEAL.issues} className="mb-14 sm:mb-16">
          <SectionHeader
            title="Issues found"
            subtitle="Prioritized by user impact — tap to expand"
          />
          <motion.div className="space-y-2.5" layout>
            {analysisResult.issues.map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: RESULTS_REVEAL.issues + 0.06 + index * 0.05,
                  ease: easePremium,
                }}
              >
                <IssueAccordion
                  issue={issue}
                  isExpanded={expandedIssue === issue.id}
                  onToggle={() =>
                    setExpandedIssue(expandedIssue === issue.id ? null : issue.id)
                  }
                />
              </motion.div>
            ))}
          </motion.div>
        </RevealSection>

        {/* 5. Suggestions */}
        <RevealSection delay={RESULTS_REVEAL.suggestions} className="mb-14 sm:mb-16">
          <SectionHeader
            title="Suggested improvements"
            subtitle="High-leverage changes for your next sprint"
          />
          <div className="space-y-3">
            {analysisResult.improvements.map((improvement, index) => (
              <motion.div
                key={improvement.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: RESULTS_REVEAL.suggestions + 0.06 + index * 0.05,
                  ease: easePremium,
                }}
              >
                <ImprovementCard improvement={improvement} index={index} />
              </motion.div>
            ))}
          </div>
        </RevealSection>

        {/* 6. Roast */}
        {isRoastMode && (
          <RevealSection delay={RESULTS_REVEAL.roast} className="mb-14 sm:mb-16">
            <RoastCard roast={analysisResult.roastSummary} />
          </RevealSection>
        )}

        {/* Footer CTAs */}
        <RevealSection delay={RESULTS_REVEAL.footer}>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 pt-10 border-t border-foreground/10"
          >
            <motion.button
              onClick={resetForNewAnalysis}
              className="flex-1 px-6 py-4 rounded-full bg-foreground text-background font-medium"
              whileHover={{ scale: 1.01, opacity: 0.92 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            >
              Analyze another design
            </motion.button>
            <motion.button
              className="flex-1 px-6 py-4 rounded-full border border-foreground/15 text-foreground font-medium hover:bg-foreground/[0.03]"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            >
              Export report
            </motion.button>
          </motion.div>
        </RevealSection>
      </div>
    </motion.div>
  )
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground tracking-tight">
        {title}
      </h2>
      <p className="text-sm text-foreground/45 mt-1">{subtitle}</p>
    </div>
  )
}
