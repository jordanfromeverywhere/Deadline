// ─── Resource & Upgrade Keys ─────────────────────────────────────────────────

export type CarKey =
  | 'control'
  | 'storage'
  | 'bunk'
  | 'workshop'
  | 'signal'
  | 'infirmary'
  | 'archive'
  | 'observation'

export type ActionKey =
  | 'radio'
  | 'forage'
  | 'move'
  | 'stop'
  | 'ping'
  | 'scan'
  | 'signalBoost'
  | 'reconstruct'

export type PanelKey =
  | 'console'
  | 'radio'
  | 'trainStatus'
  | 'survivors'
  | 'map'
  | 'memory'
  | 'storage'
  | 'observation'
  | 'negotiation'

export type EndingKey =
  | 'dissolution'
  | 'routeCompleted'
  | 'broadcast'
  | 'negotiation'
  | 'theSilence'

export type LocationType =
  | 'depot'
  | 'settlement'
  | 'ruin'
  | 'anomaly'
  | 'quiet'
  | 'incident'

export type LocationState =
  | 'unknown'
  | 'signal'
  | 'passed'
  | 'scouted'
  | 'explored'

export type SurvivorTrait =
  | 'observant'
  | 'reckless'
  | 'rattled'
  | 'changed'
  | 'stubborn'
  | 'funny'

export type SurvivorStatus =
  | 'available'
  | 'on_expedition'
  | 'injured'
  | 'overdue'
  | 'lost'
  | 'changed'

export type NoiseLevel = 'low' | 'moderate' | 'high' | 'critical' | 'peak'

export type Phase = 1 | 2 | 3

// ─── Map & Exploration ────────────────────────────────────────────────────────

export interface Location {
  id: string
  x: number
  type: LocationType
  state: LocationState
  name?: string
  shortDescription?: string
  fullDescription?: string
  resourceLoot?: Partial<ResourceLoot>
  fragmentId?: string
  resonanceMultiplier: number
  annotations: string[]
}

export interface ResourceLoot {
  supplies: number
  fuel: number
  power: number
  information: number
}

// ─── Survivors & Expeditions ─────────────────────────────────────────────────

export interface Survivor {
  id: string
  name: string
  descriptor: string
  trait: SurvivorTrait
  traitRevealed: boolean
  morale: number
  status: SurvivorStatus
  expeditionCount: number
  expeditionLog: string[]
  isStrikethrough: boolean
}

export interface ExpeditionOutcome {
  survived: boolean
  loot: Partial<ResourceLoot>
  moraleDelta: number
  fragmentId?: string
  vignette: string
  traitRevealed?: SurvivorTrait
  survivorStatusChange?: SurvivorStatus
}

export interface Expedition {
  id: string
  survivorId: string
  locationId: string
  dispatchedAt: number
  expectedReturnAt: number
  status: 'active' | 'overdue' | 'resolved'
  outcome?: ExpeditionOutcome
}

// ─── Voice / Radio ────────────────────────────────────────────────────────────

export type TriggerCondition =
  | { type: 'resonance_reaches'; value: number }
  | { type: 'noise_threshold'; level: NoiseLevel }
  | { type: 'action_taken'; action: ActionKey; minCount?: number }
  | { type: 'survivor_count_reaches'; count: number }
  | { type: 'car_unlocked'; car: CarKey }
  | { type: 'expedition_returned'; outcome: 'success' | 'overdue' | 'lost' }
  | { type: 'memory_found'; fragmentId?: string }
  | { type: 'time_since_last_message'; seconds: number }
  | { type: 'run_number_at_least'; run: number }
  | { type: 'game_time_elapsed'; seconds: number }
  | { type: 'location_nearby'; locationType: LocationType }
  | { type: 'panel_revealed'; panel: PanelKey }

export interface VoiceMessage {
  id: string
  lines: string[]
  trigger: TriggerCondition
  phase: Phase
  priority: number
  once: boolean
  cooldownSeconds?: number
  tags?: string[]
}

export interface RadioEntry {
  id: string
  lines: string[]
  timestamp: number
  isVoice: boolean
}

// ─── Memory Fragments ─────────────────────────────────────────────────────────

export interface MemoryFragment {
  id: string
  title: string
  text: string
  author?: string
  isPlayerMemory: boolean
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export interface InventoryItem {
  id: string
  name: string
  description: string
  quantity: number
  category: 'supplies' | 'fuel' | 'equipment' | 'unknown'
}

// ─── Run State ────────────────────────────────────────────────────────────────

export interface RunState {
  phase: Phase
  resonance: number
  resonanceCap: number
  noise: number
  supplies: number
  suppliesCap: number
  fuel: number
  fuelCap: number
  power: number
  powerCap: number
  morale: number
  information: number
  trainMoving: boolean
  trainPosition: number
  carsUnlocked: CarKey[]
  actionsUnlocked: ActionKey[]
  panelsVisible: PanelKey[]
  survivors: Survivor[]
  expeditions: Expedition[]
  map: Location[]
  radioLog: RadioEntry[]
  voiceMessageQueue: VoiceMessage[]
  shownVoiceMessageIds: string[]
  voiceMessageCooldowns: Record<string, number>
  memoriesFound: string[]
  inventoryItems: InventoryItem[]
  gameTime: number
  lastVoiceMessageAt: number
  forageCooldown: number
  lastTriggeredActions: Partial<Record<ActionKey, number>>
  lastNoiseLevelSeen: NoiseLevel
  coldStartComplete: boolean
  radioFirstClicked: boolean
}

// ─── Meta State ───────────────────────────────────────────────────────────────

export interface MetaState {
  runNumber: number
  completedEndings: EndingKey[]
  totalMemoriesEverFound: string[]
  carriedMemoriesIntoCurrentRun: string[]
  survivorsFromPreviousRuns: Survivor[]
  firstVoiceMessageSeen: boolean
}

// ─── Resource Rates ───────────────────────────────────────────────────────────

export interface ResourceRates {
  resonance: number
  supplies: number
  fuel: number
  power: number
  morale: number
}

// ─── Unlock Rules ─────────────────────────────────────────────────────────────

export type UnlockKey =
  | 'storage_car'
  | 'bunk_car'
  | 'workshop_car'
  | 'signal_car'
  | 'infirmary_car'
  | 'archive_car'
  | 'observation_car'
  | 'panel_trainStatus'
  | 'panel_survivors'
  | 'panel_map'
  | 'panel_memory'
  | 'panel_storage'
  | 'panel_observation'
  | 'action_move'
  | 'action_forage'
  | 'action_ping'
  | 'action_scan'
  | 'action_signalBoost'
  | 'phase2'
  | 'phase3'
