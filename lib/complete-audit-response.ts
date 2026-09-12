import type { GeminiAuditResponse, Improvement, Issue } from '@/lib/types'

export interface CompletedAuditResponse {
  response: GeminiAuditResponse
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
  raw: GeminiAuditResponse
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

  return {
    response: {
      ...raw,
      roastSummary: returnedRoast,
      improvements,
    },
    roastPresent: returnedRoast.length > 0,
  }
}
