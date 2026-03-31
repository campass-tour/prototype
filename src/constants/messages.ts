export interface Message {
  id: string;
  locationId: string;
  content: string;
  author: {
    username: string;
    avatarUrl?: string;
  };
  likes: number;
  timestamp: string; // ISO 8601 string
  imageUrl?: string;
}

export const MESSAGES: Message[] = [
  {
    id: "msg_1",
    locationId: "cb",
    content: "The sunset from the central building today was absolutely breathtaking! 🌅",
    author: {
      username: "SkyWatcher99",
      avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704a",
    },
    likes: 24,
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    id: "msg_2",
    locationId: "cb",
    content: "Can someone tell me where room 302 is? I've been lost for 10 minutes...",
    author: {
      username: "LostFreshman",
    },
    likes: 5,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "msg_3",
    locationId: "sb",
    content: "The new lab equipment in Science Building B is amazing! Finally we don't have to share microscopes.",
    author: {
      username: "BioNerd",
      avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704b",
    },
    likes: 42,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: "msg_4",
    locationId: "mus",
    content: "Just saw the new dinosaur bone exhibit. It's so much bigger in person.",
    author: {
      username: "DinoFan",
    },
    likes: 18,
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
  },
  {
    id: "msg_5",
    locationId: "hui",
    content: "Best coffee on campus! Strongly recommend the iced caramel macchiato. ☕",
    author: {
      username: "CoffeeAddict",
      avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704c",
    },
    likes: 89,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
  },
  {
    id: "msg_6",
    locationId: "cb",
    content: "Study group meeting at the 2nd floor lounge in 10 mins!",
    author: {
      username: "StudyHard",
    },
    likes: 12,
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
  },
];

export const getMessagesByLocation = (locationId: string): Message[] => {
  return MESSAGES.filter((msg) => msg.locationId === locationId);
};
