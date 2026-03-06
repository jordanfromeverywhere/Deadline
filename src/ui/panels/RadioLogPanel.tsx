import { useEffect, useRef } from 'react'
import { useRunStore, selectRadioLog, selectActionsUnlocked } from '../../core/state/runState'
import { useMetaStore } from '../../core/state/metaState'
import { VoiceMessage } from '../components/VoiceMessage'
import { useVoiceQueue } from '../hooks/useVoiceQueue'
import { ActionButton } from '../components/ActionButton'

export function RadioLogPanel() {
  const radioLog = useRunStore(selectRadioLog)
  const actionsUnlocked = useRunStore(selectActionsUnlocked)
  const set = useRunStore((s) => s.set)
  const runNumber = useMetaStore((s) => s.runNumber)
  const { onMessageComplete } = useVoiceQueue()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [radioLog.length])

  function handleRadio() {
    const current = useRunStore.getState()
    const lastTriggered = current.lastTriggeredActions
    set({
      radioFirstClicked: true,
      lastTriggeredActions: { ...lastTriggered, radio: (lastTriggered['radio'] ?? 0) + 1 },
    })
  }

  return (
    <div className="panel panel--scrollable" style={{ gridColumn: 2 }}>
      <div className="panel__header">
        <span className="panel__title">Radio Log</span>
        <span className="dim" style={{ fontSize: 10 }}>
          {runNumber >= 2 ? `run ${runNumber}` : ''}
        </span>
      </div>
      <div className="panel__body radio-log">
        {radioLog.map((entry, i) => (
          <VoiceMessage
            key={entry.id}
            lines={entry.lines}
            isVoice={entry.isVoice}
            onComplete={i === radioLog.length - 1 ? onMessageComplete : undefined}
          />
        ))}
        <div ref={bottomRef} />
      </div>
      {actionsUnlocked.includes('radio') && (
        <div style={{ marginTop: 8, flexShrink: 0 }}>
          <ActionButton label="RADIO" onClick={handleRadio} />
        </div>
      )}
    </div>
  )
}
