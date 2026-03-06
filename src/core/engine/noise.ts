import type { NoiseLevel, RunState } from '../state/types'
import { getNoiseLevelPct } from '../../content/voice/triggers'

export const OBSERVATION_LOG_ENTRIES = [
  '09:14 — movement in sector west. large. very large. moved behind the treeline. the treeline is three kilometers away. it moved behind the whole treeline.',
  '22:07 — it looked at the train. i want to be precise: it did not look toward the train. it looked at it specifically. i don\'t know how i know that. i know.',
  '03:55 — there are more of them than yesterday. there are more of them than there were an hour ago. this is mathematically — this is — [log continues for 4 more lines of increasing incoherence, then stops]',
  '14:30 — a grocery cart on the plains. no store visible in any direction. possibly escaped.',
  '08:15 — a building with all its windows lit from inside. no power grid in this region. lights are warm. someone is having a nice time in there. we didn\'t stop.',
  '17:42 — the horizon is the wrong shape. the instruments do not agree on what direction it is happening.',
  '00:03 — silence. absolute silence. for four minutes. then the birds started again. the wrong birds.',
  '11:20 — one of them was stationary for six hours. we were stationary too. it waited. when we moved, it moved. we haven\'t stopped since.',
]

let _observationIndex = 0

export function getNextObservationEntry(): string {
  const entry = OBSERVATION_LOG_ENTRIES[_observationIndex % OBSERVATION_LOG_ENTRIES.length]!
  _observationIndex++
  return entry
}

export function checkNoiseEvents(run: RunState): {
  stateChanges: Partial<RunState>
  observationEntry?: string
  forceMove?: boolean
} {
  const level: NoiseLevel = getNoiseLevelPct(run.noise)

  if (level === 'peak') {
    const entry = getNextObservationEntry()
    return {
      stateChanges: {
        noise: 50,
        trainMoving: true, // force move
      },
      observationEntry: entry,
      forceMove: true,
    }
  }

  return { stateChanges: {} }
}
