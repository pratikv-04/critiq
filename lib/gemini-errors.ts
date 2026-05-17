/**
 * Turns raw Google Generative AI / Gemini API errors into user-friendly messages.
 */
export function toUserFriendlyGeminiError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)

  if (message.includes('GEMINI_API_KEY')) {
    return message
  }

  // Quota / rate limit
  if (message.includes('429') || message.includes('quota') || message.includes('Quota exceeded')) {
    return (
      'Gemini API quota exceeded for this model. Wait a minute and try again, or enable billing / ' +
      'create a new API key at https://aistudio.google.com/apikey'
    )
  }

  // Expired key
  if (message.includes('API key expired') || message.includes('expired')) {
    return (
      'Your Gemini API key has expired. Create a new key at https://aistudio.google.com/apikey ' +
      'and update GEMINI_API_KEY in .env.local, then restart the dev server.'
    )
  }

  // Invalid key
  if (
    message.includes('API_KEY_INVALID') ||
    message.includes('API key not valid') ||
    (message.includes('400') && message.includes('key'))
  ) {
    return (
      'Invalid Gemini API key. Check GEMINI_API_KEY in .env.local and create a key at ' +
      'https://aistudio.google.com/apikey'
    )
  }

  // Permission / API not enabled
  if (message.includes('403') || message.includes('PERMISSION_DENIED')) {
    return (
      'Gemini API access denied. Enable the Generative Language API for your project in Google Cloud.'
    )
  }

  // Model not found
  if (message.includes('404') || message.includes('not found') || message.includes('NOT_FOUND')) {
    return 'The configured Gemini model is unavailable. The app will retry with an alternate model on next deploy.'
  }

  // Safety block
  if (message.includes('SAFETY') || message.includes('blocked')) {
    return 'The image could not be analyzed due to content safety filters. Try a different screenshot.'
  }

  // Invalid / unreadable image
  if (message.includes('Unable to process input image') || message.includes('invalid image')) {
    return 'Gemini could not read this image. Try a clear PNG or JPG screenshot under 10 MB.'
  }

  // Strip noisy prefix for display
  const cleaned = message
    .replace(/\[GoogleGenerativeAI Error\]:\s*/i, '')
    .replace(/Error fetching from[^:]+:\s*/i, '')
    .trim()

  if (cleaned.length > 280) {
    return cleaned.slice(0, 280) + '…'
  }

  return cleaned || 'Failed to analyze the screenshot. Please try again.'
}
