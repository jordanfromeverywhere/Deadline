import { useRunStore, selectMap, selectTrainStatus } from '../../core/state/runState'
import type { Location } from '../../core/state/types'

const WINDOW_RANGE = 25 // units on each side of train
const TRACK_WIDTH = 56

function renderMapLine(locations: Location[], trainPosition: number): React.ReactNode {
  const visibleMin = trainPosition - WINDOW_RANGE
  const visibleMax = trainPosition + WINDOW_RANGE

  // Build a character buffer
  const buf: { char: string; className?: string }[] = Array(TRACK_WIDTH)
    .fill(null)
    .map(() => ({ char: '·' }))

  // Train marker at center
  const trainIdx = Math.floor(TRACK_WIDTH / 2)
  buf[trainIdx] = { char: '[', className: 'map-location--scouted' }
  buf[trainIdx + 1] = { char: '=', className: 'map-location--scouted' }
  buf[trainIdx + 2] = { char: ']', className: 'map-location--scouted' }

  // Place locations
  for (const loc of locations) {
    const dist = loc.x - trainPosition
    if (dist < -WINDOW_RANGE || dist > WINDOW_RANGE) continue

    const idx = Math.round(trainIdx + (dist / WINDOW_RANGE) * (TRACK_WIDTH / 2 - 3))
    if (idx < 0 || idx >= TRACK_WIDTH - 2) continue

    if (loc.state === 'unknown') continue

    let symbol = '?'
    let className = ''

    if (loc.state === 'signal') {
      symbol = '?'
      className = 'map-location--signal'
    } else if (loc.state === 'passed' || loc.state === 'scouted') {
      symbol = loc.type === 'depot' ? 'D' : loc.type === 'settlement' ? 'S' : loc.type === 'ruin' ? 'R' : loc.type === 'anomaly' ? 'A' : loc.type === 'incident' ? '!' : '·'
      className = loc.type === 'anomaly' ? 'map-location--anomaly' : loc.type === 'incident' ? 'map-location--incident' : 'map-location--scouted'
    } else if (loc.state === 'explored') {
      symbol = loc.type === 'depot' ? 'D' : loc.type === 'settlement' ? 'S' : loc.type === 'ruin' ? 'R' : loc.type === 'anomaly' ? 'A' : loc.type === 'incident' ? '!' : '·'
      className = 'map-location--explored'
    }

    buf[idx] = { char: '[', className }
    buf[idx + 1] = { char: symbol, className }
    buf[idx + 2] = { char: ']', className }
  }

  void visibleMin
  void visibleMax

  return (
    <span>
      {buf.map((cell, i) =>
        cell.className ? (
          <span key={i} className={cell.className}>{cell.char}</span>
        ) : (
          cell.char
        )
      )}
    </span>
  )
}

export function MapPanel() {
  const map = useRunStore(selectMap)
  const { position } = useRunStore(selectTrainStatus)

  const nearby = map.filter(
    (l) => l.state !== 'unknown' && Math.abs(l.x - position) <= WINDOW_RANGE
  )

  return (
    <div className="panel map-panel">
      <div className="panel__header">
        <span className="panel__title">Map</span>
        <span className="dim" style={{ fontSize: 10 }}>km {Math.floor(position)}</span>
      </div>
      <div className="panel__body">
        <pre>
          {'░'.repeat(TRACK_WIDTH + 2)}
          {'\n'}
          &nbsp;{renderMapLine(map, position)}&nbsp;
          {'\n'}
          {'░'.repeat(TRACK_WIDTH + 2)}
        </pre>

        {nearby.length > 0 && (
          <div style={{ marginTop: 8 }}>
            {nearby.map((loc) => (
              <div key={loc.id} style={{ fontSize: 11, padding: '2px 0', borderBottom: '1px solid var(--border)' }}>
                <span className={
                  loc.type === 'anomaly' ? 'map-location--anomaly' :
                  loc.type === 'incident' ? 'map-location--incident' :
                  'highlight'
                }>
                  {loc.name ?? loc.type.toUpperCase()}
                </span>
                {loc.shortDescription && (
                  <span className="dim" style={{ marginLeft: 8, fontSize: 10 }}>
                    — {loc.shortDescription}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
