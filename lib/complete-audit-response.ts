import type { GeminiAuditResponse, Improvement, Issue, ScorecardData } from '@/lib/types'

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

function buildRoastSummary(
  scorecards: ScorecardData[],
  issues: Issue[]
): string {
  const weakest = [...scorecards]
    .sort((left, right) => left.score - right.score)
    .slice(0, 2)
    .map((scorecard) => `${scorecard.name} (${scorecard.score})`)
    .join(' and ')
  const firstIssue = issues[0]?.title

  if (weakest && firstIssue) {
    return `${weakest} are carrying the critique. Start with “${firstIssue}” before polishing the edges.`
  }

  if (weakest) {
    return `The weakest link is ${weakest}; that is where the experience loses momentum.`
  }

  if (firstIssue) {
    return `The audit found one clear opportunity: “${firstIssue}.” Fix that before polishing the edges.`
  }

  return 'The biggest opportunity is turning the clearest friction into a simpler path for users.'
}

export function completeOptionalAuditFields(
  raw: GeminiAuditResponse,
  roastMode: boolean
): GeminiAuditResponse {
  const record = raw as unknown as Record<string, unknown>
  const issues = raw.issues
  const returnedImprovements = Array.isArray(record.improvements)
    ? record.improvements.filter(isImprovement).slice(0, 3)
    : []
  const improvements = returnedImprovements.length
    ? returnedImprovements
    : buildImprovements(issues)
  const roastSummary = typeof record.roastSummary === 'string'
    ? record.roastSummary
    : roastMode
      ? buildRoastSummary(raw.scorecards, issues)
      : ''

  return {
    ...raw,
    roastSummary,
    improvements,
  }
}
