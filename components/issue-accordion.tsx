'use client'

import { motion } from 'framer-motion'
import type { Issue } from '@/lib/types'
import { easePremium } from '@/lib/motion'

interface IssueAccordionProps {
  issue: Issue
  isExpanded: boolean
  onToggle: () => void
}

export function IssueAccordion({ issue, isExpanded, onToggle }: IssueAccordionProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200/80'
      case 'medium':
        return 'bg-amber-50 text-amber-800 border-amber-200/80'
      case 'low':
        return 'bg-slate-50 text-slate-600 border-slate-200/80'
      default:
        return 'bg-foreground/5 text-foreground/60 border-foreground/10'
    }
  }

  const sections = [
    { label: 'What we observed', content: issue.explanation },
    { label: 'Why it matters', content: issue.whyItMatters },
    { label: 'User friction', content: issue.userFriction },
    { label: 'Recommended fix', content: issue.recommendation },
  ]

  return (
    <motion.div
      className="border border-foreground/10 rounded-xl overflow-hidden bg-card/40 hover:border-foreground/15 transition-colors duration-300"
      layout
    >
      <motion.button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 hover:bg-foreground/[0.02] transition-colors text-left"
        whileTap={{ scale: 0.995 }}
      >
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide border flex-shrink-0 ${getSeverityColor(
              issue.severity
            )}`}
          >
            {issue.severity}
          </span>
          <h3 className="font-medium text-foreground text-sm sm:text-base truncate">
            {issue.title}
          </h3>
        </div>
        <motion.svg
          className="w-4 h-4 text-foreground/40 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.35, ease: easePremium }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.4, ease: easePremium }}
        className="overflow-hidden"
      >
        <div className="px-4 sm:px-5 pb-5 pt-0 border-t border-foreground/8">
          <motion.div className="space-y-4 pt-4">
            {sections.map((section, i) => (
              <motion.div
                key={section.label}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35, ease: easePremium }}
              >
                <h4 className="text-[10px] font-semibold text-foreground/45 uppercase tracking-wider mb-1.5">
                  {section.label}
                </h4>
                <p className="text-sm text-foreground/80 leading-relaxed">{section.content}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
