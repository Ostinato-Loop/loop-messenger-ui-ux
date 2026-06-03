export type Chat = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
  pinned?: boolean;
  verified?: boolean;
  business?: boolean;
  online?: boolean;
  typing?: boolean;
  group?: boolean;
};

const av = (seed: string) => `https://i.pravatar.cc/150?u=${seed}`;

export const chats: Chat[] = [
  { id: "jane", name: "Jane Smith", avatar: av("jane"), lastMessage: "Hey! Are we still meeting today?", time: "12:45", unread: 2, online: true, pinned: true },
  { id: "design", name: "Design Team", avatar: av("design"), lastMessage: "Alex: Here is the new mockup", time: "11:32", unread: 5, group: true },
  { id: "rald", name: "RALD Announcements", avatar: av("rald"), lastMessage: "New update is now live!", time: "10:15", verified: true },
  { id: "michael", name: "Michael Johnson", avatar: av("michael"), lastMessage: "Thanks for your help!", time: "Yesterday", unread: 1, typing: true },
  { id: "family", name: "Family Group", avatar: av("family"), lastMessage: "Mom: Dinner at 7pm", time: "Yesterday", unread: 3, group: true },
  { id: "phoenix", name: "Project Phoenix", avatar: av("phoenix"), lastMessage: "You: Document uploaded", time: "Mon", group: true },
  { id: "sarah", name: "Sarah Lee", avatar: av("sarah"), lastMessage: "See you soon!", time: "Mon", online: true },
  { id: "kwame", name: "Kwame Adjei", avatar: av("kwame"), lastMessage: "Voice message", time: "Sun", business: true },
  { id: "saved", name: "Saved Messages", avatar: av("saved"), lastMessage: "Photo", time: "Sun" },
];

export type Community = {
  id: string;
  name: string;
  avatar: string;
  category: string;
  members: number;
  activity: "high" | "medium" | "low";
  verified?: boolean;
  joined?: boolean;
  description: string;
};

export const communities: Community[] = [
  { id: "ug-tech", name: "University of Ghana Tech", avatar: av("ugtech"), category: "University", members: 12400, activity: "high", verified: true, joined: true, description: "Builders, designers, founders at UG." },
  { id: "afro-devs", name: "AfroDevs Collective", avatar: av("afrodevs"), category: "Creator", members: 8230, activity: "high", verified: true, description: "African software engineers shipping global products." },
  { id: "accra-local", name: "Accra Local", avatar: av("accra"), category: "City", members: 24500, activity: "medium", description: "Everything happening around Accra — events, food, life." },
  { id: "loop-biz", name: "Loop Business Network", avatar: av("loopbiz"), category: "Business", members: 5120, activity: "high", verified: true, description: "Founders & operators across the RALD ecosystem." },
  { id: "design-africa", name: "Design Africa", avatar: av("designafrica"), category: "Creator", members: 3400, activity: "medium", joined: true, description: "Product, brand and motion designers." },
  { id: "nairobi-runners", name: "Nairobi Runners", avatar: av("nairobi"), category: "Interest", members: 1820, activity: "low", description: "Weekend runs across Nairobi." },
];

export type CallEntry = {
  id: string;
  name: string;
  avatar: string;
  type: "voice" | "video";
  direction: "incoming" | "outgoing" | "missed";
  time: string;
  group?: boolean;
};

export const calls: CallEntry[] = [
  { id: "c1", name: "Jane Smith", avatar: av("jane"), type: "video", direction: "outgoing", time: "Today, 12:01" },
  { id: "c2", name: "Design Team", avatar: av("design"), type: "voice", direction: "incoming", time: "Today, 10:32", group: true },
  { id: "c3", name: "Michael Johnson", avatar: av("michael"), type: "voice", direction: "missed", time: "Yesterday" },
  { id: "c4", name: "Sarah Lee", avatar: av("sarah"), type: "video", direction: "incoming", time: "Yesterday" },
  { id: "c5", name: "Kwame Adjei", avatar: av("kwame"), type: "voice", direction: "outgoing", time: "Mon" },
];

export const audioRooms = [
  { id: "r1", title: "Building for Africa-first", host: "AfroDevs", listeners: 412, live: true },
  { id: "r2", title: "RALD Townhall — November", host: "RALD Team", listeners: 1280, live: true },
  { id: "r3", title: "Designers' open critique", host: "Design Africa", listeners: 87, live: false },
];

export type DiscoverPerson = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  verified?: boolean;
};

export const suggestedPeople: DiscoverPerson[] = [
  { id: "p1", name: "Ama Boateng", handle: "@ama", avatar: av("ama"), bio: "Product designer · Accra", verified: true },
  { id: "p2", name: "Tunde Bakare", handle: "@tunde", avatar: av("tunde"), bio: "Engineer at RALD" },
  { id: "p3", name: "Zola Mensah", handle: "@zola", avatar: av("zola"), bio: "Creator · 50k followers", verified: true },
  { id: "p4", name: "Daniel O.", handle: "@danielo", avatar: av("danielo"), bio: "Founder · Loop Business" },
];

export const trending = [
  { id: "t1", title: "Loop Messenger goes live across RALD", topic: "RALD", posts: "12.4k" },
  { id: "t2", title: "PayRALD launches instant transfers", topic: "PayRALD", posts: "8.1k" },
  { id: "t3", title: "GitRald reaches 100k repositories", topic: "GitRald", posts: "3.2k" },
  { id: "t4", title: "DunaRald opens creator fund", topic: "DunaRald", posts: "5.7k" },
];

export const events = [
  { id: "e1", title: "RALD Dev Conference 2026", where: "Accra · Dec 14", attendees: 1200 },
  { id: "e2", title: "Loop Business Mixer", where: "Lagos · Dec 21", attendees: 340 },
];

export type ChatMessage = {
  id: string;
  text?: string;
  file?: { name: string; size: string };
  from: "me" | "them";
  time: string;
  read?: boolean;
  reaction?: string;
  status?: "sending" | "sent" | "failed";
};

export const sampleConversation: ChatMessage[] = [
  { id: "m1", from: "them", text: "Hey! Are we still meeting today?", time: "12:44" },
  { id: "m2", from: "me", text: "Yes, at 3PM. I'll send the details.", time: "12:44", read: true },
  { id: "m3", from: "them", file: { name: "Project_Proposal.pdf", size: "2.4 MB" }, time: "12:45" },
  { id: "m4", from: "me", text: "Looks great!", time: "12:45", read: true, reaction: "🔥" },
  { id: "m5", from: "them", text: "Let me know if you need anything else.", time: "12:45" },
  { id: "m6", from: "me", text: "Will do. Thanks!", time: "12:45", read: true, reaction: "❤️" },
];

export type FeedPost = {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  verified?: boolean;
  community?: string;
  time: string;
  text: string;
  likes: number;
  comments: number;
  reposts: number;
  pinned?: boolean;
};

export const feed: FeedPost[] = [
  {
    id: "f1",
    author: "RALD",
    handle: "@rald",
    avatar: av("rald"),
    verified: true,
    community: "RALD Announcements",
    time: "2h",
    text: "Loop Messenger is now live across the RALD ecosystem. One identity. Every conversation. Welcome home.",
    likes: 1240,
    comments: 312,
    reposts: 488,
    pinned: true,
  },
  {
    id: "f2",
    author: "Ama Boateng",
    handle: "@ama",
    avatar: av("ama"),
    verified: true,
    community: "Design Africa",
    time: "4h",
    text: "Spent the weekend redesigning the Loop avatar system. Small detail, huge identity unlock. Drop in the comments if you want the Figma file.",
    likes: 412,
    comments: 88,
    reposts: 36,
  },
  {
    id: "f3",
    author: "Kwame Adjei",
    handle: "@kwame",
    avatar: av("kwame"),
    community: "Loop Business Network",
    time: "6h",
    text: "Hiring 3 senior engineers in Accra. Remote OK across the continent. PayRALD payroll, full Loop comms stack. DM me.",
    likes: 220,
    comments: 41,
    reposts: 19,
  },
  {
    id: "f4",
    author: "AfroDevs",
    handle: "@afrodevs",
    avatar: av("afrodevs"),
    verified: true,
    community: "AfroDevs Collective",
    time: "9h",
    text: "Live audio room tonight at 8PM GMT — \"Building edge-native apps for the next billion users\". Cloudflare engineers joining.",
    likes: 89,
    comments: 12,
    reposts: 22,
  },
];

export type CommunityPost = {
  id: string;
  author: string;
  avatar: string;
  time: string;
  text: string;
  likes: number;
  comments: number;
};

export const communityPosts: CommunityPost[] = [
  { id: "cp1", author: "Ama Boateng", avatar: av("ama"), time: "1h", text: "Just shared the new brand kit in #resources. Pull it for your next pitch deck.", likes: 84, comments: 12 },
  { id: "cp2", author: "Tunde Bakare", avatar: av("tunde"), time: "3h", text: "Anyone going to the RALD Dev Conference in December? Looking for a roommate.", likes: 22, comments: 8 },
  { id: "cp3", author: "Daniel O.", avatar: av("danielo"), time: "Yesterday", text: "We just shipped Loop Business API v2. Webhooks, presence, and per-thread metadata.", likes: 156, comments: 31 },
];

export type CallParticipant = {
  id: string;
  name: string;
  avatar: string;
  speaking?: boolean;
  muted?: boolean;
  video?: boolean;
  host?: boolean;
};

export const activeCallParticipants: CallParticipant[] = [
  { id: "u1", name: "Jane Smith", avatar: av("jane"), speaking: true, video: true, host: true },
  { id: "u2", name: "Alex K.", avatar: av("alex"), video: true },
  { id: "u3", name: "Sarah Lee", avatar: av("sarah"), muted: true },
  { id: "u4", name: "Michael J.", avatar: av("michael") },
  { id: "u5", name: "Kwame A.", avatar: av("kwame"), muted: true },
  { id: "u6", name: "You", avatar: av("johndoe"), video: true },
];
