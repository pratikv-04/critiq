import type { GeminiAuditResponse, Improvement, Issue } from '@/lib/types'

export type RoastSource = 'groq' | 'not-requested'

export interface CompletedAuditResponse {
  response: GeminiAuditResponse
  roastSource: RoastSource
  roastPresent: boolean
}

function isImprovement(value: unknown): value is Improvement {
  if (!value || typeof value !== 'object') return false

  const item = value as Record<string, unknown>
  return ['id', 'title', 'description', 'impact'].every(
    (field) => typeof item[field] === 'string'
  )
}

function buildImprovements(issues: Issue[]): Improvement[] {
  return issues
    .filter((issue) => issue.recommendation.trim())
    .slice(0, 3)
    .map((issue, index) => ({
      id: `issue-${issue.id || index + 1}`,
      title: issue.title,
      description: issue.recommendation,
      impact: issue.whyItMatters,
    }))
}

export function completeOptionalAuditFields(
  raw: GeminiAuditResponse,
  roastMode: boolean
): CompletedAuditResponse {
  const record = raw as unknown as Record<string, unknown>
  const issues = raw.issues
  const returnedImprovements = Array.isArray(record.improvements)
    ? record.improvements.filter(isImprovement).slice(0, 3)
    : []
  const improvements = returnedImprovements.length
    ? returnedImprovements
    : buildImprovements(issues)
  const returnedRoast = typeof record.roastSummary === 'string'
    ? record.roastSummary.trim()
    : ''
  const roastSource: RoastSource = roastMode ? 'groq' : 'not-requested'

  return {
    response: {
      ...raw,
      roastSummary: returnedRoast,
      improvements,
    },
    roastSource,
    roastPresent: returnedRoast.length > 0,
  }
}
