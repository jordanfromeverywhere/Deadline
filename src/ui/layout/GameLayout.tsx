import { useRunStore, selectPanelsVisible } from '../../core/state/runState'
import { ConsolePanel } from '../panels/ConsolePanel'
import { RadioLogPanel } from '../panels/RadioLogPanel'
import { TrainStatusPanel } from '../panels/TrainStatusPanel'
import { SurvivorsPanel } from '../panels/SurvivorsPanel'
import { MapPanel } from '../panels/MapPanel'
import { MemoryPanel } from '../panels/MemoryPanel'
import { ObservationLogPanel } from '../panels/ObservationLogPanel'
import '../../styles/panels.css'

export function GameLayout() {
  const panels = useRunStore(selectPanelsVisible)
  const noise = useRunStore((s) => s.noise)

  const noiseAttr =
    noise >= 75 ? 'critical' : noise >= 50 ? 'high' : noise >= 25 ? 'moderate' : 'low'

  return (
    <div
      className="game-layout"
      data-noise={noiseAttr}
      style={{
        gridTemplateColumns: panels.includes('map') ? '260px 1fr 1fr' : '260px 1fr',
        gridTemplateRows: 'auto',
        alignItems: 'start',
      }}
    >
      {/* Left column: always-visible console + conditionals */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <ConsolePanel />
        {panels.includes('trainStatus') && <TrainStatusPanel />}
        {panels.includes('survivors') && <SurvivorsPanel />}
        {panels.includes('storage') && (
          <div className="panel">
            <div className="panel__header">
              <span className="panel__title">Storage Car</span>
            </div>
            <div className="panel__body">
              <div className="dim" style={{ fontSize: 11 }}>Inventory system coming soon.</div>
            </div>
          </div>
        )}
      </div>

      {/* Center column: Radio log */}
      <RadioLogPanel />

      {/* Right column: Map + late-game panels */}
      {panels.includes('map') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <MapPanel />
          {panels.includes('memory') && <MemoryPanel />}
          {panels.includes('observation') && <ObservationLogPanel />}
        </div>
      )}

      {/* Memory + observation when no map yet */}
      {!panels.includes('map') && panels.includes('memory') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, gridColumn: 2 }}>
          <MemoryPanel />
          {panels.includes('observation') && <ObservationLogPanel />}
        </div>
      )}
    </div>
  )
}
