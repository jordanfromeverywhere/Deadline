import type { Survivor } from '../core/state/types'

let _idCounter = 0
function makeSurvivor(
  partial: Omit<Survivor, 'id' | 'morale' | 'status' | 'expeditionCount' | 'expeditionLog' | 'isStrikethrough' | 'traitRevealed'>
): Survivor {
  return {
    id: `survivor_${++_idCounter}`,
    morale: 70,
    status: 'available',
    expeditionCount: 0,
    expeditionLog: [],
    isStrikethrough: false,
    traitRevealed: false,
    ...partial,
  }
}

// Pool of potential survivors — drawn from when survivors join
export const SURVIVOR_POOL: Omit<Survivor, 'id' | 'status' | 'expeditionCount' | 'expeditionLog' | 'isStrikethrough'>[] = [
  {
    name: 'Marcus',
    descriptor: 'Former accountant. Extremely calm in crises. Unsettling in non-crises.',
    trait: 'stubborn',
    traitRevealed: false,
    morale: 75,
  },
  {
    name: 'Yeva',
    descriptor: 'Geologist. Describes everything in terms of geological time.',
    trait: 'observant',
    traitRevealed: false,
    morale: 65,
  },
  {
    name: 'Dana',
    descriptor: "Unknown prior occupation. Won't say. Excellent at finding things. Possibly related.",
    trait: 'reckless',
    traitRevealed: false,
    morale: 60,
  },
  {
    name: 'Gerald',
    descriptor: 'Retired civil servant. Believes he caused the apocalypse. Morale: surprisingly high.',
    trait: 'funny',
    traitRevealed: false,
    morale: 85,
  },
  {
    name: 'Chen',
    descriptor: 'Former emergency dispatcher. Efficient. Dislikes silence.',
    trait: 'observant',
    traitRevealed: false,
    morale: 70,
  },
  {
    name: 'Priya',
    descriptor: 'Structural engineer. Has opinions about the train.',
    trait: 'stubborn',
    traitRevealed: false,
    morale: 72,
  },
  {
    name: 'Tomás',
    descriptor: "Was a nurse. Hasn't talked about what he saw. Handles injuries quietly.",
    trait: 'changed',
    traitRevealed: false,
    morale: 55,
  },
  {
    name: 'Rin',
    descriptor: 'Teenager. Will not explain where she learned to do the things she does.',
    trait: 'reckless',
    traitRevealed: false,
    morale: 68,
  },
  {
    name: 'Osei',
    descriptor: 'Former radio technician. Gets along well with the Signal Car.',
    trait: 'observant',
    traitRevealed: false,
    morale: 73,
  },
  {
    name: 'Sable',
    descriptor: "Won't give a last name. Very calm near anomalies. Too calm.",
    trait: 'changed',
    traitRevealed: false,
    morale: 58,
  },
]

export function drawSurvivor(exclude: string[] = []): Survivor | null {
  const available = SURVIVOR_POOL.filter((s) => !exclude.includes(s.name))
  if (available.length === 0) return null
  const def = available[Math.floor(Math.random() * available.length)]!
  return makeSurvivor(def)
}
