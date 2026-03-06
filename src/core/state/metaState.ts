import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MetaState } from './types'

const INITIAL_META_STATE: MetaState = {
  runNumber: 1,
  completedEndings: [],
  totalMemoriesEverFound: [],
  carriedMemoriesIntoCurrentRun: [],
  survivorsFromPreviousRuns: [],
  firstVoiceMessageSeen: false,
}

interface MetaStore extends MetaState {
  set: (partial: Partial<MetaState>) => void
  recordEndingComplete: (ending: MetaState['completedEndings'][number]) => void
  recordMemoryFound: (id: string) => void
  incrementRun: () => void
}

export const useMetaStore = create<MetaStore>()(
  persist(
    (set) => ({
      ...INITIAL_META_STATE,
      set: (partial) => set((state) => ({ ...state, ...partial })),
      recordEndingComplete: (ending) =>
        set((state) => ({
          completedEndings: state.completedEndings.includes(ending)
            ? state.completedEndings
            : [...state.completedEndings, ending],
        })),
      recordMemoryFound: (id) =>
        set((state) => ({
          totalMemoriesEverFound: state.totalMemoriesEverFound.includes(id)
            ? state.totalMemoriesEverFound
            : [...state.totalMemoriesEverFound, id],
        })),
      incrementRun: () => set((state) => ({ runNumber: state.runNumber + 1 })),
    }),
    { name: 'deadline-meta-state' }
  )
)
