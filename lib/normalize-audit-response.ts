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
    // Extract raw score safely, defaulting to a neutral 5 (out of 10) when missing.
    let rawScore: number | undefined = existing?.score
    // Coerce to number if possible.
    if (rawScore === undefined || rawScore === null) {
      rawScore = 5
    } else {
      rawScore = Number(rawScore)
      // If conversion failed, fall back to neutral.
      if (!Number.isFinite(rawScore)) {
        rawScore = 5
      }
    }

    // Convert 0‑10 scale to 0‑100 while preserving decimal precision.
    if (rawScore <= 10) {
      rawScore = (rawScore / 10) * 100
    }

    // Clamp to valid range with two‑decimal precision.
    const finalScore = clampScore(rawScore)

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
  const verdictScore = calculateVerdictScore(normalizedScorecards)

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

function normalizeScorecards(scorecards: ScorecardData[]): ScorecardData[] {
  const byName = new Map(scorecards.map((s) => [s.name, s]))

  return REQUIRED_SCORECARD_NAMES.map((name) => {
    const existing = byName.get(name)
    let rawScore = existing?.score ?? 5

    // Scale up 1-10 scores to 10-100
    if (rawScore <= 10) {
      rawScore = rawScore * 10
    }

    return {
      name,
      score: clampScore(rawScore),
      description: existing?.description?.trim() || 'Insufficient detail from analysis.',
    }
  })
}

function calculateVerdictScore(scorecards: ScorecardData[]): number {
  let totalWeight = 0
  let weightedSum = 0

  for (const scorecard of scorecards) {
    const weight = SCORECARD_WEIGHTS[scorecard.name as keyof typeof SCORECARD_WEIGHTS] ?? 1.0
    totalWeight += weight
    weightedSum += scorecard.score * weight
  }

  return totalWeight > 0 ? clampScore(weightedSum / totalWeight) : 50
}

/** Validates and normalizes raw Gemini output for reliable UI rendering. */
export function normalizeAuditResponse(raw: GeminiAuditResponse): GeminiAuditResponse {
  if (!raw.scorecards?.length || !raw.whatWorking?.length || !raw.issues?.length) {
    throw new Error('AI response is missing required fields')
  }

  const normalizedScorecards = normalizeScorecards(raw.scorecards)
  const verdictScore = calculateVerdictScore(normalizedScorecards)

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
