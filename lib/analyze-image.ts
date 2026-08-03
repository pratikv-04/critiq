import OpenAI from 'openai'
import { normalizeAuditResponse } from '@/lib/normalize-audit-response'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts'
import type { GeminiAuditResponse } from '@/lib/types'

export interface AnalyzeImageOptions {
  roastMode?: boolean
}

type ProviderMode = 'openrouter' | 'gemini' | 'auto'
type ProviderName = 'openrouter' | 'gemini'

const OPENROUTER_MODEL = 'openai/gpt-4o-mini'
const GEMINI_MODEL = 'gemini-3.5-flash'
const GENERATION_TEMPERATURE = 0.2
const MAX_OUTPUT_TOKENS = 2500

function parseProviderMode(): ProviderMode {
  const raw = process.env.AI_PROVIDER_MODE?.trim().toLowerCase()

  if (raw === 'openrouter' || raw === 'gemini' || raw === 'auto') {
    return raw
  }

  return 'auto'
}

function getOpenRouterApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY?.trim()

  if (!key) {
    throw new Error('OPENROUTER_API_KEY is not configured')
  }

  return key
}

function getGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY?.trim()

  if (!key) {
    throw new Error('GEMINI_API_KEY is not configured')
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

function logDev(message: string, payload?: unknown) {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  if (payload === undefined) {
    console.log(message)
    return
  }

  console.log(message, payload)
}

function extractGeminiText(response: unknown): string {
  const data = response as {
    candidates?: Array<{
      content?: {
        parts?: Array<{
          text?: string
        }>
      }
    }>
  }

  const parts = data.candidates?.[0]?.content?.parts ?? []
  const text = parts
    .map((part) => part.text ?? '')
    .join('')
    .trim()

  if (!text) {
    throw new Error('Gemini returned empty response')
  }

  return text
}

function isRetryableOpenRouterFailure(error: unknown): boolean {
  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : String(error).toLowerCase()

  return (
    message.includes('insufficient credits') ||
    message.includes('quota') ||
    message.includes('429') ||
    message.includes('provider unavailable') ||
    message.includes('unavailable') ||
    message.includes('network') ||
    message.includes('fetch failed') ||
    message.includes('econnreset') ||
    message.includes('etimedout') ||
    message.includes('timeout') ||
    message.includes('enotfound') ||
    message.includes('econnrefused')
  )
}

async function generateWithOpenRouter(
  imageBuffer: Buffer,
  mimeType: string,
  roastMode: boolean
): Promise<GeminiAuditResponse> {
  const client = new OpenAI({
    apiKey: getOpenRouterApiKey(),
    baseURL: 'https://openrouter.ai/api/v1',
  })

  const response = await client.chat.completions.create({
    model: OPENROUTER_MODEL,
    temperature: GENERATION_TEMPERATURE,
    max_tokens: MAX_OUTPUT_TOKENS,
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

  const text = response.choices[0]?.message?.content

  if (!text || typeof text !== 'string') {
    throw new Error('OpenRouter returned empty response')
  }

  return parseAuditJson(text)
}

async function generateWithGemini(
  imageBuffer: Buffer,
  mimeType: string,
  roastMode: boolean
): Promise<GeminiAuditResponse> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': getGeminiApiKey(),
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: buildSystemPrompt({ roastMode }),
            },
          ],
        },
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: buildUserPrompt({ roastMode }),
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: imageBuffer.toString('base64'),
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: GENERATION_TEMPERATURE,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
        },
      }),
    }
  )

  if (!response.ok) {
    const bodyText = await response.text()
    throw new Error(`Gemini API ${response.status}: ${bodyText}`)
  }

  const json = await response.json()
  return parseAuditJson(extractGeminiText(json))
}

async function runProvider(
  provider: ProviderName,
  imageBuffer: Buffer,
  mimeType: string,
  roastMode: boolean
): Promise<GeminiAuditResponse> {
  if (provider === 'openrouter') {
    return generateWithOpenRouter(imageBuffer, mimeType, roastMode)
  }

  return generateWithGemini(imageBuffer, mimeType, roastMode)
}

export async function analyzeImage(
  imageBuffer: Buffer,
  mimeType: string,
  options: AnalyzeImageOptions = {}
): Promise<GeminiAuditResponse> {
  const roastMode = options.roastMode ?? false
  const mode = parseProviderMode()

  if (mode === 'gemini') {
    const audit = normalizeAuditResponse(
      await runProvider('gemini', imageBuffer, mimeType, roastMode)
    )
    logDev('[Critiq Provider] handled by', 'gemini')
    return audit
  }

  if (mode === 'openrouter') {
    const audit = normalizeAuditResponse(
      await runProvider('openrouter', imageBuffer, mimeType, roastMode)
    )
    logDev('[Critiq Provider] handled by', 'openrouter')
    return audit
  }

  try {
    const audit = normalizeAuditResponse(
      await runProvider('openrouter', imageBuffer, mimeType, roastMode)
    )
    logDev('[Critiq Provider] handled by', 'openrouter')
    return audit
  } catch (error) {
    if (!isRetryableOpenRouterFailure(error)) {
      throw error
    }

    logDev('[Critiq Provider] OpenRouter failed, retrying with Gemini')

    const audit = normalizeAuditResponse(
      await runProvider('gemini', imageBuffer, mimeType, roastMode)
    )
    logDev('[Critiq Provider] handled by', 'gemini')
    return audit
  }
}

