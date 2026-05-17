/** How every issue in the response must be structured. */
export const ISSUE_STRUCTURE_RULES = `
For EVERY issue you report, provide all five parts with substance (2–4 sentences each where appropriate):

1. explanation — What is wrong? Name specific UI elements and what you observe.
2. whyItMatters — Why does this hurt product outcomes? Tie to conversion, retention, accessibility, or trust.
3. userFriction — How will real users feel or behave? Describe confusion, hesitation, abandonment, or errors.
4. severity — "high" (blocks core task or accessibility), "medium" (meaningful friction), "low" (polish/optimization)
5. recommendation — Concrete, implementable fix a designer could ship this sprint.

Prioritize issues by user impact. Include 4–7 issues. Order from highest to lowest severity.
`.trim()
