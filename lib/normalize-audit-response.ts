import type { GeminiAuditResponse, Issue, ScorecardData } from '@/lib/types'

const REQUIRED_SCORECARD_NAMES = [
  'Visual Hierarchy',
  'Clarity',
  'Accessibility',
  'Consistency',
  'Cognitive Load',
  'Conversion Readiness',
] as const

const VALID_SEVERITIES = new Set(['high', 'medium', 'low'])

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)))
}

function normalizeSeverity(value: string): Issue['severity'] {
  const lower = value.toLowerCase()
  if (VALID_SEVERITIES.has(lower)) {
    return lower as Issue['severity']
  }
  return 'medium'
}

function normalizeIssue(issue: Issue, index: number): Issue {
  return {
    id: String(issue.id ?? index + 1),
    title: issue.title?.trim() || `Issue ${index + 1}`,
    severity: normalizeSeverity(issue.severity ?? 'medium'),
    explanation: issue.explanation?.trim() || '',
    whyItMatters:
      issue.whyItMatters?.trim() ||
      'This friction compounds across sessions and weakens confidence in the product.',
    userFriction:
      issue.userFriction?.trim() ||
      'Users may hesitate, mis-tap, or abandon before completing their goal.',
    recommendation: issue.recommendation?.trim() || '',
  }
}

function normalizeScorecards(scorecards: ScorecardData[]): ScorecardData[] {
  const byName = new Map(scorecards.map((s) => [s.name, s]))

  return REQUIRED_SCORECARD_NAMES.map((name) => {
    const existing = byName.get(name)
    return {
      name,
      score: clampScore(existing?.score ?? 50),
      description: existing?.description?.trim() || 'Insufficient detail from analysis.',
    }
  })
}

/** Validates and normalizes raw Gemini output for reliable UI rendering. */
export function normalizeAuditResponse(raw: GeminiAuditResponse): GeminiAuditResponse {
  if (!raw.scorecards?.length || !raw.whatWorking?.length || !raw.issues?.length) {
    throw new Error('AI response is missing required fields')
  }

  return {
    scorecards: normalizeScorecards(raw.scorecards),
    whatWorking: raw.whatWorking
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 6),
    issues: raw.issues.map(normalizeIssue).slice(0, 8),
    roastSummary: raw.roastSummary?.trim() || 'Analysis complete.',
    improvements: (raw.improvements ?? [])
      .map((imp, i) => ({
        id: String(imp.id ?? i + 1),
        title: imp.title?.trim() || `Improvement ${i + 1}`,
        description: imp.description?.trim() || '',
        impact: imp.impact?.trim() || '',
      }))
      .filter((imp) => imp.title && imp.description)
      .slice(0, 6),
  }
}
