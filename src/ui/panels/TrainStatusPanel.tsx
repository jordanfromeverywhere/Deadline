import { useRunStore, selectTrainStatus } from '../../core/state/runState'
import { useShallow } from 'zustand/shallow'

const CAR_LABELS: Record<string, string> = {
  control: 'Control Room',
  storage: 'Storage Car',
  bunk: 'Bunk Car',
  workshop: 'Workshop',
  signal: 'Signal Car',
  infirmary: 'Infirmary',
  archive: 'Archive Car',
  observation: 'Observation Car',
}

export function TrainStatusPanel() {
  const { moving, carsUnlocked } = useRunStore(useShallow(selectTrainStatus))
  const trainPosition = useRunStore((s) => s.trainPosition)

  return (
    <div className="panel">
      <div className="panel__header">
        <span className="panel__title">Train Status</span>
      </div>
      <div className="panel__body">
        <div className={`train-status__indicator train-status__indicator--${moving ? 'moving' : 'stopped'}`}>
          {moving ? '>> MOVING' : '>> STATIONARY'}
        </div>
        <div className="dim" style={{ fontSize: 10, marginTop: 4 }}>
          Position: {Math.floor(trainPosition)} km
        </div>
        <div className="car-list">
          {carsUnlocked.map((car) => (
            <div key={car} className="car-entry">
              — {CAR_LABELS[car] ?? car}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
