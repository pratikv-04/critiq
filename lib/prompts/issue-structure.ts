/** How every issue in the response must be structured. */
export const ISSUE_STRUCTURE_RULES = `
CRITIQUE ISSUE STRUCTURE RULES:
For EVERY issue you report, you must provide all five parts. Ensure each field has high-quality substance (2–4 descriptive, analytical sentences) and is completely grounded in visible facts:

1. explanation: Define EXACTLY what visual defect is present. Name the buttons, headers, cards, or labels and where they sit.
2. whyItMatters: Link the visual defect directly to product growth, CRO funnel leaks, retention drop-offs, or WCAG compliance violations. Explain the technical "why".
3. userFriction: Analyze the user's psychological reaction. Describe their hesitation, sensory distraction, cognitive fatigue, visual scanning disruption, or task abandonment.
4. severity: Assign a strict level based on friction:
   - "high": Fatal usability roadblocks, complete visual chaos, or critical accessibility breaches.
   - "medium": Noteworthy conversion leaks, confusing layout grouping, or general page friction.
   - "low": Spacing polish, minor visual styling inconsistencies, or typographic fine-tuning.
5. recommendation: Provide a concrete, highly actionable design specification proposal that a designer could implement immediately in Figma or code.

Ensure issues are prioritized by user impact, and ordered from highest to lowest severity. Report between 4 to 7 high-leverage issues. Do not write generic or vague fluff.
`.trim()
