/** Final output rules shared by both modes. */
export const OUTPUT_INSTRUCTIONS = `
CRITICAL OUTPUT & JSON STRUCTURE RULES:
To prevent any formatting errors or parsing failures, you must strictly follow these structural guidelines:

- Return ONLY valid JSON: Do not wrap your response in markdown code blocks (\`\`\`json ... \`\`\`), do not write preambles, and do not append notes outside the JSON structure.
- Plain Text Strings: All strings (titles, explanations, recommendations, etc.) must be clean, plain text. Do NOT use markdown formatting like asterisks (**bold**), dashes, or hashes inside the strings.
- Scorecards Array: Must contain EXACTLY 10 objects. The 'name' of each object must EXACTLY match this list in order:
  "Visual Hierarchy", "Typography", "Spacing & Layout", "Accessibility", "CTA Clarity", "Information Density", "UX Friction", "Visual Consistency", "Emotional Tone", "Mobile Friendliness"
- BENCHMARK CALIBRATION & SCORING REDEFINITION:
  Calibrate evaluation against modern premium digital products (e.g., Linear, Notion, Stripe, Framer, Apple, Airbnb, Vercel, Arc, Raycast). Modern clean SaaS interfaces are often already competent.
  Recalibrate scoring to represent OVERALL PRODUCT MATURITY, not "number of critique points." Most decent modern SaaS/product interfaces should naturally score between 6.5–8.5.
  * 9–10: Exceptional world-class execution. Rare. Comparable to elite product craftsmanship.
  * 8–9: Strong polished modern product design. Professional and highly competent.
  * 7–8: Good modern UX with meaningful but non-critical refinement opportunities.
  * 6–7: Usable and competent but inconsistent in hierarchy, clarity, or polish.
  * 4–6: Noticeable UX and communication weaknesses affecting product quality.
  * 0–4: Severe usability, hierarchy, accessibility, or clarity failures. (A score in the 3s implies severe UX failure, unusable product quality, broken experience. Do NOT assign these scores to competent modern interfaces.)
  * IMPORTANT: Minor issues (e.g., slightly inconsistent spacing, icon polish, typography refinement, visual rhythm improvements) should NOT dramatically tank scores. Weight severity appropriately.
  If roast mode is ON, DO NOT let it artificially lower the score; keep scoring objective.
- Issue Severity: Must strictly be one of "high" | "medium" | "low" (all lowercase).
- Unique IDs: Set issue 'id' fields to string sequential numbers ("1", "2", "3"...) and improvement 'id' fields similarly ("1", "2", "3"...).
- Empirical Grounding: Never make up elements that are not visible in the screenshot.
`.trim()
