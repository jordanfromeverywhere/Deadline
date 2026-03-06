import { useRunStore } from '../state/runState'
import { useMetaStore } from '../state/metaState'
import { computeRates, applyResourceDeltas } from '../engine/resources'
import { evaluateUnlocks, resetUnlockTracking } from '../engine/unlocks'
import { checkNoiseEvents } from '../engine/noise'
import { evaluateTrigger } from '../../content/voice/triggers'
import { VOICE_MESSAGES } from '../../content/voice/messages'
import type { RunState, VoiceMessage } from '../state/types'

const FAST_TICK_MS = 250
const SLOW_TICK_MS = 2000

let fastInterval: ReturnType<typeof setInterval> | null = null
let slowInterval: ReturnType<typeof setInterval> | null = null

// Observation log is stored separately (not in Zustand to avoid too many re-renders)
export const observationLog: string[] = []
const observationLogListeners: Array<(entries: string[]) => void> = []

export function subscribeObservationLog(cb: (entries: string[]) => void) {
  observationLogListeners.push(cb)
  return () => {
    const idx = observationLogListeners.indexOf(cb)
    if (idx !== -1) observationLogListeners.splice(idx, 1)
  }
}

function notifyObservationLog() {
  observationLogListeners.forEach((cb) => cb([...observationLog]))
}

export function startGameLoop() {
  stopGameLoop()
  resetUnlockTracking()

  fastInterval = setInterval(fastTick, FAST_TICK_MS)
  slowInterval = setInterval(slowTick, SLOW_TICK_MS)
}

export function stopGameLoop() {
  if (fastInterval !== null) clearInterval(fastInterval)
  if (slowInterval !== null) clearInterval(slowInterval)
  fastInterval = null
  slowInterval = null
}

function fastTick() {
  const run = useRunStore.getState()

  if (!run.coldStartComplete) return

  const rates = computeRates(run)
  const deltas = applyResourceDeltas(run, rates)

  // Advance train position if moving
  const positionDelta = run.trainMoving ? 0.5 : 0
  const newPosition = run.trainPosition + positionDelta

  useRunStore.getState().set({
    ...deltas,
    trainPosition: newPosition,
    gameTime: run.gameTime + FAST_TICK_MS / 1000,
    forageCooldown: Math.max(0, run.forageCooldown - FAST_TICK_MS / 1000),
  })
}

function slowTick() {
  const run = useRunStore.getState()
  const meta = useMetaStore.getState()

  if (!run.coldStartComplete) return

  // Evaluate unlocks
  const unlockChanges = evaluateUnlocks(run, meta)
  if (Object.keys(unlockChanges).length > 0) {
    useRunStore.getState().set(unlockChanges)
  }

  // Check noise events
  const currentRun = useRunStore.getState()
  const noiseResult = checkNoiseEvents(currentRun)
  if (Object.keys(noiseResult.stateChanges).length > 0) {
    useRunStore.getState().set(noiseResult.stateChanges)
  }
  if (noiseResult.observationEntry) {
    observationLog.push(noiseResult.observationEntry)
    notifyObservationLog()
  }

  // Evaluate voice triggers
  evaluateVoiceTriggers()

  // Drain one voice message from queue into radioLog
  drainVoiceQueue()

  // Check expedition timers
  checkExpeditions()

  // Update location states based on train proximity
  updateLocationProximity()
}

function evaluateVoiceTriggers() {
  const run = useRunStore.getState()
  const meta = useMetaStore.getState()

  const now = run.gameTime
  const eligible: VoiceMessage[] = []

  for (const msg of VOICE_MESSAGES) {
    // Phase check
    if (msg.phase > run.phase) continue

    // Already shown (once-only)
    if (msg.once && run.shownVoiceMessageIds.includes(msg.id)) continue

    // Run-number gating for run2 cold start message
    if (msg.id === 'run2_cold_start' && meta.runNumber < 2) continue
    if (msg.id === 'cold_start_first_click' && meta.runNumber >= 2) continue

    // Cooldown check
    const lastShownAt = run.voiceMessageCooldowns[msg.id] ?? 0
    const cooldown = msg.cooldownSeconds ?? 0
    if (!msg.once && now - lastShownAt < cooldown) continue

    // Check if already queued
    if (run.voiceMessageQueue.some((q) => q.id === msg.id)) continue

    if (evaluateTrigger(msg.trigger, run, meta, {})) {
      eligible.push(msg)
    }
  }

  if (eligible.length === 0) return

  // Sort by priority descending, enqueue all eligible
  eligible.sort((a, b) => b.priority - a.priority)
  useRunStore.getState().set({
    voiceMessageQueue: [...run.voiceMessageQueue, ...eligible],
  })
}

function drainVoiceQueue() {
  const run = useRunStore.getState()
  if (run.voiceMessageQueue.length === 0) return

  const [next, ...remaining] = run.voiceMessageQueue
  if (!next) return

  const entry = {
    id: `entry_${Date.now()}_${Math.random()}`,
    lines: next.lines,
    timestamp: run.gameTime,
    isVoice: true,
  }

  useRunStore.getState().set({
    voiceMessageQueue: remaining,
    radioLog: [...run.radioLog, entry],
    shownVoiceMessageIds: run.shownVoiceMessageIds.includes(next.id)
      ? run.shownVoiceMessageIds
      : [...run.shownVoiceMessageIds, next.id],
    lastVoiceMessageAt: run.gameTime,
    voiceMessageCooldowns: {
      ...run.voiceMessageCooldowns,
      [next.id]: run.gameTime,
    },
  })
}

function checkExpeditions() {
  const run = useRunStore.getState()
  const now = run.gameTime

  let changed = false
  const updatedExpeditions = run.expeditions.map((exp) => {
    if (exp.status !== 'active') return exp
    if (now >= exp.expectedReturnAt + 300) {
      // 5 min overdue — mark as overdue
      changed = true
      return { ...exp, status: 'overdue' as const }
    }
    return exp
  })

  if (changed) {
    useRunStore.getState().set({ expeditions: updatedExpeditions })
  }
}

function updateLocationProximity() {
  const run = useRunStore.getState()
  const pos = run.trainPosition

  let changed = false
  const updatedMap = run.map.map((loc) => {
    if (loc.state !== 'unknown') return loc
    const dist = Math.abs(loc.x - pos)
    if (dist < 60) {
      changed = true
      return { ...loc, state: 'signal' as const }
    }
    return loc
  })

  if (changed) {
    useRunStore.getState().set({ map: updatedMap })
  }
}

// ─── Debug utilities (dev only) ───────────────────────────────────────────────

function exposeDebugTools(run: RunState) {
  if (typeof window === 'undefined') return
  ;(window as unknown as Record<string, unknown>)['__gameDebug'] = {
    setResonance: (v: number) => useRunStore.getState().set({ resonance: v }),
    setNoise: (v: number) => useRunStore.getState().set({ noise: v }),
    setSupplies: (v: number) => useRunStore.getState().set({ supplies: v }),
    addSurvivor: async () => {
      const { drawSurvivor } = await import('../../content/survivors')
      const s = drawSurvivor(run.survivors.map((s: { name: string }) => s.name))
      if (s) useRunStore.getState().set({ survivors: [...run.survivors, s] })
    },
    skipColdStart: () => useRunStore.getState().set({ coldStartComplete: true }),
    getState: () => useRunStore.getState(),
  }
}

if (import.meta.env.DEV) {
  // Re-expose debug tools whenever store changes (lazy, only in dev)
  useRunStore.subscribe((state) => exposeDebugTools(state))
}
