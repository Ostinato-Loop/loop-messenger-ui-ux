import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Phone, Video, MoreVertical, Plus, Smile, Mic, Send, FileText, Check, CheckCheck, Loader2, AlertCircle, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MobileShell } from "@/components/loop/MobileShell";
import { LoopAvatar } from "@/components/loop/Avatar";
import { RouteError } from "@/components/loop/RouteError";
import { chats, sampleConversation, type ChatMessage } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat/$chatId")({
  errorComponent: RouteError,
  component: ChatThread,
});

function ChatThread() {
  const { chatId } = Route.useParams();
  const chat = chats.find((c) => c.id === chatId) ?? chats[0];
  const [messages, setMessages] = useState<ChatMessage[]>(sampleConversation);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  const deliver = (id: string) => {
    // 18% simulated network failure for realism
    const fail = Math.random() < 0.18;
    setTimeout(() => {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === id ? { ...msg, status: fail ? "failed" : "sent" } : msg
        )
      );
      if (!fail) {
        setTimeout(() => {
          setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, read: true } : msg)));
        }, 900);
      }
    }, 700);
  };

  const send = () => {
    const value = text.trim();
    if (!value) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const id = `local-${now.getTime()}`;
    setMessages((m) => [
      ...m,
      { id, from: "me", text: value, time, read: false, status: "sending" },
    ]);
    setText("");
    deliver(id);
  };

  const retry = (id: string) => {
    setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, status: "sending" } : msg)));
    deliver(id);
  };

  const hasText = text.trim().length > 0;

  return (
    <MobileShell hideNav>
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border/60 bg-background/90 px-2 py-2 backdrop-blur-xl">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <LoopAvatar src={chat.avatar} alt={chat.name} size={36} online={chat.online} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{chat.name}</p>
          <p className="text-[11px] text-muted-foreground">{chat.online ? "online" : "last seen recently"}</p>
        </div>
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-surface hover:text-foreground">
          <Phone className="h-5 w-5" />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-surface hover:text-foreground">
          <Video className="h-5 w-5" />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-surface hover:text-foreground">
          <MoreVertical className="h-5 w-5" />
        </button>
      </header>

      <div className="flex flex-col gap-1.5 px-3 py-4">
        <div className="mx-auto mb-2 rounded-full bg-surface px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
          Today
        </div>

        {messages.map((m) => {
          const mine = m.from === "me";
          return (
            <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "relative max-w-[78%] rounded-2xl px-3 py-2 text-sm shadow-sm",
                  mine
                    ? "bg-gradient-primary text-primary-foreground rounded-br-md"
                    : "bg-surface text-foreground rounded-bl-md"
                )}
              >
                {m.file ? (
                  <div className="flex items-center gap-3 py-1 pr-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/30">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{m.file.name}</p>
                      <p className="text-[11px] opacity-70">{m.file.size}</p>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap leading-snug">{m.text}</p>
                )}
                <div className={cn("mt-0.5 flex items-center justify-end gap-1 text-[10px]", mine ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  <span>{m.time}</span>
                  {mine && (m.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
                </div>
                {m.reaction && (
                  <span className="absolute -bottom-2 right-2 rounded-full bg-surface-elevated px-1.5 py-0.5 text-xs shadow-elevated">
                    {m.reaction}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 z-30 border-t border-border/60 bg-background/95 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-end gap-2"
        >
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-2xl bg-surface px-3 py-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button type="button" className="text-muted-foreground hover:text-foreground">
              <Smile className="h-5 w-5" />
            </button>
          </div>
          <button
            type="submit"
            aria-label={hasText ? "Send message" : "Record voice message"}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-primary-foreground shadow-glow transition-transform",
              hasText ? "bg-gradient-primary scale-100" : "bg-gradient-primary/80"
            )}
          >
            {hasText ? <Send className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
        </form>
      </div>
    </MobileShell>
  );
}
