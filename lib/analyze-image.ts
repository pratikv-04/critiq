import OpenAI from 'openai'
import { completeOptionalAuditFields } from '@/lib/complete-audit-response'
import { normalizeAuditResponse } from '@/lib/normalize-audit-response'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts'
import type { GeminiAuditResponse } from '@/lib/types'
import {
  inspectAuditStructure,
  parseAuditJson,
  validateAuditStructure,
} from '@/lib/validate-audit-response'

export interface AnalyzeImageOptions {
  roastMode?: boolean
}

const GROQ_MODEL = 'qwen/qwen3.8-27b'
const GENERATION_TEMPERATURE = 0.2
const MAX_OUTPUT_TOKENS = 800
const ROAST_RECOVERY_TOKENS = 120
const MAX_GROQ_ATTEMPTS = 3

function getGroqStatus(error: unknown): number | null {
  const status = (error as { status?: unknown }).status
  const numericStatus = typeof status === 'number' ? status : Number(status)
  return Number.isFinite(numericStatus) ? numericStatus : null
}

function getRetryReason(error: unknown, status: number | null): string {
  const message = String((error as { message?: unknown }).message ?? '').toLowerCase()
  if (message.includes('capacity') || message.includes('over capacity')) {
    return 'provider_over_capacity'
  }
  if (status === 429) return 'rate_limit'
  return `transient_http_${status ?? 'unknown'}`
}

function isRetryableGroqError(error: unknown): boolean {
  const status = getGroqStatus(error)
  return status === 429 || status === 502 || status === 503 || status === 504
}

function waitForRetry(attempt: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** (attempt - 1)))
}

function getRoastSummary(value: unknown): string {
  if (!value || typeof value !== 'object') return ''

  const record = value as Record<string, unknown>
  const direct = [record.roastSummary, record.roast_summary]
  const nested = record.roast && typeof record.roast === 'object'
    ? [(record.roast as Record<string, unknown>).summary]
    : []
  const candidate = [...direct, ...nested].find((item) => typeof item === 'string')

  return typeof candidate === 'string' ? candidate.trim() : ''
}

function getGroqApiKey(): string {
  const key = process.env.GROQ_API_KEY?.trim()

  if (!key) {
    throw new Error('GROQ_API_KEY is not configured')
  }

  return key
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

async function recoverRoastSummary(
  client: OpenAI,
  imageBuffer: Buffer,
  mimeType: string,
  audit: GeminiAuditResponse
): Promise<string> {
  const auditContext = JSON.stringify({
    scorecards: audit.scorecards,
    issues: audit.issues,
    improvements: audit.improvements,
    whatWorking: audit.whatWorking,
  })

  let response

  try {
    response = await client.chat.completions.create({
      model: GROQ_MODEL,
      temperature: GENERATION_TEMPERATURE,
      max_completion_tokens: ROAST_RECOVERY_TOKENS,
      reasoning_effort: 'none',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'Return only valid JSON with exactly one key: roastSummary. The value must be a non-empty, witty, screenshot-specific 1-3 sentence roast. Roast the interface, never the designer. Do not mention scores unless they support a concrete visible observation.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Generate the missing roastSummary for the current screenshot using the audit context below. Reference concrete visible UI details and the actual issues. Do not use a generic formula or markdown. Return only {"roastSummary":"..."}.\n\nAudit context:\n${auditContext}`,
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

  console.info('[Critiq Groq Recovery Request]', {
    status: 200,
    maxCompletionTokens: ROAST_RECOVERY_TOKENS,
  })

  const text = response.choices[0]?.message?.content
  if (!text || typeof text !== 'string') {
    const error = new Error('Groq roast recovery returned an empty response')
    logGroqParseError(error, '')
    throw error
  }

  try {
    const roastSummary = getRoastSummary(parseAuditJson(text))
    if (!roastSummary) {
      throw new Error('Groq roast recovery is missing roastSummary')
    }
    return roastSummary
  } catch (error) {
    logGroqParseError(error, text)
    throw error
  }
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
  const request = {
    model: GROQ_MODEL,
    temperature: GENERATION_TEMPERATURE,
    max_completion_tokens: MAX_OUTPUT_TOKENS,
    reasoning_effort: 'none' as const,
    response_format: { type: 'json_object' as const },
    messages: [
      {
        role: 'system' as const,
        content: buildSystemPrompt({ roastMode }),
      },
      {
        role: 'user' as const,
        content: [
          {
            type: 'text' as const,
            text: buildUserPrompt({ roastMode }),
          },
          {
            type: 'image_url' as const,
            image_url: {
              url: `data:${mimeType};base64,${imageBuffer.toString('base64')}`,
            },
          },
        ],
      },
    ],
  }

  for (let attempt = 1; attempt <= MAX_GROQ_ATTEMPTS; attempt += 1) {
    try {
      response = await client.chat.completions.create(request)
      console.info('[Critiq Groq Request]', {
        attempt,
        status: 200,
      })
      break
    } catch (error) {
      const status = getGroqStatus(error)
      const canRetry = isRetryableGroqError(error) && attempt < MAX_GROQ_ATTEMPTS

      if (!canRetry) {
        logGroqApiError(error)
        throw error
      }

      console.warn('[Critiq Groq Retry]', {
        attempt: attempt + 1,
        maxAttempts: MAX_GROQ_ATTEMPTS,
        status,
        reason: getRetryReason(error, status),
      })
      await waitForRetry(attempt)
    }
  }

  if (!response) {
    throw new Error('Groq did not return a response')
  }

  const text = response.choices[0]?.message?.content

  if (!text || typeof text !== 'string') {
    const error = new Error('Groq returned empty response')
    logGroqParseError(error, '')
    throw error
  }

  try {
    const parsed = parseAuditJson(text)
    const validated = validateAuditStructure(parsed)
    const completed = completeOptionalAuditFields({
      ...validated,
      roastSummary: getRoastSummary(parsed),
    })

    console.info('[Critiq Roast Source]', {
      source: roastMode
        ? completed.roastPresent ? 'groq-primary' : 'groq'
        : 'not-requested',
      modelRequested: GROQ_MODEL,
      roastPresent: completed.roastPresent,
    })

    if (roastMode && !completed.roastPresent) {
      const recovery = await recoverRoastSummary(
        client,
        imageBuffer,
        mimeType,
        completed.response
      )

      console.info('[Critiq Roast Source]', {
        source: 'groq-recovery',
        modelRequested: GROQ_MODEL,
        roastPresent: true,
      })

      return normalizeAuditResponse({
        ...completed.response,
        roastSummary: recovery,
      })
    }

    return normalizeAuditResponse(completed.response)
  } catch (error) {
    logGroqParseError(error, text)
    throw error
  }
}
