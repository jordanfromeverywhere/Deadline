import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RunState, Location } from './types'
import { INITIAL_MAP } from '../../content/locations'

export const INITIAL_RUN_STATE: RunState = {
  phase: 1,
  resonance: 0,
  resonanceCap: 1000,
  noise: 0,
  supplies: 0,
  suppliesCap: 100,
  fuel: 20,
  fuelCap: 100,
  power: 0,
  powerCap: 50,
  morale: 50,
  information: 0,
  trainMoving: false,
  trainPosition: 0,
  carsUnlocked: ['control'],
  actionsUnlocked: ['radio'],
  panelsVisible: ['console', 'radio'],
  survivors: [],
  expeditions: [],
  map: INITIAL_MAP,
  radioLog: [],
  voiceMessageQueue: [],
  shownVoiceMessageIds: [],
  voiceMessageCooldowns: {},
  memoriesFound: [],
  inventoryItems: [],
  gameTime: 0,
  lastVoiceMessageAt: 0,
  forageCooldown: 0,
  lastTriggeredActions: {},
  lastNoiseLevelSeen: 'low',
  coldStartComplete: false,
  radioFirstClicked: false,
}

interface RunStore extends RunState {
  set: (partial: Partial<RunState>) => void
  reset: (overrides?: Partial<RunState>) => void
}

export const useRunStore = create<RunStore>()(
  persist(
    (set) => ({
      ...INITIAL_RUN_STATE,
      set: (partial) => set((state) => ({ ...state, ...partial })),
      reset: (overrides) =>
        set({ ...INITIAL_RUN_STATE, ...(overrides ?? {}), map: overrides?.map ?? INITIAL_MAP }),
    }),
    {
      name: 'deadline-run-state',
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { set: _set, reset: _reset, ...rest } = state
        return rest
      },
    }
  )
)

// Selector helpers — avoids triggering re-renders on unrelated changes
export const selectResonance = (s: RunStore) => s.resonance
export const selectNoise = (s: RunStore) => s.noise
export const selectResources = (s: RunStore) => ({
  supplies: s.supplies,
  suppliesCap: s.suppliesCap,
  fuel: s.fuel,
  fuelCap: s.fuelCap,
  power: s.power,
  powerCap: s.powerCap,
  morale: s.morale,
  information: s.information,
})
export const selectTrainStatus = (s: RunStore) => ({
  moving: s.trainMoving,
  position: s.trainPosition,
  carsUnlocked: s.carsUnlocked,
})
export const selectSurvivors = (s: RunStore) => s.survivors
export const selectExpeditions = (s: RunStore) => s.expeditions
export const selectRadioLog = (s: RunStore) => s.radioLog
export const selectPanelsVisible = (s: RunStore) => s.panelsVisible
export const selectActionsUnlocked = (s: RunStore) => s.actionsUnlocked
export const selectMemoriesFound = (s: RunStore) => s.memoriesFound
export const selectMap = (s: RunStore) => s.map as Location[]
export const selectPhase = (s: RunStore) => s.phase
export const selectColdStart = (s: RunStore) => ({
  complete: s.coldStartComplete,
  radioClicked: s.radioFirstClicked,
})
