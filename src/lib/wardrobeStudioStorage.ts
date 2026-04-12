import { WARDROBE_DEFAULT_STATE } from '../constants/wardrobeCatalog';
import type { WardrobeState } from '../types';

const WARDROBE_STUDIO_STORAGE_KEY = 'wardrobe_studio_state';

export function getWardrobeStudioState(): WardrobeState {
  try {
    const raw = localStorage.getItem(WARDROBE_STUDIO_STORAGE_KEY);
    if (!raw) return WARDROBE_DEFAULT_STATE;

    const parsed = JSON.parse(raw) as Partial<WardrobeState>;
    return {
      balance: typeof parsed.balance === 'number' ? parsed.balance : WARDROBE_DEFAULT_STATE.balance,
      ownedItemIds: Array.isArray(parsed.ownedItemIds)
        ? parsed.ownedItemIds.filter((value): value is string => typeof value === 'string')
        : WARDROBE_DEFAULT_STATE.ownedItemIds,
      equippedBySlot: parsed.equippedBySlot ?? WARDROBE_DEFAULT_STATE.equippedBySlot,
    };
  } catch (error) {
    console.error('Error reading wardrobe studio state', error);
    return WARDROBE_DEFAULT_STATE;
  }
}

export function setWardrobeStudioState(nextState: WardrobeState): void {
  try {
    localStorage.setItem(WARDROBE_STUDIO_STORAGE_KEY, JSON.stringify(nextState));
  } catch (error) {
    console.error('Error saving wardrobe studio state', error);
  }
}
