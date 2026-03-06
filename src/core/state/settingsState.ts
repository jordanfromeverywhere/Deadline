import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TextSpeed = 'slow' | 'normal' | 'fast' | 'instant'

export const TEXT_SPEED_CPS: Record<TextSpeed, number> = {
  slow: 14,
  normal: 28,
  fast: 60,
  instant: 9999,
}

export interface SettingsState {
  textSpeed: TextSpeed
  masterVolume: number   // 0–1
  reduceMotion: boolean
}

interface SettingsStore extends SettingsState {
  set: (partial: Partial<SettingsState>) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      textSpeed: 'normal',
      masterVolume: 0.7,
      reduceMotion: false,
      set: (partial) => set((state) => ({ ...state, ...partial })),
    }),
    { name: 'deadline-settings' }
  )
)
