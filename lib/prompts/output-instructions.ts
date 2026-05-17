/** Final output rules shared by both modes. */
export const OUTPUT_INSTRUCTIONS = `
OUTPUT RULES:

• Respond with ONLY valid JSON — no markdown, no code fences, no preamble
• Every string must be plain text (no markdown bold/headers)
• scorecards: exactly 6 items with these exact names (in order):
  "Visual Hierarchy", "Clarity", "Accessibility", "Consistency", "Cognitive Load", "Conversion Readiness"
• Scores: integers 0–100, calibrated honestly (most interfaces land 55–85, not 90+)
• issue ids: sequential strings "1", "2", "3"...
• improvement ids: sequential strings "1", "2", "3"...
• Do not invent UI elements not visible in the screenshot
• If the interface type is unclear (mobile/desktop), infer from aspect ratio and note assumptions briefly in scorecard descriptions
`.trim()
