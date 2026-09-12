import { NextResponse } from 'next/server'
import { generateRoastSummary, type RoastGenerationContext } from '@/lib/analyze-image'

export const runtime = 'nodejs'

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']

function isRoastContext(value: unknown): value is RoastGenerationContext {
  if (!value || typeof value !== 'object') return false

  const context = value as Record<string, unknown>
  return Array.isArray(context.scorecards) &&
    Array.isArray(context.whatWorking) &&
    Array.isArray(context.issues) &&
    Array.isArray(context.improvements)
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('image')
    const contextText = formData.get('analysis')

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No screenshot provided.' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid screenshot type.' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'Screenshot is too large.' }, { status: 400 })
    }

    if (typeof contextText !== 'string') {
      return NextResponse.json({ error: 'No completed analysis provided.' }, { status: 400 })
    }

    let context: RoastGenerationContext
    try {
      const parsed: unknown = JSON.parse(contextText)
      if (!isRoastContext(parsed)) throw new Error('Invalid analysis context')
      context = parsed
    } catch {
      return NextResponse.json({ error: 'Invalid completed analysis.' }, { status: 400 })
    }

    console.info('[Critiq Roast Toggle]', {
      action: 'generate',
      source: 'groq-roast-only',
    })

    const roastSummary = await generateRoastSummary(
      Buffer.from(await file.arrayBuffer()),
      file.type,
      context
    )

    if (!roastSummary) {
      throw new Error('Groq returned an empty roastSummary')
    }

    console.info('[Critiq Roast Source]', {
      source: 'groq-roast-only',
      roastPresent: true,
    })

    return NextResponse.json({ roastSummary })
  } catch (error) {
    console.error('[Critiq Roast API Error]', {
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      errorMessage: error instanceof Error ? error.message.slice(0, 500) : 'Unknown error',
    })

    return NextResponse.json(
      { error: 'Roast generation failed. Your completed analysis is still available.' },
      { status: 502 }
    )
  }
}
