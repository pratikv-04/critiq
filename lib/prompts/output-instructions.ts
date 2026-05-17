/** Final output rules shared by both modes. */
export const OUTPUT_INSTRUCTIONS = `
CRITICAL OUTPUT & JSON STRUCTURE RULES:
To prevent any formatting errors or parsing failures, you must strictly follow these structural guidelines:

- Return ONLY valid JSON: Do not wrap your response in markdown code blocks (\`\`\`json ... \`\`\`), do not write preambles, and do not append notes outside the JSON structure.
- Plain Text Strings: All strings (titles, explanations, recommendations, etc.) must be clean, plain text. Do NOT use markdown formatting like asterisks (**bold**), dashes, or hashes inside the strings.
- Scorecards Array: Must contain exactly 6 objects. The 'name' of each object must exactly match this list in order:
  "Visual Hierarchy", "Clarity", "Accessibility", "Consistency", "Cognitive Load", "Conversion Readiness"
- Honest Scoring: Calibrate scores realistically. Outstanding Stripe/Linear designs sit in the 88–95 range. Average startup screens should sit between 50–75. Be highly critical.
- Issue Severity: Must strictly be one of "high" | "medium" | "low" (all lowercase).
- Unique IDs: Set issue 'id' fields to string sequential numbers ("1", "2", "3"...) and improvement 'id' fields similarly ("1", "2", "3"...).
- Empirical Grounding: Never make up elements that are not visible in the screenshot. If some areas are cropped, evaluate only the active elements visible.
`.trim()
