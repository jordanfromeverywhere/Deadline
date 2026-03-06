import type { RunState, ResourceRates, Location } from '../state/types'

export function getNearbyLocations(run: RunState, range = 30): Location[] {
  return run.map.filter((loc) => Math.abs(loc.x - run.trainPosition) <= range)
}

export function getLocationResonanceMultiplier(run: RunState): number {
  if (run.trainMoving) return 1.0
  const nearby = getNearbyLocations(run)
  if (nearby.length === 0) return 1.0
  // Use the highest multiplier among nearby locations
  return Math.max(...nearby.map((l) => l.resonanceMultiplier))
}

export function computeRates(run: RunState): ResourceRates {
  const BASE_RESONANCE_PER_TICK = 0.125 // 0.5/sec at 250ms tick = +1 per 2s

  let resonanceRate = BASE_RESONANCE_PER_TICK

  // Signal car boosts resonance while moving
  if (run.carsUnlocked.includes('signal') && run.trainMoving) {
    resonanceRate *= 1.33
  }

  // Location multiplier (only applies when stopped)
  const locMult = getLocationResonanceMultiplier(run)
  resonanceRate *= locMult

  // Archive car adds small bonus
  if (run.carsUnlocked.includes('archive') && run.memoriesFound.length > 0) {
    resonanceRate += 0.05
  }

  // Fuel drain while moving
  const fuelRate = run.trainMoving ? -0.05 : 0 // ~0.2/sec while moving

  // Supply drain from survivor upkeep
  const survivorCount = run.survivors.filter((s) => s.status !== 'lost').length
  const suppliesRate = -(survivorCount * 0.0025) // ~0.01/sec per survivor

  // Power generation from workshop
  const powerRate = run.carsUnlocked.includes('workshop') ? 0.025 : 0

  // Morale drifts toward 50 slowly
  const moraleDrift = run.morale > 50 ? -0.005 : run.morale < 50 ? 0.005 : 0

  return {
    resonance: resonanceRate,
    supplies: suppliesRate,
    fuel: fuelRate,
    power: powerRate,
    morale: moraleDrift,
  }
}

export function applyResourceDeltas(run: RunState, rates: ResourceRates): Partial<RunState> {
  const newResonance = Math.min(run.resonance + rates.resonance, run.resonanceCap * 1.2)
  const newSupplies = Math.max(0, Math.min(run.supplies + rates.supplies, run.suppliesCap))
  const newFuel = Math.max(0, Math.min(run.fuel + rates.fuel, run.fuelCap))
  const newPower = Math.max(0, Math.min(run.power + rates.power, run.powerCap))
  const newMorale = Math.max(0, Math.min(run.morale + rates.morale, 100))

  // Overflow into noise
  let newNoise = run.noise
  if (newResonance > run.resonanceCap) {
    const overflow = newResonance - run.resonanceCap
    newNoise = Math.min(100, newNoise + overflow * 0.5)
  }

  return {
    resonance: Math.min(newResonance, run.resonanceCap),
    supplies: newSupplies,
    fuel: newFuel,
    power: newPower,
    morale: newMorale,
    noise: newNoise,
  }
}
