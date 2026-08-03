import { CORE_SYSTEM_PROMPT } from './core-system'
import { EVALUATION_CATEGORIES } from './evaluation-categories'
import { ROAST_LAYER } from './roast-layer'

export interface BuildPromptOptions {
  roastMode: boolean
}

/**
 * Assembles the full system instruction for Gemini from modular prompt files.
 */
export function buildSystemPrompt(options: BuildPromptOptions): string {
  const parts = [CORE_SYSTEM_PROMPT, EVALUATION_CATEGORIES]

  if (options.roastMode) {
    parts.push(ROAST_LAYER)
  }

  return parts.join('\n\n')
}

/**
 * User-facing task message sent alongside the image.
 */
export function buildUserPrompt(options: BuildPromptOptions): string {
  const modeLabel = options.roastMode
    ? 'ROAST MODE is ON — deliver witty, sarcastic critique alongside the audit.'
    : 'STANDARD MODE — deliver a professional product design critique.'

  return `${modeLabel}

Analyze this UI screenshot. Produce a rigorous UX audit as JSON.

Follow this sequence:
1. Identify interface type and primary user job-to-be-done.
2. Trace visual hierarchy.
3. Score each of the 12 categories honestly on a 0-100 scale.
4. Document specific, evidence-based issues and clear improvements.

Return the complete JSON object now.

Avoid overly rounded scores like 70, 80, and 90 unless strongly justified.

Use nuanced realistic scoring such as:
67, 72, 74, 81, 84, 88, etc.

Not every category should score highly.
Scores should feel evidence-based and varied.

If roast mode is enabled, keep the exact same scoring standards and numeric outputs.
Only the tone of the written feedback may change.

In roast mode, the 'roastSummary' must:
- open with one sharp one-liner
- include 2 to 4 evidence-based observations tied to the weakest categories
- end with one hard-truth sentence about the biggest opportunity
- stay specific to this screenshot, not generic.`
}
