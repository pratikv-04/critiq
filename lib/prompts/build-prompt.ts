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

Keep the response concise enough to fit the 800-token output limit. Scorecard descriptions must be very short, ideally 8-14 words. Use short, specific sentences in every field.

Return only this JSON object, with no markdown, code fences, commentary, or extra properties:
- scorecards: exactly 12 objects, in the requested category order; each must contain name, score, description.
- whatWorking: always include this array, with at most 3 concise strings.
- issues: always include this array, with at most 3 concise objects; each must contain id, title, severity, explanation, whyItMatters, userFriction, recommendation.
- roastSummary: ${options.roastMode ? 'required non-empty string for Roast Mode' : 'omit this field or return an empty string; do not spend tokens on roast copy'}.
- improvements: always include this array, with at most 3 concise objects; each must contain id, title, description, impact.

Complete EVERY required core property. Never omit a core field to save tokens. ${options.roastMode ? 'Roast Mode also requires a non-empty roastSummary.' : 'In standard mode, roastSummary is not needed.'} improvements may be [] only when there are no concise improvements to report. Prioritize completing the JSON structure over adding detail. Do not add keys such as verdictScore.

Avoid overly rounded scores like 70, 80, and 90 unless strongly justified.

Use nuanced realistic scoring such as:
67, 72, 74, 81, 84, 88, etc.

Not every category should score highly.
Scores should feel evidence-based and varied.

If roast mode is enabled, keep the exact same scoring standards and numeric outputs.
Only the tone of the written feedback may change.

${options.roastMode ? "The 'roastSummary' is mandatory and must never be empty. Write 1-3 concise sentences that are witty, playful, direct, and specific to this screenshot, using concrete visible UI observations and actual issue details rather than merely repeating scores. Roast the interface, not the designer; keep it sharp without being abusive. It must:\n- open with one sharp, screenshot-specific observation\n- connect the humor to actual visual/UI evidence and the main issues\n- end with the biggest actionable opportunity\n- stay specific to this screenshot, not generic\n- avoid formulaic phrasing such as \\\"X and Y are carrying the critique\\\", \\\"Start with X before polishing the edges\\\", or \\\"The design is trying to...\\\"\n- vary the opening and sentence rhythm naturally based on the findings." : "Do not generate roast copy in standard mode; keep the response focused on the required audit fields."}`
}
