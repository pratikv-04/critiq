/**
 * Turns raw provider-layer AI errors into user-friendly messages.
 */
export function toUserFriendlyAIError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error)
  const lower = message.toLowerCase()

  if (lower.includes('groq_api_key')) {
    return 'The critique engine requires an API key to function. Please verify your configuration.'
  }

  // Quota / rate limit / provider overload
  if (
    lower.includes('429') ||
    lower.includes('rate limit') ||
    lower.includes('quota') ||
    lower.includes('503') ||
    lower.includes('overload') ||
    lower.includes('provider unavailable') ||
    lower.includes('capacity') ||
    lower.includes('tokens per day') ||
    lower.includes('tokens per minute')
  ) {
    return 'The critique engine is currently under heavy load. Give it another shot in a few seconds.'
  }

  // Expired / Invalid key
  if (
    lower.includes('api key expired') ||
    lower.includes('expired') ||
    lower.includes('api_key_invalid') ||
    lower.includes('api key not valid') ||
    (lower.includes('400') && lower.includes('key'))
  ) {
    return 'The provided API key is invalid or has expired. Please update your settings and try again.'
  }

  // Permission / API not enabled
  if (lower.includes('401') || lower.includes('403') || lower.includes('permission_denied')) {
    return 'Access to the critique engine was denied. Please ensure the service is enabled in your project.'
  }

  // Model not found
  if (lower.includes('404') || lower.includes('not found')) {
    return 'The designated AI model is currently unavailable. Please try again later.'
  }

  // Safety block
  if (lower.includes('safety') || lower.includes('blocked')) {
    return 'The image could not be processed due to content safety guidelines. Please provide a standard UI screenshot.'
  }

  // Invalid / unreadable image
  if (lower.includes('unable to process input image') || lower.includes('invalid image')) {
    return 'The critique engine could not read this image. Please try a clear PNG or JPG screenshot.'
  }
  
  if (
    lower.includes('timeout') ||
    lower.includes('aborterror') ||
    lower.includes('network') ||
    lower.includes('fetch failed') ||
    lower.includes('enotfound')
  ) {
    return 'The analysis took too long to complete. Please try again in a moment.'
  }

  return 'The critique engine encountered an unexpected interruption. Please try again.'
}
