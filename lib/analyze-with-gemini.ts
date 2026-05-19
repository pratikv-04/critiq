import { GoogleGenerativeAI } from '@google/generative-ai'
import { AUDIT_RESPONSE_SCHEMA } from '@/lib/audit-response-schema'
import { normalizeAuditResponse } from '@/lib/normalize-audit-response'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts'
import type { GeminiAuditResponse } from '@/lib/types'

/** Models tried in order. Duplicates act as retries. */
const MODEL_FALLBACK_CHAIN = [
  process.env.GEMINI_MODEL,
  'gemini-2.5-flash',
  'gemini-2.5-flash', // Automatically retry once
  'gemini-1.5-flash',
].filter((m): m is string => Boolean(m))

export interface AnalyzeImageOptions {
  roastMode?: boolean
}

function getApiKey(): string {
  

  const key = "AIzaSyA2aK1tq_DIcPDdG_DuI95lXRnd2c07lgo"
  if (!key) {
    throw new Error('GEMINI_API_KEY is not configured. Add it to .env.local')
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

function isQuotaError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error)
  return msg.includes('429') || msg.includes('quota') || msg.includes('Quota exceeded')
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
      responseMimeType: 'application/json',
      responseSchema: AUDIT_RESPONSE_SCHEMA,
      temperature: roastMode ? 0.3 : 0.1,
      topP: 0.95,
    },
  })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60000)

  try {
    const result = await model.generateContent([
      buildUserPrompt({ roastMode }),
      {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType,
        },
      },
    ], { signal: controller.signal })

    const text = result.response.text()
    if (!text) {
      throw new Error('Gemini returned an empty response')
    }

    const parsed = parseGeminiJson(text)
    return normalizeAuditResponse(parsed)
  } finally {
    clearTimeout(timeout)
  }
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
      return await generateWithModel(modelName, imageBuffer, mimeType, roastMode)
    } catch (error) {
      lastError = error
      console.warn(`[gemini] Model ${modelName} failed:`, error)

      // Try next model on quota, 503, or timeout errors
      if (!isQuotaError(error) && !String(error).includes('503') && !String(error).includes('AbortError')) {
        throw error
      }
    }
  }

  throw lastError ?? new Error('All Gemini models failed')
}
