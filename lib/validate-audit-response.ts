import type { GeminiAuditResponse } from '@/lib/types'

const SCORECARD_NAMES = [
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
  'Product Maturity',
] as const

export function parseAuditJson(text: string): unknown {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  return JSON.parse(cleaned)
}

export function inspectAuditStructure(value: unknown) {
  const record = value && typeof value === 'object'
    ? value as Record<string, unknown>
    : null
  const topLevelKeys = record ? Object.keys(record) : []
  const missingRequiredFields = [
    'scorecards',
    'whatWorking',
    'issues',
  ].filter((field) => !(field in (record ?? {})))
  const typeMismatches: string[] = []

  if (record) {
    if (!Array.isArray(record.scorecards)) typeMismatches.push('scorecards: array')
    if (!Array.isArray(record.whatWorking)) typeMismatches.push('whatWorking: array')
    if (!Array.isArray(record.issues)) typeMismatches.push('issues: array')

    if (Array.isArray(record.scorecards)) {
      record.scorecards.forEach((scorecard, index) => {
        if (!scorecard || typeof scorecard !== 'object') {
          typeMismatches.push(`scorecards[${index}]: object`)
          return
        }
        const item = scorecard as Record<string, unknown>
        for (const field of ['name', 'score', 'description']) {
          if (!(field in item)) missingRequiredFields.push(`scorecards[${index}].${field}`)
        }
        if (typeof item.name !== 'string') typeMismatches.push(`scorecards[${index}].name: string`)
        if (typeof item.score !== 'number') typeMismatches.push(`scorecards[${index}].score: number`)
        if (typeof item.description !== 'string') typeMismatches.push(`scorecards[${index}].description: string`)
      })
    }

    if (Array.isArray(record.issues)) {
      record.issues.forEach((issue, index) => {
        if (!issue || typeof issue !== 'object') {
          typeMismatches.push(`issues[${index}]: object`)
          return
        }
        const item = issue as Record<string, unknown>
        for (const field of ['id', 'title', 'severity', 'explanation', 'whyItMatters', 'userFriction', 'recommendation']) {
          if (!(field in item)) missingRequiredFields.push(`issues[${index}].${field}`)
          else if (typeof item[field] !== 'string') typeMismatches.push(`issues[${index}].${field}: string`)
        }
      })
    }

    if (Array.isArray(record.whatWorking)) {
      record.whatWorking.forEach((item, index) => {
        if (typeof item !== 'string') typeMismatches.push(`whatWorking[${index}]: string`)
      })
    }
  } else {
    typeMismatches.push('top-level: object')
  }

  return { topLevelKeys, missingRequiredFields, typeMismatches }
}

export function validateAuditStructure(value: unknown): GeminiAuditResponse {
  const structure = inspectAuditStructure(value)

  if (structure.missingRequiredFields.length || structure.typeMismatches.length) {
    throw new Error('AI response is missing required fields')
  }

  const record = value as Record<string, unknown>
  const scorecards = record.scorecards as Array<Record<string, unknown>>
  const invalidScorecards = scorecards.length !== SCORECARD_NAMES.length ||
    SCORECARD_NAMES.some((name, index) => {
      const scorecard = scorecards[index]
      return scorecard?.name !== name ||
        typeof scorecard?.score !== 'number' ||
        scorecard.score < 0 ||
        scorecard.score > 100 ||
        typeof scorecard?.description !== 'string'
    })

  if (invalidScorecards) {
    throw new Error('AI response has invalid scorecards')
  }

  if (
    (record.whatWorking as unknown[]).length > 3 ||
    (record.issues as unknown[]).length > 3
  ) {
    throw new Error('AI response exceeds compact field limits')
  }

  return value as GeminiAuditResponse
}
