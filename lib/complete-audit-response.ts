import type { GeminiAuditResponse, Improvement, Issue, ScorecardData } from '@/lib/types'

export type RoastSource = 'model' | 'local-fallback'

export interface CompletedAuditResponse {
  response: GeminiAuditResponse
  roastSource: RoastSource
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

function shorten(value: string, maxLength = 120): string {
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`
}

function stripSentenceEnding(value: string): string {
  return shorten(value).replace(/[.!?]+$/, '')
}

function capitalize(value: string): string {
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : value
}

function hashText(value: string): number {
  return [...value].reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    7
  )
}

function buildRoastSummary(
  scorecards: ScorecardData[],
  issues: Issue[],
  improvements: Improvement[]
): string {
  const weakest = [...scorecards]
    .sort((left, right) => left.score - right.score)
    .slice(0, 2)
  const weakestCategory = weakest[0]
  const secondWeakestCategory = weakest[1]
  const primaryIssue = issues[0]
  const supportingIssue = issues[1]
  const firstImprovement = improvements[0]
  const category = weakestCategory?.name || 'The weakest area'
  const score = weakestCategory?.score ?? 0
  const issueTitle = primaryIssue?.title || 'the main interaction'
  const issueDetail = stripSentenceEnding(
    primaryIssue?.explanation || primaryIssue?.userFriction || primaryIssue?.recommendation || 'the visible friction'
  )
  const nextMove = stripSentenceEnding(
    firstImprovement?.description || primaryIssue?.recommendation || 'the clearest user friction'
  )
  const weakestPair = secondWeakestCategory
    ? `${category} (${score}) and ${secondWeakestCategory.name} (${secondWeakestCategory.score})`
    : `${category} (${score})`
  const roastVariants = [
    `At ${category} (${score}), subtlety has become a usability tax. “${issueTitle}” is the bill: ${issueDetail}. Fix: ${nextMove}.`,
    `The screen gave ${weakestPair} a starring role; meanwhile, ${issueTitle.toLowerCase()} is the plot twist. ${capitalize(nextMove)} is the obvious first repair.`,
    `This screen has ${category} at ${score}, with ${issueTitle.toLowerCase()} asking for attention. ${issueDetail}. Hard truth: ${capitalize(nextMove)}.`,
    `Apparently ${category} (${score}) thought subtlety was a product strategy. “${issueTitle}”: ${issueDetail}. The next move is ${nextMove}.`,
  ]
  const supportingDetail = supportingIssue?.title || secondWeakestCategory?.name || ''
  const seed = `${weakestPair}|${issueTitle}|${supportingDetail}|${issueDetail}|${nextMove}`

  return roastVariants[hashText(seed) % roastVariants.length]
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
  const roastSource: RoastSource = returnedRoast ? 'model' : 'local-fallback'
  const roastSummary = returnedRoast || buildRoastSummary(raw.scorecards, issues, improvements)

  return {
    response: {
      ...raw,
      roastSummary,
      improvements,
    },
    roastSource,
  }
}
