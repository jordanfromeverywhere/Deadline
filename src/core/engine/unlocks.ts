import type { RunState, UnlockKey } from '../state/types'
import type { MetaState } from '../state/types'

interface UnlockRule {
  id: UnlockKey
  check: (run: RunState, meta: MetaState) => boolean
  onUnlock: (run: RunState) => Partial<RunState>
}

export const UNLOCK_RULES: UnlockRule[] = [
  // ─── Actions ───────────────────────────────────────────────────────────────
  {
    id: 'action_forage',
    check: (run) => run.gameTime >= 90 && run.actionsUnlocked.includes('radio'),
    onUnlock: (run) => ({
      actionsUnlocked: [...run.actionsUnlocked, 'forage'],
    }),
  },
  {
    id: 'action_move',
    check: (run) => run.fuel > 5 && run.actionsUnlocked.includes('forage'),
    onUnlock: (run) => ({
      actionsUnlocked: [...run.actionsUnlocked, 'move'],
      panelsVisible: run.panelsVisible.includes('trainStatus')
        ? run.panelsVisible
        : [...run.panelsVisible, 'trainStatus'],
    }),
  },
  {
    id: 'panel_trainStatus',
    check: (run) => run.actionsUnlocked.includes('move'),
    onUnlock: (run) => ({
      panelsVisible: run.panelsVisible.includes('trainStatus')
        ? run.panelsVisible
        : [...run.panelsVisible, 'trainStatus'],
    }),
  },

  // ─── Cars ─────────────────────────────────────────────────────────────────
  {
    id: 'storage_car',
    check: (run) => {
      const forageCount = run.lastTriggeredActions['forage'] ?? 0
      return forageCount >= 3
    },
    onUnlock: (run) => ({
      carsUnlocked: [...run.carsUnlocked, 'storage'],
      suppliesCap: 200,
      panelsVisible: run.panelsVisible.includes('storage')
        ? run.panelsVisible
        : [...run.panelsVisible, 'storage'],
    }),
  },
  {
    id: 'bunk_car',
    check: (run) => run.survivors.length >= 1,
    onUnlock: (run) => ({
      carsUnlocked: [...run.carsUnlocked, 'bunk'],
      panelsVisible: run.panelsVisible.includes('survivors')
        ? run.panelsVisible
        : [...run.panelsVisible, 'survivors'],
    }),
  },
  {
    id: 'panel_survivors',
    check: (run) => run.carsUnlocked.includes('bunk'),
    onUnlock: (run) => ({
      panelsVisible: run.panelsVisible.includes('survivors')
        ? run.panelsVisible
        : [...run.panelsVisible, 'survivors'],
    }),
  },
  {
    id: 'workshop_car',
    check: (run) =>
      run.survivors.filter((s) => s.status !== 'lost').length >= 2 && run.supplies >= 50,
    onUnlock: (run) => ({
      carsUnlocked: [...run.carsUnlocked, 'workshop'],
    }),
  },
  {
    id: 'panel_map',
    check: (run) => run.actionsUnlocked.includes('move'),
    onUnlock: (run) => ({
      panelsVisible: run.panelsVisible.includes('map')
        ? run.panelsVisible
        : [...run.panelsVisible, 'map'],
    }),
  },
  {
    id: 'signal_car',
    check: (run) => run.resonance >= 80,
    onUnlock: (run) => ({
      carsUnlocked: [...run.carsUnlocked, 'signal'],
    }),
  },
  {
    id: 'infirmary_car',
    check: (run) => run.survivors.some((s) => s.status === 'injured'),
    onUnlock: (run) => ({
      carsUnlocked: [...run.carsUnlocked, 'infirmary'],
    }),
  },
  {
    id: 'archive_car',
    check: (run) => run.memoriesFound.length >= 1,
    onUnlock: (run) => ({
      carsUnlocked: [...run.carsUnlocked, 'archive'],
      panelsVisible: run.panelsVisible.includes('memory')
        ? run.panelsVisible
        : [...run.panelsVisible, 'memory'],
    }),
  },
  {
    id: 'panel_memory',
    check: (run) => run.carsUnlocked.includes('archive'),
    onUnlock: (run) => ({
      panelsVisible: run.panelsVisible.includes('memory')
        ? run.panelsVisible
        : [...run.panelsVisible, 'memory'],
    }),
  },
  {
    id: 'observation_car',
    check: (run) => run.memoriesFound.length >= 3 && run.noise >= 25,
    onUnlock: (run) => ({
      carsUnlocked: [...run.carsUnlocked, 'observation'],
      panelsVisible: run.panelsVisible.includes('observation')
        ? run.panelsVisible
        : [...run.panelsVisible, 'observation'],
    }),
  },
  {
    id: 'panel_observation',
    check: (run) => run.carsUnlocked.includes('observation'),
    onUnlock: (run) => ({
      panelsVisible: run.panelsVisible.includes('observation')
        ? run.panelsVisible
        : [...run.panelsVisible, 'observation'],
    }),
  },

  // ─── Phase transitions ────────────────────────────────────────────────────
  {
    id: 'phase2',
    check: (run) => run.survivors.length >= 1 && run.carsUnlocked.includes('bunk'),
    onUnlock: () => ({ phase: 2 as const }),
  },
  {
    id: 'phase3',
    check: (run) => run.memoriesFound.length >= 2 && run.carsUnlocked.includes('archive'),
    onUnlock: () => ({ phase: 3 as const }),
  },
]

const _appliedUnlocks = new Set<UnlockKey>()

export function resetUnlockTracking() {
  _appliedUnlocks.clear()
}

export function evaluateUnlocks(run: RunState, meta: MetaState): Partial<RunState> {
  let stateChanges: Partial<RunState> = {}

  for (const rule of UNLOCK_RULES) {
    if (_appliedUnlocks.has(rule.id)) continue

    // Check if already in effect
    const alreadyApplied = isAlreadyApplied(rule.id, run)
    if (alreadyApplied) {
      _appliedUnlocks.add(rule.id)
      continue
    }

    if (rule.check(run, meta)) {
      _appliedUnlocks.add(rule.id)
      const changes = rule.onUnlock({ ...run, ...stateChanges })
      stateChanges = { ...stateChanges, ...changes }
    }
  }

  return stateChanges
}

function isAlreadyApplied(id: UnlockKey, run: RunState): boolean {
  switch (id) {
    case 'action_forage': return run.actionsUnlocked.includes('forage')
    case 'action_move': return run.actionsUnlocked.includes('move')
    case 'panel_trainStatus': return run.panelsVisible.includes('trainStatus')
    case 'panel_survivors': return run.panelsVisible.includes('survivors')
    case 'panel_map': return run.panelsVisible.includes('map')
    case 'panel_memory': return run.panelsVisible.includes('memory')
    case 'panel_observation': return run.panelsVisible.includes('observation')
    case 'panel_storage': return run.panelsVisible.includes('storage')
    case 'storage_car': return run.carsUnlocked.includes('storage')
    case 'bunk_car': return run.carsUnlocked.includes('bunk')
    case 'workshop_car': return run.carsUnlocked.includes('workshop')
    case 'signal_car': return run.carsUnlocked.includes('signal')
    case 'infirmary_car': return run.carsUnlocked.includes('infirmary')
    case 'archive_car': return run.carsUnlocked.includes('archive')
    case 'observation_car': return run.carsUnlocked.includes('observation')
    case 'action_ping': return run.actionsUnlocked.includes('ping')
    case 'action_scan': return run.actionsUnlocked.includes('scan')
    case 'action_signalBoost': return run.actionsUnlocked.includes('signalBoost')
    case 'phase2': return run.phase >= 2
    case 'phase3': return run.phase >= 3
    default: return false
  }
}
