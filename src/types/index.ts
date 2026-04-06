export interface MessageAuthor {
  username: string;
  avatarUrl?: string;
}

export interface Message {
  id: string;
  locationId: string;
  content: string;
  author: MessageAuthor;
  likes: number;
  timestamp: string; // ISO
  imageUrl?: string;
}

export interface Location {
  id: string;
  name: string;
  x: number;
  y: number;
}

export interface LocationLore {
  id: string;
  title: string;
  content: string;
}

export interface UserPosition {
  x: number;
  y: number;
  heading: number;
}
