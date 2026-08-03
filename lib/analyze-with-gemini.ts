import OpenAI from 'openai'
import { normalizeAuditResponse } from '@/lib/normalize-audit-response'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompts'
import type { GeminiAuditResponse } from '@/lib/types'

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

async function generateWithModel(
  modelName: string,
  imageBuffer: Buffer,
  mimeType: string,
  roastMode: boolean
): Promise<GeminiAuditResponse> {
  const client = new OpenAI({
    apiKey: getApiKey(),
    baseURL: 'https://openrouter.ai/api/v1',
  })

  const response = await client.chat.completions.create({
    model: modelName,

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
              url: `data:${mimeType};base64,${imageBuffer.toString(
                'base64'
              )}`,
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

  const parsed = parseGeminiJson(text)

  return normalizeAuditResponse(parsed)
}

export async function analyzeImageWithGemini(
  imageBuffer: Buffer,
  mimeType: string,
  options: AnalyzeImageOptions = {}
): Promise<GeminiAuditResponse> {
  const roastMode = options.roastMode ?? false

  return generateWithModel(
    'openai/gpt-4o-mini',
    imageBuffer,
    mimeType,
    roastMode
  )
}
