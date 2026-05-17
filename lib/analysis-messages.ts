export type AnalysisStep = {
  id: string
  label: string
  detail: string
}

/** Cinematic analysis pipeline — 8 stages. */
export const ANALYSIS_STEPS: AnalysisStep[] = [
  {
    id: 'upload',
    label: 'Uploading screenshot',
    detail: 'Securing your design for deep analysis…',
  },
  {
    id: 'hierarchy',
    label: 'Scanning visual hierarchy',
    detail: 'Mapping where attention lands in the first 2 seconds…',
  },
  {
    id: 'accessibility',
    label: 'Evaluating accessibility',
    detail: 'Cross-checking contrast, targets, and WCAG patterns…',
  },
  {
    id: 'cognitive',
    label: 'Measuring cognitive load',
    detail: 'Stress-testing decision density and information chunks…',
  },
  {
    id: 'friction',
    label: 'Detecting UX friction',
    detail: 'Hunting clutter, weak affordances, and IA confusion…',
  },
  {
    id: 'cta',
    label: 'Reviewing CTA clarity',
    detail: 'Finding competing actions and hidden primary paths…',
  },
  {
    id: 'critique',
    label: 'Preparing critique',
    detail: 'Synthesizing insights into actionable recommendations…',
  },
  {
    id: 'damage',
    label: 'Preparing emotional damage',
    detail: 'Sharpening wit without losing substance…',
  },
]

export const STANDARD_STATUS_MESSAGES = [
  'Cross-referencing Nielsen heuristics with your layout…',
  'Measuring whether your primary action survives a 3-second test…',
  'Evaluating spacing rhythm and typographic hierarchy…',
  'Checking trust signals and conversion readiness…',
  'Packaging insights a senior designer would ship this sprint…',
] as const

export const ROAST_STATUS_MESSAGES = [
  'Loading sarcasm modules… responsibly.',
  'Your CTA is still hiding. We’re finding it.',
  'Calculating competing priorities per square pixel…',
  'Preparing commentary your team will quote in Slack…',
  'Almost ready to deliver constructive emotional damage…',
] as const

/** Roast-only steps replace the last two labels when roast mode is on. */
export function getAnalysisSteps(roastMode: boolean): AnalysisStep[] {
  if (!roastMode) {
    return ANALYSIS_STEPS.map((step, i) =>
      i === ANALYSIS_STEPS.length - 1
        ? { ...step, label: 'Finalizing audit', detail: 'Polishing your senior design review…' }
        : step
    )
  }
  return ANALYSIS_STEPS
}
