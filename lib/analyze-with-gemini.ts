import OpenAI from 'openai'
import { AUDIT_RESPONSE_SCHEMA } from '@/lib/audit-response-schema'
import { normalizeAuditResponse } from '@/lib/normalize-audit-response'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts'
import type { GeminiAuditResponse } from '@/lib/types'

const MODEL_FALLBACK_CHAIN = [
  'gemini-2.0-flash',
].filter((m): m is string => Boolean(m))
                 
export interface AnalyzeImageOptions {
  roastMode?: boolean
}

function getApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY?.trim()

  if (!key) {
    throw new Error('OPENROUTER_API_KEY is not configured')
  }

  return key
}

function parseGeminiJson(text: string): GeminiAuditResponse {
  const cleaned = text
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()

  return JSON.parse(cleaned) as GeminiAuditResponse
}

function isRetryableError(error: unknown): boolean {
  const msg =
    error instanceof Error
      ? error.message.toLowerCase()
      : String(error).toLowerCase()

  return (
    msg.includes('429') ||
    msg.includes('quota') ||
    msg.includes('quota exceeded') ||
    msg.includes('503') ||
    msg.includes('overloaded') ||
    msg.includes('unavailable') ||
    msg.includes('internal') ||
    msg.includes('timeout') ||
    msg.includes('temporarily unavailable')
  )
}

async function generateWithModel(
  modelName: string,
  imageBuffer: Buffer,
  mimeType: string,
  roastMode: boolean
): Promise<GeminiAuditResponse> {
  const genAI = new GoogleGenerativeAI(getApiKey())

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: buildSystemPrompt({ roastMode }),
    generationConfig: {
      temperature: roastMode ? 0.45 : 0.2,
      topP: 0.9,
    },
  })

  const result = await model.generateContent([
    buildUserPrompt({ roastMode }),
    {
      inlineData: {
        data: imageBuffer.toString('base64'),
        mimeType,
      },
    },
  ])

  const text = result.response.text()

  if (!text) {
    throw new Error('Gemini returned an empty response')
  }

  const parsed = parseGeminiJson(text)

  return normalizeAuditResponse(parsed)
}

export async function analyzeImageWithGemini(
  imageBuffer: Buffer,
  mimeType: string,
  options: AnalyzeImageOptions = {}
): Promise<GeminiAuditResponse> {
  const roastMode = options.roastMode ?? false

  let lastError: unknown

  for (const modelName of MODEL_FALLBACK_CHAIN) {
    try {
      return await generateWithModel(
        modelName,
        imageBuffer,
        mimeType,
        roastMode
      )
    } catch (error) {
      lastError = error

      console.error(`[Gemini Error - ${modelName}]`, error)

      if (!isRetryableError(error)) {
        throw error
      }
    }
  }
  // redeploy test
  throw lastError ?? new Error('All Gemini models failed')
}