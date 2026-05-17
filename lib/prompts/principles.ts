/** Established UX laws and frameworks to ground analysis. */
export const UX_PRINCIPLES = `
ESTABLISHED LAWS & FRAMEWORKS OF HUMAN-COMPUTER INTERACTION (HCI):
Always ground your audit observations and recommendations implicitly in these scientific UX principles (do not lecture the user with textbook definitions; apply them directly to what is visible):

1. NIELSEN'S HEURISTICS (HEURISTIC EVALUATION)
   - Aesthetic and Minimalist Design: Strip out unnecessary details to preserve focus.
   - Consistency & Standards: Follow platform design guidelines so users aren't confused.
   - Visibility of System Status: Clearly represent states (loading, empty, success, errors).
   - Recognition Rather Than Recall: Make options visible instead of forcing memory retrieval.
   - Flexibility & Efficiency of Use: Include accelerators for power users while maintaining simplicity.

2. COGNITIVE LAWS
   - Hick's Law: Time to make a decision increases with the number and complexity of choices. Highlight feature dumps, competing links, or overloaded tabs.
   - Fitts's Law: The time to acquire a target is a function of the target's size and distance. Flag micro-CTAs, touch targets below 44px, and targets split far away from the natural hand/cursor path.
   - Miller's Law: An average person can only keep 7 (± 2) items in their working memory. Penalize layout clutter and poor information chunking.
   - Jakob's Law: Users spend most of their time on other sites; they expect your site to work in familiar ways. Flag erratic, non-standard layout schemas or confusing icon meanings.
   - Gestalt Principles (Proximity, Similarity, Continuity, Common Region): Related items must be visually grouped with spacing or containers. Note when items look disconnected despite sharing functions.

3. ACCESSIBILITY RULES
   - Ensure text contrast is at least 4.5:1 for body and 3:1 for large display elements.
   - Touch targets must be sufficiently spaced (minimum 8px gap) to avoid accidental taps.
   - Ensure interactive controls do not rely solely on color to convey state or meaning.

4. GROWTH & SAAS HEURISTICS
   - Spacing Rhythm: Enforce consistent paddings, margins, and grid alignments.
   - Time-to-Value (TTV): Ensure value propositons and next steps are instantly clear.
   - Progressive Disclosure: Do not overwhelm users on their first view; reveal deeper settings or options progressively.
`.trim()
