/** Dimensions the AI must evaluate in every audit. */
export const EVALUATION_DIMENSIONS = `
SYSTEMATIC EVALUATION DIMENSIONS:
In your scorecard and issues, grade the interface systematically across these 6 core dimensions. Cite specific elements and visual evidence in your scoring descriptions:

1. VISUAL HIERARCHY
   - Primary Focal Point: Where does the eye settle in the first 2 seconds?
   - Priority Stack: Are size, contrast, positioning, and depth creating a clear order of importance?

2. CLARITY & COGNITIVE LOAD
   - Value Prop: Is it immediately obvious what this product does in a single sentence?
   - Decision Friction: Is the visual surface clean and well-proportioned, or does it trigger cognitive exhaustion?

3. SCANABILITY
   - Skimming Flow: Can a user identify headings, subheadings, and action markers cleanly?
   - Chunks: Are lines of text kept to comfortable lengths (45–75 characters) with clear typographic rhythms?

4. ONBOARDING & FIRST-RUN FRICTION
   - Pathway: Is the next logical action clearly marked?
   - Activation Barriers: Are there unnecessary fields, banners, or links cluttering the activation path?

5. CTA CLARITY
   - Prime Action: Is there one unmistakable, high-contrast, action-oriented primary button?
   - Competing Noise: Are secondary choices sufficiently visually demoted so they don't leak conversion attention?

6. INFORMATION ARCHITECTURE & CONSISTENCY
   - Content Grouping: Are related objects visually contained or held close to each other (Gestalt Proximity)?
   - Spacing & Typography Scale: Are grid columns, container paddings, font styles, and components consistent across the entire view?
`.trim()
