import messagesData from '../data/messages.json';
import locationsData from '../data/locations.json';
import loresData from '../data/lores.json';
import userPositionData from '../data/userPosition.json';
import type { Message, Location, LocationLore, UserPosition } from '../types';

const messages = messagesData as unknown as Message[];
const locations = locationsData as unknown as Location[];
const lores = loresData as unknown as LocationLore[];
const userPosition = userPositionData as unknown as UserPosition;

export function getMessages(): Message[] {
  return messages;
}

export function getMessagesByLocation(locationId: string): Message[] {
  return messages.filter((m) => m.locationId === locationId);
}

export function getLocations(): Location[] {
  return locations;
}

export function getLocationById(id: string): Location | undefined {
  return locations.find((l) => l.id === id);
}

export function getLoreById(id: string): LocationLore | undefined {
  return lores.find((l) => l.id === id);
}

export function getUserPosition(): UserPosition {
  return userPosition;
}

export default {
  getMessages,
  getMessagesByLocation,
  getLocations,
  getLocationById,
  getLoreById,
  getUserPosition,
};
