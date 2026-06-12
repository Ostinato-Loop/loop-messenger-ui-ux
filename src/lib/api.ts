// Loop Messenger — API Client
// All requests go to messenger.rald.cloud; credentials:include sends the
// rald_session HttpOnly cookie automatically on same-site fetch calls.
// LILCKY STUDIO LIMITED

const BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "") ?? "https://messenger.rald.cloud";

/* ── Types ───────────────────────────────────────────────────────── */

export type ApiConversation = {
  id: string;
  name: string;
  type: "direct" | "group" | string;
  avatar: string | null;
  lastMessage: { text: string | null; createdAt: string } | null;
  unreadCount: number;
  members: ApiMember[];
  online?: boolean;
  pinned?: boolean;
};

export type ApiMember = {
  userId: string;
  role: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  isVerified?: boolean;
};

export type ApiMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  createdAt: string;
  updatedAt: string;
  status?: "sending" | "sent" | "delivered" | "read";
  reactions?: Record<string, string[]>;
};

export type ApiConversationsResponse = {
  conversations: ApiConversation[];
  total?: number;
};

export type ApiMessagesResponse = {
  messages: ApiMessage[];
  total?: number;
  cursor?: string | null;
};

/* ── Core fetch ──────────────────────────────────────────────────── */

async function apiFetch<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    credentials: "include",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? `API error ${res.status} on ${method} ${path}`);
  }
  return res.json() as Promise<T>;
}

/* ── API surface ─────────────────────────────────────────────────── */

export const api = {
  conversations: {
    list: (workspaceId = "consumer") =>
      apiFetch<ApiConversationsResponse>("GET", `/api/conversations?workspace_id=${workspaceId}`),

    get: (id: string) =>
      apiFetch<ApiConversation>("GET", `/api/conversations/${id}`),

    create: (payload: { name?: string; type?: string; memberIds?: string[] }) =>
      apiFetch<ApiConversation>("POST", "/api/conversations", payload),
  },

  messages: {
    list: (conversationId: string, cursor?: string) =>
      apiFetch<ApiMessagesResponse>(
        "GET",
        `/api/conversations/${conversationId}/messages${cursor ? `?cursor=${cursor}` : ""}`,
      ),

    send: (conversationId: string, text: string) =>
      apiFetch<ApiMessage>("POST", `/api/conversations/${conversationId}/messages`, { text }),

    sendFile: (conversationId: string, file: File) => {
      const form = new FormData();
      form.append("file", file);
      return fetch(`${BASE}/api/conversations/${conversationId}/messages/attachments`, {
        method: "POST",
        credentials: "include",
        body: form,
      }).then((r) => r.json() as Promise<ApiMessage>);
    },
  },

  users: {
    search: (query: string) =>
      apiFetch<{ users: ApiMember[] }>("GET", `/api/users/search?q=${encodeURIComponent(query)}`),
  },
};
