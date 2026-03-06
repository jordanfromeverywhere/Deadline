import { useRunStore, selectResonance } from '../../core/state/runState'

export function ResonanceBar() {
  const resonance = useRunStore(selectResonance)
  const cap = useRunStore((s) => s.resonanceCap)
  const noise = useRunStore((s) => s.noise)

  const pct = Math.min(resonance / cap, 1)
  const isOverflow = noise > 0

  // ASCII bar: 10 chars wide
  const filled = Math.round(pct * 10)
  const barChars = Array(10)
    .fill(null)
    .map((_, i) => (i < filled ? '/' : ' '))
    .join('')

  // Zero-pad to 9 digits
  const displayValue = Math.floor(resonance).toString().padStart(9, '0')

  return (
    <div className="resonance-display">
      <div className="resonance-display__label">Resonance</div>
      <div className="resonance-display__value">{displayValue}</div>
      <div className="resonance-bar">
        <span>[</span>
        <div className="resonance-bar__track">
          <div
            className={`resonance-bar__fill${isOverflow ? ' resonance-bar__fill--overflow' : ''}`}
            style={{ width: `${pct * 100}%` }}
          />
        </div>
        <span>]</span>
        <span style={{ fontSize: 10, color: 'var(--fg-dim)', marginLeft: 4 }}>
          [{barChars}]
        </span>
      </div>
    </div>
  )
}
