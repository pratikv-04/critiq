/** Active pattern detection — things to hunt for in every screenshot. */
export const DETECTION_PATTERNS = `
INTERFACE DETECTOR CHECKLIST (ANTI-PATTERNS TO HUNT FOR):
Actively scan the screenshot for these common design anti-patterns. Do not report them genericially; call them out only if you can point directly to visual proof:

1. CLUTTER & SENSORY OVERLOAD:
   - High pixel density, too many cards, labels, boxes, or lines competing for visual space.
   - Text elements squished next to each other without breathing room (broken line height or spacing).

2. WEAK VISUAL HIERARCHY:
   - Elements sharing identical size, color, or weight, forcing the eye to scan everything instead of landing on a clean focus point.
   - Headers and subheaders blending together.

3. COMPETING CALLS TO ACTION (CTAs):
   - Multiple primary buttons side-by-side (e.g. two solid filled buttons) competing for priority.
   - Lack of distinct styling between primary, secondary, and tertiary buttons.

4. INACCESSIBLE CONTRAST:
   - Light gray text on a white background, or white text on a light gray background.
   - Tiny font sizes (under 12px for body, under 14px for micro-copy) that hinder readability.

5. POOR SCANABILITY:
   - Large blocks/walls of text without headers, bullet points, bold key terms, or visual break elements.
   - Absence of structural landmarks (cards, dividers, icons) that guide eye movement.

6. HIDDEN PRIMARY ACTIONS:
   - Placing primary action buttons far down the page (below the fold) or inside deep, nested hamburger menus.
   - Utilizing weak, outline ("ghost") styles for the main conversion goal.

7. WEAK INTERACTION AFFORDANCES:
   - Static elements (labels, headers) that look like buttons or inputs, or inputs/buttons that look like static text.
   - Click targets or buttons missing clear visual cues of clickability.

8. CONFUSING NAVIGATION & IA:
   - Nav bar holding more than 7 items, or ambiguous labels (e.g. "Resources", "More", "Tools") that don't convey clear direction.
   - Lack of visual grouping (Gestalt Proximity) between related items.

9. FEATURE OVERLOAD & DENSE FORM FACTOR:
   - Overloading one screen with tabs, charts, lists, and toggles, creating severe decision fatigue.
`.trim()
