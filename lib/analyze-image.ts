import OpenAI from 'openai'
import { normalizeAuditResponse } from '@/lib/normalize-audit-response'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts'
import type { GeminiAuditResponse } from '@/lib/types'

export interface AnalyzeImageOptions {
  roastMode?: boolean
}

const GROQ_MODEL = 'qwen/qwen3.8-27b'
const GENERATION_TEMPERATURE = 0.2
const MAX_OUTPUT_TOKENS = 800

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

function getGroqApiKey(): string {
  const key = process.env.GROQ_API_KEY?.trim()

  if (!key) {
    throw new Error('GROQ_API_KEY is not configured')
  }

  return key
}

function parseAuditJson(text: string): unknown {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  return JSON.parse(cleaned)
}

function inspectAuditStructure(value: unknown) {
  const record = value && typeof value === 'object'
    ? value as Record<string, unknown>
    : null
  const topLevelKeys = record ? Object.keys(record) : []
  const missingRequiredFields = [
    'scorecards',
    'whatWorking',
    'issues',
    'roastSummary',
    'improvements',
  ].filter((field) => !(field in (record ?? {})))
  const typeMismatches: string[] = []

  if (record) {
    if (!Array.isArray(record.scorecards)) typeMismatches.push('scorecards: array')
    if (!Array.isArray(record.whatWorking)) typeMismatches.push('whatWorking: array')
    if (!Array.isArray(record.issues)) typeMismatches.push('issues: array')
    if (typeof record.roastSummary !== 'string') typeMismatches.push('roastSummary: string')
    if (!Array.isArray(record.improvements)) typeMismatches.push('improvements: array')

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

    if (Array.isArray(record.improvements)) {
      record.improvements.forEach((improvement, index) => {
        if (!improvement || typeof improvement !== 'object') {
          typeMismatches.push(`improvements[${index}]: object`)
          return
        }
        const item = improvement as Record<string, unknown>
        for (const field of ['id', 'title', 'description', 'impact']) {
          if (!(field in item)) missingRequiredFields.push(`improvements[${index}].${field}`)
          else if (typeof item[field] !== 'string') typeMismatches.push(`improvements[${index}].${field}: string`)
        }
      })
    }
  } else {
    typeMismatches.push('top-level: object')
  }

  return { topLevelKeys, missingRequiredFields, typeMismatches }
}

function redactLogValue(value: unknown): string {
  return String(value ?? '')
    .replace(/gsk_[a-z0-9]+/gi, '[redacted-api-key]')
    .slice(0, 500)
}

function logGroqApiError(error: unknown) {
  const providerError = error as {
    status?: unknown
    code?: unknown
    message?: unknown
    error?: {
      code?: unknown
      message?: unknown
      type?: unknown
    }
    body?: unknown
  }
  const nestedError = providerError.error

  console.error('[Critiq Groq API Error]', {
    modelRequested: GROQ_MODEL,
    httpStatus: providerError.status ?? null,
    errorCode: nestedError?.code ?? providerError.code ?? null,
    errorType: nestedError?.type ?? null,
    errorMessage: redactLogValue(
      nestedError?.message ?? providerError.message ?? error
    ),
    responseBodyPresent:
      providerError.error !== undefined || providerError.body !== undefined,
  })
}

function logGroqParseError(error: unknown, responseText: string) {
  let structure: ReturnType<typeof inspectAuditStructure> = {
    topLevelKeys: [],
    missingRequiredFields: [],
    typeMismatches: [],
  }

  if (responseText) {
    try {
      structure = inspectAuditStructure(parseAuditJson(responseText))
    } catch {
      structure.typeMismatches = ['response: valid JSON object']
    }
  }

  console.error('[Critiq Groq Parse Error]', {
    modelRequested: GROQ_MODEL,
    errorMessage: redactLogValue(error),
    responseBodyPresent: responseText.length > 0,
    responseTextLength: responseText.length,
    ...structure,
  })
}

function validateAuditStructure(value: unknown): GeminiAuditResponse {
  const structure = inspectAuditStructure(value)
  const record = value as Record<string, unknown>

  if (structure.missingRequiredFields.length || structure.typeMismatches.length) {
    throw new Error('AI response is missing required fields')
  }

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
    (record.issues as unknown[]).length > 3 ||
    (record.improvements as unknown[]).length > 3
  ) {
    throw new Error('AI response exceeds compact field limits')
  }

  return value as GeminiAuditResponse
}

export async function analyzeImage(
  imageBuffer: Buffer,
  mimeType: string,
  options: AnalyzeImageOptions = {}
): Promise<GeminiAuditResponse> {
  const roastMode = options.roastMode ?? false
  const client = new OpenAI({
    apiKey: getGroqApiKey(),
    baseURL: 'https://api.groq.com/openai/v1',
  })

  let response

  try {
    response = await client.chat.completions.create({
      model: GROQ_MODEL,
      temperature: GENERATION_TEMPERATURE,
      max_completion_tokens: MAX_OUTPUT_TOKENS,
      reasoning_effort: 'none',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: buildSystemPrompt({ roastMode }),
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: buildUserPrompt({ roastMode }),
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${imageBuffer.toString('base64')}`,
              },
            },
          ],
        },
      ],
    })
  } catch (error) {
    logGroqApiError(error)
    throw error
  }

  const text = response.choices[0]?.message?.content

  if (!text || typeof text !== 'string') {
    const error = new Error('Groq returned empty response')
    logGroqParseError(error, '')
    throw error
  }

  try {
    return normalizeAuditResponse(validateAuditStructure(parseAuditJson(text)))
  } catch (error) {
    logGroqParseError(error, text)
    throw error
  }
}
