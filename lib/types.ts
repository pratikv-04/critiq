export interface ScorecardData {
  name: string
  score: number
  description: string
}

export interface Issue {
  id: string
  title: string
  severity: 'high' | 'medium' | 'low'
  /** What is wrong — specific UI observation */
  explanation: string
  /** Why this hurts product outcomes */
  whyItMatters: string
  /** How users experience friction */
  userFriction: string
  /** Actionable fix */
  recommendation: string
}

export interface Improvement {
  id: string
  title: string
  description: string
  impact: string
}

export interface AnalysisResult {
  screenshotUrl: string
  scorecards: ScorecardData[]
  whatWorking: string[]
  issues: Issue[]
  roastSummary: string
  improvements: Improvement[]
  safeVerdictScore: number
}

/** Shape returned by Gemini (before we add screenshotUrl). */
export interface GeminiAuditResponse {
  scorecards: ScorecardData[]
  whatWorking: string[]
  issues: Issue[]
  roastSummary: string
  improvements: Improvement[]
  safeVerdictScore?: number
}
