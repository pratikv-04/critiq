import { NextResponse } from 'next/server'
import { analyzeImage } from '@/lib/analyze-image'
import { toUserFriendlyGeminiError } from '@/lib/gemini-errors'

export const runtime = 'nodejs'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
]

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const file = formData.get('image')

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        {
          error:
            'No image file provided. Upload a screenshot and try again.',
        },
        { status: 400 }
      )
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file type. Please upload PNG, JPG, or WebP.',
        },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: 'File is too large. Maximum size is 10 MB.',
        },
        { status: 400 }
      )
    }

    const roastMode = formData.get('roastMode') === 'true'

    const arrayBuffer = await file.arrayBuffer()

    const buffer = Buffer.from(arrayBuffer)

    const audit = await analyzeImage(
      buffer,
      file.type,
      { roastMode }
    )

    return NextResponse.json(audit)
  } catch (error) {
    console.error('[Analyze API Error]', error)

    const message = toUserFriendlyGeminiError(error)

    const raw =
      error instanceof Error
        ? error.message.toLowerCase()
        : String(error).toLowerCase()

    const status =
      raw.includes('429') ||
        raw.includes('quota')
        ? 429
        : raw.includes('api key')
          ? 500
          : 502

    return NextResponse.json(
      {
        error: message,
      },
      { status }
    )
  }
}
