const STORAGE_KEY = 'unlocked_collectibles';

export function getUnlockedCollectibles(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (e) {
    console.error('Error parsing unlocked collectibles from local storage', e);
    return {};
  }
}

export function unlockCollectible(id: string): void {
  const unlocked = getUnlockedCollectibles();
  unlocked[id] = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked));
}

export function isCollectibleUnlocked(id: string): boolean {
  const unlocked = getUnlockedCollectibles();
  return !!unlocked[id];
}

export function getUnlockedCount(): number {
  return Object.keys(getUnlockedCollectibles()).length;
}