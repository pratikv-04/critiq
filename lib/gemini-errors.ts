/**
 * Turns raw Google Generative AI / Gemini API errors into user-friendly messages.
 */
export function toUserFriendlyGeminiError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)

  if (message.includes('GEMINI_API_KEY')) {
    return 'The critique engine requires an API key to function. Please verify your configuration.'
  }

  // Quota / rate limit / 503
  if (
    message.includes('429') ||
    message.includes('quota') ||
    message.includes('Quota exceeded') ||
    message.includes('503') ||
    message.includes('overload')
  ) {
    return 'The critique engine is currently under heavy load. Give it another shot in a few seconds.'
  }

  // Expired / Invalid key
  if (
    message.includes('API key expired') ||
    message.includes('expired') ||
    message.includes('API_KEY_INVALID') ||
    message.includes('API key not valid') ||
    (message.includes('400') && message.includes('key'))
  ) {
    return 'The provided API key is invalid or has expired. Please update your settings and try again.'
  }

  // Permission / API not enabled
  if (message.includes('403') || message.includes('PERMISSION_DENIED')) {
    return 'Access to the critique engine was denied. Please ensure the service is enabled in your project.'
  }

  // Model not found
  if (message.includes('404') || message.includes('not found') || message.includes('NOT_FOUND')) {
    return 'The designated AI model is currently unavailable. We will automatically attempt a fallback.'
  }

  // Safety block
  if (message.includes('SAFETY') || message.includes('blocked')) {
    return 'The image could not be processed due to content safety guidelines. Please provide a standard UI screenshot.'
  }

  // Invalid / unreadable image
  if (message.includes('Unable to process input image') || message.includes('invalid image')) {
    return 'The critique engine could not read this image. Please try a clear PNG or JPG screenshot.'
  }
  
  if (message.includes('timeout') || message.includes('AbortError')) {
    return 'The analysis took too long to complete. Please try again in a moment.'
  }

  return 'The critique engine encountered an unexpected interruption. Please try again.'
}
