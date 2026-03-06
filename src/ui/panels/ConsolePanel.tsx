import { useRunStore, selectResources, selectActionsUnlocked } from '../../core/state/runState'
import { useMetaStore } from '../../core/state/metaState'
import { useShallow } from 'zustand/shallow'
import { ResonanceBar } from '../components/ResonanceBar'
import { ResourceRow } from '../components/ResourceRow'
import { ActionButton } from '../components/ActionButton'
import { drawSurvivor } from '../../content/survivors'

const FORAGE_COOLDOWN = 30 // seconds

export function ConsolePanel() {
  const resources = useRunStore(useShallow(selectResources))
  const actionsUnlocked = useRunStore(selectActionsUnlocked)
  const forageCooldown = useRunStore((s) => s.forageCooldown)
  const set = useRunStore((s) => s.set)
  const survivors = useRunStore((s) => s.survivors)
  const trainMoving = useRunStore((s) => s.trainMoving)
  const noise = useRunStore((s) => s.noise)
  const lastTriggeredActions = useRunStore((s) => s.lastTriggeredActions)
  const runNumber = useMetaStore((s) => s.runNumber)

  function handleForage() {
    if (forageCooldown > 0) return
    const gained = Math.floor(Math.random() * 8) + 5 // 5–12 supplies

    // Occasionally find a survivor on forage (low chance)
    let newSurvivors = survivors
    const survivorRoll = Math.random()
    if (survivorRoll < 0.08 && survivors.length < 8) {
      const drawn = drawSurvivor(survivors.map((s) => s.name))
      if (drawn) newSurvivors = [...survivors, drawn]
    }

    const forageCount = (lastTriggeredActions['forage'] ?? 0) + 1

    set({
      supplies: Math.min(resources.supplies + gained, useRunStore.getState().suppliesCap),
      forageCooldown: FORAGE_COOLDOWN,
      survivors: newSurvivors,
      lastTriggeredActions: { ...lastTriggeredActions, forage: forageCount },
    })

  }

  function handleMove() {
    const fuel = useRunStore.getState().fuel
    if (fuel <= 0) return
    set({ trainMoving: true })
  }

  function handleStop() {
    set({ trainMoving: false })
  }

  const canForage = actionsUnlocked.includes('forage') && forageCooldown <= 0 && !trainMoving
  const canMove = actionsUnlocked.includes('move') && !trainMoving && resources.fuel > 0
  const canStop = actionsUnlocked.includes('move') && trainMoving

  return (
    <div className="panel">
      <div className="panel__header">
        <span className="panel__title">
          {runNumber >= 2 ? 'SECTOR 7 MONITORING CONSOLE (RUN ' + runNumber + ')' : 'SECTOR 7 MONITORING CONSOLE'}
        </span>
      </div>
      <div className="panel__body">
        <ResonanceBar />

        {noise > 0 && (
          <div className="resource-row">
            <span className="resource-row__label">Noise</span>
            <span className={`resource-row__value${noise > 75 ? ' danger' : noise > 50 ? ' warning' : ''}`}>
              {Math.floor(noise)}%
            </span>
          </div>
        )}

        {resources.supplies > 0 || actionsUnlocked.includes('forage') ? (
          <ResourceRow label="Supplies" value={resources.supplies} max={resources.suppliesCap} />
        ) : null}

        {actionsUnlocked.includes('move') && (
          <ResourceRow label="Fuel" value={resources.fuel} max={resources.fuelCap} />
        )}

        {resources.power > 0 && (
          <ResourceRow label="Power" value={resources.power} max={resources.powerCap} />
        )}

        {survivors.length > 0 && (
          <ResourceRow label="Morale" value={`${Math.floor(resources.morale)}%`} />
        )}

        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {actionsUnlocked.includes('forage') && (
            <ActionButton
              label="FORAGE"
              onClick={handleForage}
              disabled={!canForage}
              cooldown={forageCooldown > 0}
              title={forageCooldown > 0 ? `Ready in ${Math.ceil(forageCooldown)}s` : undefined}
            />
          )}
          {canMove && (
            <ActionButton label="MOVE" onClick={handleMove} />
          )}
          {canStop && (
            <ActionButton label="STOP" onClick={handleStop} />
          )}
        </div>
      </div>
    </div>
  )
}
