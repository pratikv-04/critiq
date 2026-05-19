/** Final output rules shared by both modes. */
export const OUTPUT_INSTRUCTIONS = `
CRITICAL OUTPUT & JSON STRUCTURE RULES:
To prevent any formatting errors or parsing failures, you must strictly follow these structural guidelines:

- Return ONLY valid JSON: Do not wrap your response in markdown code blocks (\`\`\`json ... \`\`\`), do not write preambles, and do not append notes outside the JSON structure.
- Plain Text Strings: All strings (titles, explanations, recommendations, etc.) must be clean, plain text. Do NOT use markdown formatting like asterisks (**bold**), dashes, or hashes inside the strings.
- Scorecards Array: Must contain EXACTLY 10 objects. The 'name' of each object must EXACTLY match this list in order:
  "Visual Hierarchy", "Typography", "Spacing & Layout", "Accessibility", "CTA Clarity", "Information Density", "UX Friction", "Visual Consistency", "Emotional Tone", "Mobile Friendliness"
- Deterministic Scoring: Use this precise scale: 0–3 = poor, 4–6 = average, 7–8 = strong, 9–10 = exceptional. Base scores strictly on visual evidence. If roast mode is ON, DO NOT let it artificially lower the score; keep scoring objective and use the roast exclusively in the roastSummary.
- Issue Severity: Must strictly be one of "high" | "medium" | "low" (all lowercase).
- Unique IDs: Set issue 'id' fields to string sequential numbers ("1", "2", "3"...) and improvement 'id' fields similarly ("1", "2", "3"...).
- Empirical Grounding: Never make up elements that are not visible in the screenshot.
`.trim()
