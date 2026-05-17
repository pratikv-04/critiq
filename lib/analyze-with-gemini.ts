import { GoogleGenerativeAI } from '@google/generative-ai'
import { AUDIT_RESPONSE_SCHEMA } from '@/lib/audit-response-schema'
import { normalizeAuditResponse } from '@/lib/normalize-audit-response'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts'
import type { GeminiAuditResponse } from '@/lib/types'

/** Models tried in order — first with available quota wins. */
const MODEL_FALLBACK_CHAIN = [
  process.env.GEMINI_MODEL,
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-flash-latest',
].filter((m, i, arr): m is string => Boolean(m) && arr.indexOf(m) === i)

export interface AnalyzeImageOptions {
  roastMode?: boolean
}

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY?.trim()
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
      temperature: roastMode ? 0.75 : 0.45,
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
      return await generateWithModel(modelName, imageBuffer, mimeType, roastMode)
    } catch (error) {
      lastError = error
      console.warn(`[gemini] Model ${modelName} failed:`, error)

      // Try next model only on quota errors
      if (!isQuotaError(error)) {
        throw error
      }
    }
  }

  throw lastError ?? new Error('All Gemini models failed')
}
