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
