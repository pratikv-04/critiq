import type { AnalysisResult } from '@/lib/types'

export type {
  ScorecardData,
  Issue,
  Improvement,
  AnalysisResult,
} from '@/lib/types'

export const mockAnalysisResult: AnalysisResult = {
  screenshotUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RXoM3CUK51kpGF7eVp7DbBxuhq5umm.png',
  scorecards: [
    {
      name: 'Visual Hierarchy',
      score: 78,
      description: 'Clear hierarchy with good contrast and size differentiation'
    },
    {
      name: 'Clarity',
      score: 85,
      description: 'Messaging is concise and purpose is immediately apparent'
    },
    {
      name: 'Accessibility',
      score: 72,
      description: 'Good color contrast, but some ARIA labels could be improved'
    },
    {
      name: 'Consistency',
      score: 88,
      description: 'Consistent use of spacing, typography, and component patterns'
    },
    {
      name: 'Cognitive Load',
      score: 82,
      description: 'Minimal distractions with focused user attention flow'
    },
    {
      name: 'Conversion Readiness',
      score: 80,
      description: 'Clear CTAs with appropriate visual weight and placement'
    },
  ],
  whatWorking: [
    'The centered layout creates a calm, focused experience that guides attention naturally to key elements',
    'Typography hierarchy is excellent—the serif headlines create elegance and the body text is highly readable',
    'The gradient background adds visual interest without overwhelming the content',
    'Button styling is premium with appropriate spacing and visual weight',
    'Loading indicators and state feedback would enhance the experience significantly'
  ],
  issues: [
    {
      id: '1',
      title: 'Product Hunt badge could be more prominent',
      severity: 'medium',
      explanation: 'The Product Hunt badge is small and gets lost in the busy header area.',
      whyItMatters: 'Social proof near the hero accelerates trust for cold visitors — weak placement reduces conversion on first visits.',
      userFriction: 'Users scanning for credibility may scroll past without registering third-party validation.',
      recommendation: 'Increase badge size slightly and give it dedicated whitespace in the header with a subtle container.'
    },
    {
      id: '2',
      title: 'Secondary CTA lacks visual distinction',
      severity: 'medium',
      explanation: 'The secondary button competes with the primary CTA without clear hierarchy.',
      whyItMatters: 'Hick\'s Law — parallel actions increase decision time and dilute the primary conversion path.',
      userFriction: 'Users hesitate between actions, often choosing neither or the lower-commitment option.',
      recommendation: 'Demote secondary to ghost/outline styling and increase primary button contrast and size.'
    },
    {
      id: '3',
      title: 'Voice waveform asset could be interactive',
      severity: 'low',
      explanation: 'The waveform visualization is static despite implying live voice interaction.',
      whyItMatters: 'Affordance mismatch erodes trust in the core product promise.',
      userFriction: 'Users may tap expecting feedback and assume the feature is broken.',
      recommendation: 'Add subtle loop animation on idle and reactive states when recording.'
    },
    {
      id: '4',
      title: 'Missing loading state for microphone interaction',
      severity: 'high',
      explanation: 'The microphone control shows no listening, processing, or success states.',
      whyItMatters: 'Visibility of system status is a core Nielsen heuristic — voice UIs fail without feedback.',
      userFriction: 'Users repeat taps, speak over errors, or abandon thinking the app froze.',
      recommendation: 'Add pulsing listen state, processing spinner, and success/error toasts tied to the mic button.'
    },
  ],
  roastSummary: 'Your interface is polished and premium—it looks like something Apple would ship. The gradient is chef\'s kiss, and the typography hierarchy is *immaculate*. But that microphone button? It\'s just sitting there like a statue. Give it some life, add those loading states, and make users *feel* the AI working. Otherwise, they\'ll think it\'s broken. Also, the secondary button is basically invisible. Make it fight for attention. Overall though, stellar work on the aesthetic. This genuinely feels like a premium startup product. Just needs some soul in the interactions.',
  improvements: [
    {
      id: '1',
      title: 'Add micro-interactions to voice feedback',
      description: 'Implement animated waveforms and visual feedback when the microphone is active',
      impact: 'Increases user confidence and creates a more premium feel'
    },
    {
      id: '2',
      title: 'Enhance button state feedback',
      description: 'Add subtle animations and color changes for hover and active states',
      impact: 'Improves perceived responsiveness and interactivity'
    },
    {
      id: '3',
      title: 'Add testimonial carousel',
      description: 'Create a scrollable section showing real user testimonials with avatars',
      impact: 'Builds trust and provides social proof for new visitors'
    },
    {
      id: '4',
      title: 'Implement lazy-loaded screenshots',
      description: 'Show progress indicators as the journal entries load in the preview',
      impact: 'Improves perceived performance and manages expectations'
    },
  ]
}
