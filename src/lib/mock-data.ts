// Loop Messenger UI — Reference Mock Data
// ============================================================
// ⚠️  WARNING: THIS FILE MUST NOT BE IMPORTED IN ANY PAGE OR
// COMPONENT THAT IS VISIBLE TO PRODUCTION USERS.
//
// This file exists as a reference for API data shapes and
// UI design prototypes only. All production pages MUST use real
// data from messenger.rald.cloud via lib/api.ts.
//
// Audit status (Sprint 04 Stabilise & Sanitise):
//   index.tsx (chats):   FIXED — uses real API, honest empty state
//   chat.$chatId.tsx:    FIXED — uses real API, honest empty state
//   discover.tsx:        FIXED — honest empty states, no mock data
//   calls.tsx:           FIXED — honest empty states, no mock data
//   communities.tsx:     FIXED — honest empty states, no mock data
//   profile.tsx:         FIXED — real auth context, no hardcoded stats
//
// If you find a new active import of this file in a production page,
// that is a bug. Remove it and replace with real API data or an
// honest empty state.
// ============================================================
// LILCKY STUDIO LIMITED

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

export type CallEntry = {
  id: string;
  name: string;
  avatar: string;
  type: "voice" | "video";
  direction: "incoming" | "outgoing" | "missed";
  time: string;
  group?: boolean;
};

export type DiscoverPerson = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  verified?: boolean;
};

export type ChatMessage = {
  id: string;
  text?: string;
  file?: { name: string; size: string };
  from: "me" | "them";
  time: string;
  read?: boolean;
  reaction?: string;
  status?: "sending" | "sent" | "delivered" | "read" | "failed";
};

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

export type CallParticipant = {
  id: string;
  name: string;
  avatar: string;
  speaking?: boolean;
  muted?: boolean;
  video?: boolean;
  host?: boolean;
};
