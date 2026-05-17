/** Established UX laws and frameworks to ground analysis. */
export const UX_PRINCIPLES = `
Ground every observation in established UX science. Reference principles implicitly in your reasoning (do not lecture — apply them):

NIELSEN HEURISTICS — visibility of system status, match between system and real world, user control, consistency, error prevention, recognition over recall, flexibility, aesthetic/minimalist design, help users recover from errors, help and documentation.

COGNITIVE & INTERACTION LAWS:
• Hick's Law — more choices increase decision time; flag choice overload
• Fitts's Law — target size and distance affect tap/click efficiency
• Jakob's Law — users expect familiar patterns; note violations of conventions
• Miller's Law — working memory limits (~7±2 chunks); flag information density issues
• Progressive disclosure — reveal complexity gradually; penalize feature dumps on first view

ACCESSIBILITY — color contrast (WCAG), touch targets (44px+), text sizing, focus visibility, label association, motion sensitivity.

PRODUCT & GROWTH — time-to-value, onboarding friction, primary vs secondary action clarity, trust signals (social proof, security badges, copy credibility), scanability (F-pattern / Z-pattern), spacing rhythm (8pt grid discipline), typographic hierarchy (scale, weight, line-height).
`.trim()
