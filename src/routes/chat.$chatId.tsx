import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft, Phone, Video, MoreVertical, Plus, Smile, Mic, Send,
  FileText, Check, CheckCheck, Loader2, AlertCircle, RotateCcw,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MobileShell } from "@/components/loop/MobileShell";
import { LoopAvatar } from "@/components/loop/Avatar";
import { RouteError } from "@/components/loop/RouteError";
import { useAuth } from "@/lib/auth";
import { api, type ApiMessage } from "@/lib/api";
import { sampleConversation, type ChatMessage } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat/$chatId")({
  errorComponent: RouteError,
  component: ChatThread,
});

/* ── Adapters ─────────────────────────────────────────────────────── */

function apiToLocal(msg: ApiMessage, myId: string): ChatMessage {
  const d = new Date(msg.createdAt);
  return {
    id: msg.id,
    text: msg.text ?? undefined,
    file: msg.fileName ? { name: msg.fileName, size: `${((msg.fileSize ?? 0) / 1024).toFixed(1)} KB` } : undefined,
    from: msg.senderId === myId ? "me" : "them",
    time: `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`,
    status: "read",
    read: true,
  };
}

/* ── Status icon ──────────────────────────────────────────────────── */

function StatusIcon({ status }: { status?: ChatMessage["status"] }) {
  if (status === "sending")   return <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />;
  if (status === "failed")    return <AlertCircle className="h-3 w-3 text-destructive" />;
  if (status === "sent")      return <Check className="h-3 w-3 text-muted-foreground" />;
  if (status === "delivered") return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
  if (status === "read")      return <CheckCheck className="h-3 w-3 text-primary" />;
  return null;
}

/* ── Component ────────────────────────────────────────────────────── */

function ChatThread() {
  const { chatId } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  /* Fetch conversation header */
  const { data: conv } = useQuery({
    queryKey: ["conversation", chatId],
    queryFn: () => api.conversations.get(chatId),
    retry: 1,
    staleTime: 60_000,
  });

  /* Fetch messages */
  const { data: msgsData, isLoading } = useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => api.messages.list(chatId),
    retry: 1,
    staleTime: 10_000,
    refetchInterval: 5_000, // Poll for new messages every 5s
  });

  const apiMessages: ChatMessage[] = (msgsData?.messages ?? []).map((m) =>
    apiToLocal(m, user?.id ?? "")
  );

  /* Merge real messages with local optimistic ones */
  const sentIds = new Set(apiMessages.map((m) => m.id));
  const pendingLocal = localMessages.filter(
    (m) => !sentIds.has(m.id) && m.status !== "failed"
  );
  const messages = [...apiMessages, ...pendingLocal];
  const useMock = !isLoading && apiMessages.length === 0 && localMessages.length === 0;
  const displayMessages = useMock ? sampleConversation : messages;

  /* Send mutation */
  const send = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) =>
      api.messages.send(chatId, value),
    onSuccess: (newMsg, { id }) => {
      setLocalMessages((prev) => prev.filter((m) => m.id !== id));
      qc.invalidateQueries({ queryKey: ["messages", chatId] });
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: (_err, { id }) => {
      setLocalMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "failed" } : m))
      );
    },
  });

  const handleSend = useCallback(() => {
    const value = text.trim();
    if (!value) return;
    const now = new Date();
    const id = `opt-${now.getTime()}`;
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setLocalMessages((prev) => [...prev, { id, from: "me", text: value, time, status: "sending" }]);
    setText("");
    send.mutate({ id, value });
  }, [text, send]);

  const retry = useCallback((id: string, value: string) => {
    setLocalMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "sending" } : m))
    );
    send.mutate({ id, value });
  }, [send]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [displayMessages.length]);

  const convName = conv?.name ?? chatId;
  const convAvatar = conv?.avatar ?? `https://i.pravatar.cc/150?u=${chatId}`;
  const convOnline = conv?.online ?? false;
  const hasText = text.trim().length > 0;

  return (
    <MobileShell hideNav>
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border/60 bg-background/90 px-2 py-2 backdrop-blur-xl">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <LoopAvatar src={convAvatar} alt={convName} size={36} online={convOnline} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{convName}</p>
          <p className="text-[11px] text-muted-foreground">{convOnline ? "online" : "last seen recently"}</p>
        </div>
        <div className="flex">
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-surface hover:text-foreground">
            <Phone className="h-5 w-5" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-surface hover:text-foreground">
            <Video className="h-5 w-5" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-surface hover:text-foreground">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-1">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
        {displayMessages.map((msg) => (
          <div key={msg.id} className={cn("flex gap-2", msg.from === "me" ? "flex-row-reverse" : "flex-row")}>
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-3.5 py-2.5",
                msg.from === "me"
                  ? "rounded-tr-sm bg-gradient-primary text-primary-foreground"
                  : "rounded-tl-sm bg-surface text-foreground",
              )}
            >
              {msg.file ? (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{msg.file.name}</p>
                    <p className="text-[11px] opacity-70">{msg.file.size}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{msg.text}</p>
              )}
              {msg.reaction && <span className="mt-1 block text-right text-base">{msg.reaction}</span>}
              <div className={cn("mt-0.5 flex items-center gap-1 text-[10px]", msg.from === "me" ? "justify-end text-primary-foreground/70" : "text-muted-foreground")}>
                <span>{msg.time}</span>
                {msg.from === "me" && (
                  msg.status === "failed" ? (
                    <button onClick={() => retry(msg.id, msg.text ?? "")} className="flex items-center gap-1">
                      <StatusIcon status={msg.status} />
                      <RotateCcw className="h-3 w-3" />
                    </button>
                  ) : (
                    <StatusIcon status={msg.status ?? (msg.read ? "read" : "sent")} />
                  )
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 border-t border-border/60 bg-background/90 px-3 py-3 backdrop-blur-xl">
        <div className="flex items-end gap-2">
          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-surface hover:text-foreground">
            <Plus className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-end rounded-2xl border border-border/60 bg-surface px-3 py-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
              placeholder="Message"
              rows={1}
              className="max-h-32 w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground">
              <Smile className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={hasText ? handleSend : undefined}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all",
              hasText
                ? "bg-gradient-primary text-primary-foreground shadow-glow active:scale-95"
                : "text-muted-foreground hover:bg-surface",
            )}
          >
            {hasText ? <Send className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </MobileShell>
  );
}
