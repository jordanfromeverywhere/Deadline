import type { InventoryItem } from '../core/state/types'

export const ITEM_DESCRIPTIONS: Record<string, string> = {
  canned_peaches:
    'Contents: peaches, water, despair (trace amounts). Best before: a time that no longer applies.',
  fuel_canister:
    "Standard issue. Smells like something that used to be alive. Normal.",
  unknown_object:
    'Retrieved from Ruin 4. Dense. Warm to the touch. Morale impact: -1 (visual). Assigned to storage pending classification. Classification has not occurred.',
  gerald_form:
    "A government form, partially completed. Gerald believes this caused the apocalypse. Gerald's handwriting is extremely neat. Cannot be discarded.",
  medkit:
    "Contents still sealed. Expiry date removed — either deliberately or by time. Optimism either way.",
  radio_parts:
    "Components from a disassembled receiver. Someone made careful notes in the margins of the manual. The notes stop mid-sentence.",
  research_notes:
    "Handwritten. Dense. References a project by a name that appears in no surviving institutional record. Pages 3–7 are missing.",
  photograph:
    "A photograph of a location. The location does not match anywhere on the current map. The date on the back is from before the event.",
  water_purification_tablets:
    "Twenty tablets. Enough for forty liters. The leaflet says to not think about what they're purifying. It doesn't say that. But.",
  emergency_rations:
    "Military-issue. High caloric density. Zero nutritional joy. Survivable.",
}

export function makeSupplyItem(count: number): InventoryItem {
  return {
    id: `supplies_${Date.now()}`,
    name: 'CANNED GOODS',
    description: ITEM_DESCRIPTIONS['canned_peaches']!,
    quantity: count,
    category: 'supplies',
  }
}

export function makeFuelItem(amount: number): InventoryItem {
  return {
    id: `fuel_${Date.now()}`,
    name: 'FUEL CANISTER',
    description: ITEM_DESCRIPTIONS['fuel_canister']!,
    quantity: amount,
    category: 'fuel',
  }
}

export const GERALD_FORM_ITEM: InventoryItem = {
  id: 'gerald_form_unique',
  name: "GERALD'S FORM (x1)",
  description: ITEM_DESCRIPTIONS['gerald_form']!,
  quantity: 1,
  category: 'unknown',
}
