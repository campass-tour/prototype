export interface GpsCoordinate {
  lat: number;
  lon: number;
}

export interface MessageAuthor {
  username: string;
  avatarUrl?: string;
}

export interface Message {
  id: string;
  locationId: string;
  content: string;
  author: MessageAuthor;
  /** Optional reference to a user record in `src/data/users.json` */
  authorId?: number;
  likes: number;
  timestamp: string; // ISO
  imageUrl?: string;
}

export interface Location {
  id: string;
  name: string;
  x?: number; // percentage x (calculated from GPS if not provided)
  y?: number; // percentage y (calculated from GPS if not provided)
  gps?: GpsCoordinate; // optional real GPS coordinates
  lv: number;
}

export interface LocationLore {
  id: string;
  title: string;
  content: string;
}

export interface UserPosition {
  gps?: GpsCoordinate; // optional real GPS coordinates
  x: number;
  y: number;
  heading: number;
}

export type WardrobeCategoryId = 'all' | 'head' | 'face' | 'gear';

export type WardrobeSlot = Exclude<WardrobeCategoryId, 'all'>;

export type WardrobeIconName =
  | 'badge-cent'
  | 'captain-band'
  | 'laurel-crown'
  | 'mono-shades'
  | 'star-lens'
  | 'field-notes'
  | 'campus-satchel'
  | 'signal-kite';

export interface WardrobeCategory {
  id: WardrobeCategoryId;
  label: string;
  slot: WardrobeCategoryId;
  icon: string;
}

export interface WardrobeItem {
  id: string;
  name: string;
  category: WardrobeSlot;
  price: number;
  icon: WardrobeIconName;
  description: string;
  ownedByDefault?: boolean;
  modelFile?: string | null;
  previewOffset?: [number, number, number] | null;
  previewRotation?: [number, number, number] | null;
  previewScale?: [number, number, number] | null;
}

export interface WardrobeState {
  balance: number;
  ownedItemIds: string[];
  equippedBySlot: Partial<Record<WardrobeSlot, string>>;
}
