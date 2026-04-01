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
    imageUrl: "https://wallpaperaccess.com/full/8975119.jpg",
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
    imageUrl: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800",
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
  {
    id: "msg_7",
    locationId: "sb",
    content: "Found a quiet spot in Science Building B for reading. Highly recommend!",
    author: {
      username: "Bookworm",
      avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    likes: 21,
    timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5 hours ago
    imageUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "msg_8",
    locationId: "mus",
    content: "The art gallery is a hidden gem. The lighting is perfect for photos!",
    author: {
      username: "ArtLover",
      avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
    },
    likes: 33,
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "msg_9",
    locationId: "hui",
    content: "Live music at Hui Bar tonight! Who's coming?",
    author: {
      username: "MusicFan",
    },
    likes: 47,
    timestamp: new Date(Date.now() - 1000 * 60 * 200).toISOString(), // 3.3 hours ago
  },
  {
    id: "msg_10",
    locationId: "cb",
    content: "Lost my water bottle near the entrance. Please DM if found!",
    author: {
      username: "HydratedHuman",
    },
    likes: 2,
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 mins ago
  },
  {
    id: "msg_11",
    locationId: "sb",
    content: "The vending machine finally has my favorite snacks again!",
    author: {
      username: "SnackSeeker",
    },
    likes: 15,
    timestamp: new Date(Date.now() - 1000 * 60 * 70).toISOString(), // 1.1 hours ago
  },
  {
    id: "msg_12",
    locationId: "mus",
    content: "Attended a great workshop on ancient pottery. Learned so much!",
    author: {
      username: "HistoryBuff",
    },
    likes: 28,
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
  },
  {
    id: "msg_13",
    locationId: "hui",
    content: "Try the cheesecake at Hui Bar, it's delicious!",
    author: {
      username: "SweetTooth",
    },
    likes: 36,
    timestamp: new Date(Date.now() - 1000 * 60 * 250).toISOString(), // 4.1 hours ago
  },
];

export const getMessagesByLocation = (locationId: string): Message[] => {
  return MESSAGES.filter((msg) => msg.locationId === locationId);
};
