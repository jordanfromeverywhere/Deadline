import type { LocationType, SurvivorTrait } from '../core/state/types'

export interface ExpeditionVignette {
  vignette: string
  suppliesDelta: number
  fuelDelta: number
  moraleDelta: number
  informationDelta: number
  fragmentId?: string
  riskMultiplier: number
}

type VignetteKey = `${LocationType}_${SurvivorTrait}` | `${LocationType}_default`

const VIGNETTES: Partial<Record<VignetteKey, ExpeditionVignette[]>> = {
  depot_observant: [
    {
      vignette:
        'Found canned goods. Shelf stable. Also found a man living inside an industrial refrigeration unit. He identified himself as "a reasonable precaution." Took the cans. Left the man. Walked at speed.',
      suppliesDelta: 22,
      fuelDelta: 5,
      moraleDelta: -2,
      informationDelta: 1,
      riskMultiplier: 0.8,
    },
  ],
  depot_funny: [
    {
      vignette:
        'The depot was intact. Fuel, supplies, an instruction manual for a machine that doesn\'t exist yet. Brought everything except the manual. Kept one page. For morale.',
      suppliesDelta: 18,
      fuelDelta: 15,
      moraleDelta: 3,
      informationDelta: 1,
      riskMultiplier: 0.9,
    },
  ],
  depot_default: [
    {
      vignette:
        'Cleared the depot. Found supplies and fuel in the reserve tanks. Signs of previous occupation, but not recent. Whatever was here is not here anymore.',
      suppliesDelta: 20,
      fuelDelta: 12,
      moraleDelta: 0,
      informationDelta: 0,
      riskMultiplier: 1.0,
    },
    {
      vignette:
        'Depot 9. Took what was useful. There was a calendar on the wall, still open to a month that no longer applies. Left it.',
      suppliesDelta: 15,
      fuelDelta: 8,
      moraleDelta: -1,
      informationDelta: 0,
      riskMultiplier: 1.0,
    },
  ],

  ruin_observant: [
    {
      vignette:
        'The buildings are wrong. Not structurally — the geometry. Took photographs. The photographs show different geometry than I remember. Kept them anyway. Found notes in a room that should have been too high to reach. Attached.',
      suppliesDelta: 5,
      fuelDelta: 0,
      moraleDelta: -4,
      informationDelta: 2,
      fragmentId: 'old_presence_fragment',
      riskMultiplier: 1.3,
    },
  ],
  ruin_changed: [
    {
      vignette:
        'I knew where to look. I don\'t know how I knew. The fragment was exactly where I thought it would be, in a room I had never been in, in a building I had never visited. I brought it back. I\'m not sure what that means.',
      suppliesDelta: 3,
      fuelDelta: 0,
      moraleDelta: -3,
      informationDelta: 3,
      riskMultiplier: 1.0,
    },
  ],
  ruin_reckless: [
    {
      vignette:
        'Went in fast, didn\'t look at things directly. Found supplies and what might be a lore fragment wrapped in insulation. Got out in under twelve minutes. Only heard the wrong sound twice.',
      suppliesDelta: 12,
      fuelDelta: 0,
      moraleDelta: -2,
      informationDelta: 1,
      riskMultiplier: 1.5,
    },
  ],
  ruin_default: [
    {
      vignette:
        'Urban ruin. High resonance in the area. Took what was accessible. Some areas were not accessible — not due to structural failure. Due to something else. Did not investigate.',
      suppliesDelta: 8,
      fuelDelta: 0,
      moraleDelta: -3,
      informationDelta: 1,
      riskMultiplier: 1.2,
    },
  ],

  settlement_observant: [
    {
      vignette:
        'Nobody there. Town is intact. Dinner was on tables. Lights were on. A television was playing a show that stopped being broadcast four years ago and I don\'t know how. Brought back the food. Couldn\'t bring back the feeling of watching it.',
      suppliesDelta: 18,
      fuelDelta: 0,
      moraleDelta: -3,
      informationDelta: 1,
      riskMultiplier: 0.9,
    },
  ],
  settlement_funny: [
    {
      vignette:
        'Found three survivors. They were playing cards. They asked if I wanted to join. I did not have time to join. They offered to deal me in anyway. I stayed for two hands. We won\'t talk about this.',
      suppliesDelta: 10,
      fuelDelta: 0,
      moraleDelta: 8,
      informationDelta: 2,
      riskMultiplier: 0.7,
    },
  ],
  settlement_default: [
    {
      vignette:
        'The settlement was abandoned recently. Recent meaning weeks, not years. Food, water, radio equipment. Signs of organized departure. No signs of what they were departing from.',
      suppliesDelta: 15,
      fuelDelta: 0,
      moraleDelta: -2,
      informationDelta: 2,
      riskMultiplier: 0.8,
    },
  ],

  anomaly_changed: [
    {
      vignette:
        'I stood at the perimeter for a long time. The resonance here is — it\'s like hearing your name in a room that\'s otherwise silent. I found the fragment. I know it was there because it was left for someone to find. I\'m fairly sure that someone is not me.',
      suppliesDelta: 0,
      fuelDelta: 0,
      moraleDelta: -5,
      informationDelta: 3,
      riskMultiplier: 0.8,
    },
  ],
  anomaly_observant: [
    {
      vignette:
        'The site is anomalous in twelve distinct measurable ways. I measured them. This is the document of that measurement. I am aware that the measurements may have changed during the time it took to write this report.',
      suppliesDelta: 0,
      fuelDelta: 0,
      moraleDelta: -4,
      informationDelta: 4,
      riskMultiplier: 1.1,
    },
  ],
  anomaly_default: [
    {
      vignette:
        'Returned. Did not stay long. The resonance was — significant. Brought back a fragment. Did not look at it on the way back.',
      suppliesDelta: 0,
      fuelDelta: 0,
      moraleDelta: -5,
      informationDelta: 2,
      riskMultiplier: 1.4,
    },
  ],

  quiet_stubborn: [
    {
      vignette:
        'Nothing. Came back fine. Won\'t say anything else about it.',
      suppliesDelta: 0,
      fuelDelta: 0,
      moraleDelta: -1,
      informationDelta: 0,
      riskMultiplier: 0.6,
    },
  ],
  quiet_default: [
    {
      vignette:
        'Nothing there. Returned quickly. Some kind of absence that is worse than finding something.',
      suppliesDelta: 0,
      fuelDelta: 0,
      moraleDelta: -2,
      informationDelta: 0,
      riskMultiplier: 0.7,
    },
    {
      vignette:
        'Location was empty. The signal that brought us here has stopped. Couldn\'t determine what caused it.',
      suppliesDelta: 2,
      fuelDelta: 0,
      moraleDelta: -1,
      informationDelta: 1,
      riskMultiplier: 0.5,
    },
  ],

  incident_reckless: [
    {
      vignette:
        'Went in. Found something. Not describing it. Brought back a fragment. The fragment was not there before we arrived. I\'m going to need some time before the next assignment.',
      suppliesDelta: 0,
      fuelDelta: 0,
      moraleDelta: -15,
      informationDelta: 5,
      fragmentId: 'incident_lore_major',
      riskMultiplier: 2.0,
    },
  ],
  incident_default: [
    {
      vignette:
        'Came back. Not saying what was there. Not saying anything about it. Recommend not going back.',
      suppliesDelta: 0,
      fuelDelta: 0,
      moraleDelta: -10,
      informationDelta: 3,
      fragmentId: 'incident_lore_major',
      riskMultiplier: 1.8,
    },
  ],
}

export function getExpeditionVignette(
  locationType: LocationType,
  trait: SurvivorTrait
): ExpeditionVignette {
  const specific = VIGNETTES[`${locationType}_${trait}`]
  if (specific && specific.length > 0) {
    return specific[Math.floor(Math.random() * specific.length)]!
  }
  const defaults = VIGNETTES[`${locationType}_default`]
  if (defaults && defaults.length > 0) {
    return defaults[Math.floor(Math.random() * defaults.length)]!
  }
  // Fallback
  return {
    vignette: 'Returned from expedition. Conditions were difficult.',
    suppliesDelta: 5,
    fuelDelta: 0,
    moraleDelta: -1,
    informationDelta: 0,
    riskMultiplier: 1.0,
  }
}
