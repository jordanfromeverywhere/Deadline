import { useEffect, useState } from 'react'
import { useRunStore } from './core/state/runState'
import { startGameLoop, stopGameLoop } from './core/loop/gameLoop'
import { ColdStartScreen } from './ui/panels/ColdStartScreen'
import { GameLayout } from './ui/layout/GameLayout'
import './styles/base.css'
import './styles/panels.css'

export function App() {
  const coldStartComplete = useRunStore((s) => s.coldStartComplete)
  const [showGame, setShowGame] = useState(coldStartComplete)

  // Start game loop once cold start is done
  useEffect(() => {
    if (showGame) {
      startGameLoop()
    }
    return () => stopGameLoop()
  }, [showGame])

  function handleColdStartComplete() {
    setShowGame(true)
  }

  return (
    <>
      {!coldStartComplete && (
        <ColdStartScreen onComplete={handleColdStartComplete} />
      )}
      {showGame && <GameLayout />}
    </>
  )
}
