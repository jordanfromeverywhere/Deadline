import { useEffect, useState } from 'react'
import { useRunStore } from './core/state/runState'
import { useSettingsStore } from './core/state/settingsState'
import { startGameLoop, stopGameLoop } from './core/loop/gameLoop'
import { ColdStartScreen } from './ui/panels/ColdStartScreen'
import { GameLayout } from './ui/layout/GameLayout'
import { SettingsModal } from './ui/panels/SettingsModal'
import './styles/base.css'
import './styles/panels.css'
import './styles/settings.css'

export function App() {
  // Read directly from store on every render — avoids useState race with persist hydration
  const coldStartComplete = useRunStore((s) => s.coldStartComplete)
  const reduceMotion = useSettingsStore((s) => s.reduceMotion)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-reduce-motion', reduceMotion ? 'true' : 'false')
  }, [reduceMotion])

  useEffect(() => {
    if (coldStartComplete) {
      startGameLoop()
    }
    return () => stopGameLoop()
  }, [coldStartComplete])

  return (
    <>
      {!coldStartComplete && (
        <ColdStartScreen onComplete={() => useRunStore.getState().set({ coldStartComplete: true })} />
      )}
      {coldStartComplete && <GameLayout />}

      <button
        className="settings-btn"
        onClick={() => setSettingsOpen(true)}
        aria-label="Settings"
      >
        [ settings ]
      </button>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  )
}
