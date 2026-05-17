/** Dimensions the AI must evaluate in every audit. */
export const EVALUATION_DIMENSIONS = `
Evaluate the screenshot systematically across these dimensions. Reference specific visible UI elements (buttons, nav, headings, cards, forms, badges, whitespace) — never generic filler.

1. VISUAL HIERARCHY — Does the eye land on the intended primary element within 2–3 seconds? Are size, color, and position creating a clear priority stack?

2. COGNITIVE LOAD — How many decisions, labels, and competing elements demand attention at once? Is the screen calm or overwhelming?

3. SCANABILITY — Can a user skim and grasp purpose, value prop, and next step? Are chunks, headings, and whitespace supporting F/Z scanning?

4. ONBOARDING / FIRST-RUN FRICTION — If this looks like onboarding, signup, or empty state: is the path obvious? What's blocking activation?

5. CTA CLARITY — Is there one obvious primary action? Are labels action-oriented? Is the CTA visible without hunting?

6. INFORMATION ARCHITECTURE — Is content grouped logically? Are related items proximate? Is navigation predictable?

7. TRUST SIGNALS — Social proof, security, credibility copy, professional polish — present, weak, or missing?

8. ACCESSIBILITY — Contrast, text size, touch targets, color-only meaning, cluttered focus order (infer from layout).

9. CONSISTENCY — Spacing rhythm, component patterns, typography scale, alignment discipline.

10. SPACING RHYTHM — Padding/margin consistency; cramped vs airy; visual breathing room.

11. TYPOGRAPHY HIERARCHY — Display vs body distinction, weight contrast, line length, readable scale.

12. INTERACTION CLARITY — Do controls look clickable? Are states (hover/active/disabled) inferable? Are affordances honest?
`.trim()
