import type { TriggerCondition, RunState, NoiseLevel } from '../../core/state/types'
import type { MetaState } from '../../core/state/types'

export function getNoiseLevelPct(noise: number): NoiseLevel {
  if (noise < 25) return 'low'
  if (noise < 50) return 'moderate'
  if (noise < 75) return 'high'
  if (noise < 100) return 'critical'
  return 'peak'
}

const NOISE_LEVEL_ORDER: NoiseLevel[] = ['low', 'moderate', 'high', 'critical', 'peak']

function noiseLevelAtLeast(current: NoiseLevel, threshold: NoiseLevel): boolean {
  return NOISE_LEVEL_ORDER.indexOf(current) >= NOISE_LEVEL_ORDER.indexOf(threshold)
}

export function evaluateTrigger(
  trigger: TriggerCondition,
  run: RunState,
  _meta: MetaState,
  context: TriggerContext
): boolean {
  switch (trigger.type) {
    case 'resonance_reaches':
      return run.resonance >= trigger.value

    case 'noise_threshold': {
      const currentLevel = getNoiseLevelPct(run.noise)
      return noiseLevelAtLeast(currentLevel, trigger.level)
    }

    case 'action_taken': {
      const count = run.lastTriggeredActions[trigger.action] ?? 0
      const min = trigger.minCount ?? 1
      return count >= min
    }

    case 'survivor_count_reaches':
      return run.survivors.filter((s) => s.status !== 'lost').length >= trigger.count

    case 'car_unlocked':
      return run.carsUnlocked.includes(trigger.car)

    case 'expedition_returned':
      return context.lastExpeditionOutcome === trigger.outcome

    case 'memory_found':
      if (trigger.fragmentId) {
        return run.memoriesFound.includes(trigger.fragmentId)
      }
      return run.memoriesFound.length > 0

    case 'time_since_last_message':
      return run.gameTime - run.lastVoiceMessageAt >= trigger.seconds

    case 'run_number_at_least':
      return _meta.runNumber >= trigger.run

    case 'game_time_elapsed':
      return run.gameTime >= trigger.seconds

    case 'location_nearby': {
      const nearby = run.map.filter((loc) => Math.abs(loc.x - run.trainPosition) <= 30)
      return nearby.some((loc) => loc.type === trigger.locationType)
    }

    case 'panel_revealed':
      return run.panelsVisible.includes(trigger.panel)
  }
}

export interface TriggerContext {
  lastAction?: RunState['actionsUnlocked'][number]
  lastExpeditionOutcome?: 'success' | 'overdue' | 'lost'
}
