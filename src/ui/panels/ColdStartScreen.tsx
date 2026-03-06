import { useState, useEffect } from 'react'
import { useRunStore } from '../../core/state/runState'
import { useMetaStore } from '../../core/state/metaState'
import '../../styles/coldstart.css'

interface ColdStartScreenProps {
  onComplete: () => void
}

export function ColdStartScreen({ onComplete }: ColdStartScreenProps) {
  const resonance = useRunStore((s) => s.resonance)
  const set = useRunStore((s) => s.set)
  const runNumber = useMetaStore((s) => s.runNumber)
  const [phase, setPhase] = useState<'visible' | 'fading' | 'gone'>('visible')

  // Tick resonance during cold start (separate from game loop)
  useEffect(() => {
    const interval = setInterval(() => {
      set({ resonance: useRunStore.getState().resonance + 0.5, gameTime: useRunStore.getState().gameTime + 0.5 })
    }, 500)
    return () => clearInterval(interval)
  }, [set])

  function handleRadioClick() {
    const current = useRunStore.getState()
    set({
      radioFirstClicked: true,
      lastTriggeredActions: { ...current.lastTriggeredActions, radio: (current.lastTriggeredActions['radio'] ?? 0) + 1 },
    })
    setPhase('fading')
    // After fade animation, mark cold start done — App reads this from store and switches views
    setTimeout(() => {
      set({ coldStartComplete: true })
      onComplete()
    }, 1000)
  }

  const displayValue = Math.floor(resonance).toString().padStart(9, '0')
  const pct = Math.min(resonance / 1000, 1)
  const filled = Math.round(pct * 10)
  const barChars = Array(10).fill(null).map((_, i) => (i < filled ? '/' : ' ')).join('')

  return (
    <div className={`cold-start${phase === 'fading' ? ' cold-start--done' : ''}`}>
      <div className="cold-start__console">
        <div className="cold-start__title">
          {runNumber >= 2
            ? 'SECTOR 7 MONITORING CONSOLE — RUN ' + runNumber
            : 'SECTOR 7 MONITORING CONSOLE'}
        </div>
        <div className="cold-start__divider">{'='.repeat(32)}</div>

        <div className="cold-start__resonance">
          <div className="cold-start__resonance-label">RESONANCE</div>
          <div className="cold-start__resonance-value">{displayValue}</div>
          <div className="cold-start__bar">[{barChars}]</div>
        </div>

        <div className="cold-start__button-area">
          <button
            className="action-button"
            onClick={handleRadioClick}
            style={{ width: 'auto', minWidth: 120 }}
          >
            [ RADIO ]
          </button>
        </div>
      </div>
    </div>
  )
}
