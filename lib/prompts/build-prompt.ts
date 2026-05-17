import { DETECTION_PATTERNS } from './detection-patterns'
import { EVALUATION_DIMENSIONS } from './evaluation-dimensions'
import { EXPERT_PERSONAS } from './personas'
import { ISSUE_STRUCTURE_RULES } from './issue-structure'
import { OUTPUT_INSTRUCTIONS } from './output-instructions'
import { UX_PRINCIPLES } from './principles'
import { TONE_ROAST } from './tone-roast'
import { TONE_STANDARD } from './tone-standard'

export interface BuildPromptOptions {
  roastMode: boolean
}

/**
 * Assembles the full system instruction for Gemini from modular prompt files.
 */
export function buildSystemPrompt(options: BuildPromptOptions): string {
  const tone = options.roastMode ? TONE_ROAST : TONE_STANDARD

  return [
    EXPERT_PERSONAS,
    UX_PRINCIPLES,
    EVALUATION_DIMENSIONS,
    DETECTION_PATTERNS,
    ISSUE_STRUCTURE_RULES,
    tone,
    OUTPUT_INSTRUCTIONS,
  ].join('\n\n')
}

/**
 * User-facing task message sent alongside the image.
 */
export function buildUserPrompt(options: BuildPromptOptions): string {
  const modeLabel = options.roastMode
    ? 'ROAST MODE is ON — deliver witty, sarcastic, meme-aware critique that remains deeply insightful.'
    : 'STANDARD MODE — deliver a senior staff-level product design critique.'

  return `${modeLabel}

Analyze this UI screenshot. Produce a rigorous UX audit as JSON.

Before writing JSON, mentally complete this review sequence:
1. Identify interface type (landing, dashboard, onboarding, settings, mobile app, etc.)
2. Determine the primary user job-to-be-done
3. Trace the visual hierarchy — where does the eye go in 2 seconds?
4. Hunt for anti-patterns from the detection checklist
5. Score each dimension honestly with evidence from the image
6. Prioritize issues by user and business impact

Return the complete JSON object now.`
}
