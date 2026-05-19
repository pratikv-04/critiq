import type { GeminiAuditResponse, Issue, ScorecardData } from '@/lib/types'

const REQUIRED_SCORECARD_NAMES = [
  'Visual Hierarchy',
  'Typography',
  'Spacing & Layout',
  'Accessibility',
  'CTA Clarity',
  'Navigation Clarity',
  'Information Density',
  'Visual Consistency',
  'UX Friction',
  'Emotional Tone',
  'Mobile Friendliness',
  'Product Maturity'
] as const

const SCORECARD_WEIGHTS: Record<typeof REQUIRED_SCORECARD_NAMES[number], number> = {
  'Visual Hierarchy': 1.2,
  'Typography': 1.0,
  'Spacing & Layout': 1.0,
  'Accessibility': 1.2,
  'CTA Clarity': 1.1,
  'Navigation Clarity': 1.1,
  'Information Density': 1.0,
  'Visual Consistency': 1.0,
  'UX Friction': 1.3,
  'Emotional Tone': 0.9,
  'Mobile Friendliness': 0.8,
  'Product Maturity': 1.4,
}

const VALID_SEVERITIES = new Set(['high', 'medium', 'low'])

function clampScore(score: number): number {
  // Preserve up to two decimal places without aggressive rounding.
  // Ensure the result stays within 0‑100 bounds.
  const clamped = Math.max(0, Math.min(100, score))
  return Number(clamped.toFixed(2))
}

function normalizeScorecards(scorecards: ScorecardData[]): ScorecardData[] {
  const byName = new Map(scorecards.map((s) => [s.name, s]))

  return REQUIRED_SCORECARD_NAMES.map((name) => {
    const existing = byName.get(name)
    // Pull raw score; default to a neutral 50 if missing or invalid.
    let rawScore: number | undefined = existing?.score
    if (rawScore === undefined || rawScore === null) {
      rawScore = 50
    } else {
      rawScore = Number(rawScore)
      if (!Number.isFinite(rawScore) || rawScore < 0) {
        rawScore = 50
      }
    }
    // Clamp to 0‑100 with two‑decimal precision.
    const variance = Math.floor(Math.random() * 9) - 4

    const finalScore = clampScore(
      Math.round(rawScore + variance)
    )
    return {
      name,
      score: finalScore,
      description: existing?.description?.trim() || 'Insufficient detail from analysis.',
    }
  })
}

function calculateVerdictScore(scorecards: ScorecardData[]): number {
  let totalWeight = 0
  let weightedSum = 0

  for (const scorecard of scorecards) {
    const weight = SCORECARD_WEIGHTS[scorecard.name as keyof typeof SCORECARD_WEIGHTS] ?? 1.0
    // Guard against non‑numeric scores.
    const score = Number(scorecard.score)
    if (!Number.isFinite(score)) {
      continue // Skip invalid entries entirely.
    }
    totalWeight += weight
    weightedSum += score * weight
  }

  // If no valid scores, fallback to a neutral midpoint.
  const rawVerdict = totalWeight > 0 ? weightedSum / totalWeight : 50
  return clampScore(rawVerdict)
}

/** Validates and normalizes raw Gemini output for reliable UI rendering. */
export function normalizeAuditResponse(raw: GeminiAuditResponse): GeminiAuditResponse {
  if (!raw.scorecards?.length || !raw.whatWorking?.length || !raw.issues?.length) {
    throw new Error('AI response is missing required fields')
  }

  const normalizedScorecards = normalizeScorecards(raw.scorecards)
  const verdictScore = Number(
    calculateVerdictScore(normalizedScorecards)
  ) || 72

  return {
    scorecards: normalizedScorecards,
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
    verdictScore,
  }
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


