import { useRunStore, selectMemoriesFound } from '../../core/state/runState'
import { MEMORY_FRAGMENTS } from '../../content/memories'

export function MemoryPanel() {
  const memoriesFound = useRunStore(selectMemoriesFound)
  const found = MEMORY_FRAGMENTS.filter((f) => memoriesFound.includes(f.id))

  return (
    <div className="panel panel--scrollable">
      <div className="panel__header">
        <span className="panel__title">Archive Car</span>
        <span className="dim" style={{ fontSize: 10 }}>{found.length} fragment{found.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="panel__body">
        {found.length === 0 && (
          <div className="dim" style={{ fontSize: 11 }}>No fragments assembled.</div>
        )}
        {found.map((fragment) => (
          <div key={fragment.id} style={{ marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--fg-highlight)', marginBottom: 4 }}>
              {fragment.isPlayerMemory ? '▸ ' : ''}{fragment.title}
            </div>
            {fragment.author && (
              <div className="dim" style={{ fontSize: 10, marginBottom: 6 }}>{fragment.author}</div>
            )}
            <pre style={{ fontSize: 11, whiteSpace: 'pre-wrap', color: fragment.isPlayerMemory ? 'var(--fg-voice)' : 'var(--fg)', lineHeight: 1.6 }}>
              {fragment.text}
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}
