import { useRunStore, selectSurvivors } from '../../core/state/runState'

export function SurvivorsPanel() {
  const survivors = useRunStore(selectSurvivors)

  if (survivors.length === 0) {
    return (
      <div className="panel">
        <div className="panel__header">
          <span className="panel__title">Survivors</span>
        </div>
        <div className="panel__body">
          <div className="dim" style={{ fontSize: 11 }}>No survivors aboard.</div>
        </div>
      </div>
    )
  }

  return (
    <div className="panel panel--scrollable">
      <div className="panel__header">
        <span className="panel__title">Survivors</span>
        <span className="dim" style={{ fontSize: 10 }}>
          {survivors.filter((s) => s.status !== 'lost').length} aboard
        </span>
      </div>
      <div className="panel__body">
        <div className="survivor-list">
          {survivors.map((s) => (
            <div
              key={s.id}
              className={`survivor-entry survivor-entry--${s.status}`}
            >
              <div className={`survivor-entry__name${s.isStrikethrough ? ' dim' : ''}`}
                style={s.isStrikethrough ? { textDecoration: 'line-through' } : undefined}
              >
                {s.name}
              </div>
              <div className="survivor-entry__descriptor">{s.descriptor}</div>
              {s.traitRevealed && (
                <div className="survivor-entry__descriptor" style={{ color: 'var(--fg-voice)', marginTop: 2 }}>
                  trait: {s.trait}
                </div>
              )}
              <div className="survivor-entry__status">
                {s.status === 'available' && `morale: ${Math.floor(s.morale)}%`}
                {s.status === 'on_expedition' && '[on expedition]'}
                {s.status === 'overdue' && '[overdue]'}
                {s.status === 'injured' && '[injured]'}
                {s.status === 'lost' && '[——]'}
                {s.status === 'changed' && '[returned — changed]'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
