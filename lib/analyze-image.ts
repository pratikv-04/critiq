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

function getGroqApiKey(): string {
  const key = process.env.GROQ_API_KEY?.trim()

  if (!key) {
    throw new Error('GROQ_API_KEY is not configured')
  }

  return key
}

function parseAuditJson(text: string): GeminiAuditResponse {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  return JSON.parse(cleaned) as GeminiAuditResponse
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
  console.error('[Critiq Groq Parse Error]', {
    modelRequested: GROQ_MODEL,
    errorMessage: redactLogValue(error),
    responseBodyPresent: responseText.length > 0,
    responseTextLength: responseText.length,
  })
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
    return normalizeAuditResponse(parseAuditJson(text))
  } catch (error) {
    logGroqParseError(error, text)
    throw error
  }
}
