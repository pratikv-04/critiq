export type AnalysisStep = {
  id: string
  label: string
  detail: string
}

/** Cinematic analysis pipeline — 9 precise stages. */
export const ANALYSIS_STEPS: AnalysisStep[] = [
  {
    id: 'upload',
    label: 'Uploading screenshot',
    detail: 'Decoding viewport dimensions, coordinate bounds, and asset geometry…',
  },
  {
    id: 'hierarchy',
    label: 'Scanning visual hierarchy',
    detail: 'Plotting visual focal sequence and scanning density maps…',
  },
  {
    id: 'accessibility',
    label: 'Evaluating accessibility',
    detail: 'Calculating contrast metrics, tap margins, and WCAG compliance…',
  },
  {
    id: 'cognitive',
    label: 'Measuring cognitive load',
    detail: 'Measuring information density, complexity index, and decision stress…',
  },
  {
    id: 'friction',
    label: 'Detecting UX friction',
    detail: 'Identifying spacing rhythm, alignment errors, and affordance gaps…',
  },
  {
    id: 'cta',
    label: 'Reviewing CTA clarity',
    detail: 'Auditing conversion hooks, click dominance, and competing targets…',
  },
  {
    id: 'interaction',
    label: 'Analyzing interaction patterns',
    detail: 'Tracing navigation flows, user mental models, and spatial predictability…',
  },
  {
    id: 'critique',
    label: 'Preparing critique',
    detail: 'Synthesizing staff-level design feedback and Figma-ready recommendations…',
  },
  {
    id: 'damage',
    label: 'Preparing emotional damage',
    detail: 'Compiling witty, constructive design critiques with peak sarcasm…',
  },
]

export const STANDARD_STATUS_MESSAGES = [
  'Auditing layout alignment against strict 8pt grid systems…',
  'Benchmarking typography scales, weights, and line heights…',
  'Analyzing visual dominance patterns via the 3-second squinched-eye test…',
  'Detecting cognitive friction points and Miller\'s Law chunking compliance…',
  'Evaluating conversion-readiness, social proof cues, and risk reversals…',
] as const

export const ROAST_STATUS_MESSAGES = [
  'Assembling sarcasm modules… please remain calm.',
  'Scanning pixel coordinates to find where your CTA is hiding…',
  'Calculating the ratio of visual chaos to actual useful features…',
  'Drafting critiques that will probably trigger a Slack debate…',
  'Formulating evidence-based emotional damage with surgical precision…',
] as const

/** Roast-only steps replace the last two labels when roast mode is on. */
export function getAnalysisSteps(roastMode: boolean): AnalysisStep[] {
  if (!roastMode) {
    return ANALYSIS_STEPS.map((step, i) =>
      i === ANALYSIS_STEPS.length - 1
        ? {
            ...step,
            label: 'Finalizing critique',
            detail: 'Polishing your high-end constructive Figma-ready recommendations…',
          }
        : step
    ).filter(step => step.id !== 'damage') // Remove emotional damage step if standard mode
  }
  return ANALYSIS_STEPS
}
