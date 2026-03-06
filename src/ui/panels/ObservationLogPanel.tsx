import { useState, useEffect, useRef } from 'react'
import { subscribeObservationLog } from '../../core/loop/gameLoop'

export function ObservationLogPanel() {
  const [entries, setEntries] = useState<string[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsub = subscribeObservationLog(setEntries)
    return unsub
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries.length])

  return (
    <div className="panel panel--scrollable">
      <div className="panel__header">
        <span className="panel__title">Observation Car</span>
      </div>
      <div className="panel__body radio-log">
        {entries.length === 0 && (
          <div className="dim" style={{ fontSize: 11 }}>No entries logged.</div>
        )}
        {entries.map((entry, i) => (
          <div key={i} className="radio-log__entry radio-log__entry--system" style={{ fontSize: 11 }}>
            {entry}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
