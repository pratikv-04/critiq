/** Active pattern detection — things to hunt for in every screenshot. */
export const DETECTION_PATTERNS = `
Actively scan for these anti-patterns. Only report what you can substantiate from the image:

• Competing CTAs — multiple buttons fighting for primary status
• Weak hierarchy — everything same visual weight; no clear hero
• Clutter — dense UI with insufficient whitespace or grouping
• Poor spacing consistency — uneven gaps, misaligned grids
• Confusing layouts — unrelated elements competing for attention
• Weak affordances — flat text that should be buttons; unclear click targets
• Inaccessible contrast — light gray on white, low-contrast text, tiny type
• Feature overload — too many options, tabs, or modules on one screen
• Poor scanability — wall of text, missing headings, no visual anchors
• Hidden primary actions — CTA below fold, ghost styling, or buried in nav
• Confusing navigation — unclear IA, too many nav items, ambiguous labels
• Onboarding dead-ends — no clear next step or value demonstration
• Trust gaps — missing proof, vague claims, amateur polish
• Typography chaos — too many sizes/weights without system
`.trim()
