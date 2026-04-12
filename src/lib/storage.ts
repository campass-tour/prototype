const STORAGE_KEY = 'unlocked_collectibles';
const CLUE_UNLOCK_KEY = 'clue_unlock_levels';
const USER_ROLE_KEY = 'user_exploration_role';

export type UserRole = 'freshman' | 'senior' | 'visitor';

export function getUserRole(): UserRole | null {
  try {
    return localStorage.getItem(USER_ROLE_KEY) as UserRole | null;
  } catch (e) {
    return null;
  }
}

export function setUserRole(role: UserRole): void {
  try {
    localStorage.setItem(USER_ROLE_KEY, role);
  } catch (e) {
    console.error('Error saving user role to local storage', e);
  }
}

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

export function getClueUnlockLevel(locationId: string): number {
  try {
    const levels = JSON.parse(localStorage.getItem(CLUE_UNLOCK_KEY) || '{}');
    return levels[locationId] || 1; // Default to level 1
  } catch (e) {
    console.error('Error parsing clue unlock levels from local storage', e);
    return 1;
  }
}

export function setClueUnlockLevel(locationId: string, level: number): void {
  try {
    const levels = JSON.parse(localStorage.getItem(CLUE_UNLOCK_KEY) || '{}');
    levels[locationId] = level;
    localStorage.setItem(CLUE_UNLOCK_KEY, JSON.stringify(levels));
  } catch (e) {
    console.error('Error saving clue unlock level to local storage', e);
  }
}