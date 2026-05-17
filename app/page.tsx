'use client'

import { AppProvider, useApp } from '@/lib/app-context'
import { Landing } from '@/components/landing'
import { Upload } from '@/components/upload'
import { Processing } from '@/components/processing'
import { Results } from '@/components/results'

function AppContent() {
  const { currentState } = useApp()

  return (
    <main className="min-h-screen bg-background">
      {currentState === 'landing' && <Landing />}
      {currentState === 'upload' && <Upload />}
      {currentState === 'processing' && <Processing />}
      {currentState === 'results' && <Results />}
    </main>
  )
}

export default function Page() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
