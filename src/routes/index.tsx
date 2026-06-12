import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Pencil, Pin, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MobileShell } from "@/components/loop/MobileShell";
import { ScreenHeader } from "@/components/loop/ScreenHeader";
import { LoopAvatar } from "@/components/loop/Avatar";
import { LoopLogo } from "@/components/loop/LoopLogo";
import { VerifiedBadge, BusinessBadge } from "@/components/loop/VerifiedBadge";
import { useAuth } from "@/lib/auth";
import { api, type ApiConversation } from "@/lib/api";
import { cn } from "@/lib/utils";
import { RouteError } from "@/components/loop/RouteError";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Loop Messenger — Chats" },
      { name: "description", content: "Loop Messenger — the communication hub of the RALD ecosystem." },
    ],
  }),
  errorComponent: RouteError,
  component: ChatsPage,
});

const filters = ["All", "Unread", "Groups", "Channels"] as const;

function formatTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return "now";
  if (diff < 3600 * 24)
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  if (diff < 3600 * 48) return "Yesterday";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[d.getDay()];
}

function ChatsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [query, setQuery] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => api.conversations.list(),
    retry: 1,
    staleTime: 30_000,
  });

  const displayChats = (data?.conversations ?? []).map((c: ApiConversation) => ({
    id: c.id,
    name: c.name || (c.type === "direct" ? "Direct Message" : "Group"),
    avatar: c.avatar ?? `https://i.pravatar.cc/150?u=${c.id}`,
    lastMessage: c.lastMessage?.text ?? "",
    time: formatTime(c.lastMessage?.createdAt),
    unread: c.unreadCount > 0 ? c.unreadCount : undefined,
    pinned: c.pinned,
    verified: false,
    business: false,
    online: c.online,
    typing: false,
    group: c.type === "group",
  }));

  const filtered = displayChats.filter((c) => {
    if (filter === "Unread" && !c.unread) return false;
    if (filter === "Groups" && !c.group) return false;
    if (filter === "Channels" && !c.verified) return false;
    if (query && !c.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <MobileShell>
      <ScreenHeader
        title={<LoopLogo withWord />}
        right={
          <button
            aria-label="Search"
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-surface hover:text-foreground"
          >
            <Search className="h-5 w-5" />
          </button>
        }
      />

      <div className="px-4 pt-3">
        <div className="flex items-center gap-2 rounded-2xl bg-surface px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats, people, messages"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="mt-3 -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                filter === f
                  ? "bg-gradient-primary text-primary-foreground shadow-glow"
                  : "bg-surface text-muted-foreground hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center py-16">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : !user ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-8">
          <MessageSquare className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">Sign in to see your chats</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-8">
          <MessageSquare className="mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm font-medium text-muted-foreground">
            {query || filter !== "All" ? "No matching conversations" : "No conversations yet"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            {query || filter !== "All"
              ? "Try a different search or filter."
              : "Start a new chat to connect with people in the RALD ecosystem."}
          </p>
        </div>
      ) : (
        <ul className="mt-1 divide-y divide-border/40">
          {filtered.map((c) => (
            <li key={c.id}>
              <Link
                to="/chat/$chatId"
                params={{ chatId: c.id }}
                className="flex items-center gap-3 px-4 py-3 active:bg-surface/60"
              >
                <LoopAvatar src={c.avatar} alt={c.name} online={c.online} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold">{c.name}</p>
                    {c.verified && <VerifiedBadge />}
                    {c.business && <BusinessBadge />}
                    {c.pinned && <Pin className="ml-auto h-3.5 w-3.5 text-muted-foreground" />}
                  </div>
                  <p
                    className={cn(
                      "mt-0.5 truncate text-xs",
                      c.typing ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {c.typing ? "typing…" : c.lastMessage}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={cn("text-[11px]", c.unread ? "text-primary" : "text-muted-foreground")}>
                    {c.time}
                  </span>
                  {c.unread ? (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-primary px-1.5 text-[10px] font-bold text-primary-foreground shadow-glow">
                      {c.unread}
                    </span>
                  ) : (
                    <span className="h-5" />
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        to="/compose"
        aria-label="New chat"
        className="fixed bottom-24 right-[max(1rem,calc(50%-240px+1rem))] z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow transition-transform active:scale-95"
      >
        <Pencil className="h-5 w-5" />
      </Link>
    </MobileShell>
  );
}
