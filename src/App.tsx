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
  const coldStartComplete = useRunStore((s) => s.coldStartComplete)
  const reduceMotion = useSettingsStore((s) => s.reduceMotion)
  const [showGame, setShowGame] = useState(coldStartComplete)
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Apply reduce-motion to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-reduce-motion', reduceMotion ? 'true' : 'false')
  }, [reduceMotion])

  useEffect(() => {
    if (showGame) {
      startGameLoop()
    }
    return () => stopGameLoop()
  }, [showGame])

  return (
    <>
      {!coldStartComplete && (
        <ColdStartScreen onComplete={() => setShowGame(true)} />
      )}
      {showGame && <GameLayout />}

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
