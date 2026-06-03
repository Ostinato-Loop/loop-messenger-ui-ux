import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Search, Users, AtSign } from "lucide-react";
import { MobileShell } from "@/components/loop/MobileShell";
import { LoopAvatar } from "@/components/loop/Avatar";
import { VerifiedBadge } from "@/components/loop/VerifiedBadge";
import { chats, suggestedPeople } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compose")({
  head: () => ({ meta: [{ title: "New message — Loop Messenger" }] }),
  component: ComposePage,
});

type Recipient = { id: string; name: string; avatar: string; subtitle?: string; verified?: boolean };

const recipients: Recipient[] = [
  ...chats
    .filter((c) => !c.group)
    .map((c) => ({ id: c.id, name: c.name, avatar: c.avatar, subtitle: c.online ? "online" : "last seen recently", verified: c.verified })),
  ...suggestedPeople.map((p) => ({ id: p.id, name: p.name, avatar: p.avatar, subtitle: p.bio, verified: p.verified })),
];

function ComposePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Recipient[]>([]);

  const groupMode = selected.length > 1;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const dedup = new Map<string, Recipient>();
    recipients.forEach((r) => dedup.set(r.id, r));
    let arr = Array.from(dedup.values());
    if (q) arr = arr.filter((r) => r.name.toLowerCase().includes(q));
    return arr;
  }, [query]);

  const toggle = (r: Recipient) =>
    setSelected((s) => (s.find((x) => x.id === r.id) ? s.filter((x) => x.id !== r.id) : [...s, r]));

  const start = () => {
    if (selected.length === 0) return;
    const target = selected[0].id;
    navigate({ to: "/chat/$chatId", params: { chatId: target } });
  };

  return (
    <MobileShell hideNav>
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-border/60 bg-background/90 px-2 py-2 backdrop-blur-xl">
        <Link to="/" className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{groupMode ? "New group" : "New message"}</p>
          <p className="text-[11px] text-muted-foreground">{selected.length} selected</p>
        </div>
        <button
          disabled={selected.length === 0}
          onClick={start}
          className="rounded-full bg-gradient-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow disabled:opacity-40 disabled:shadow-none"
        >
          {groupMode ? "Create" : "Start"}
        </button>
      </header>

      <div className="px-4 pt-3">
        <div className="flex items-center gap-2 rounded-2xl bg-surface px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search RALD people, @handles, RALD IDs"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <AtSign className="h-4 w-4 text-muted-foreground" />
        </div>

        {selected.length > 0 && (
          <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {selected.map((r) => (
              <button
                key={r.id}
                onClick={() => toggle(r)}
                className="flex shrink-0 items-center gap-2 rounded-full bg-primary/15 py-1 pl-1 pr-3 text-xs font-medium text-primary"
              >
                <LoopAvatar src={r.avatar} alt={r.name} size={24} />
                {r.name} ✕
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-2">
          <ActionRow icon={<Users className="h-5 w-5" />} title="New community" subtitle="Start a public or private space" />
        </div>

        <h2 className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Suggested
        </h2>
      </div>

      <ul className="divide-y divide-border/40">
        {list.map((r) => {
          const isSel = !!selected.find((s) => s.id === r.id);
          return (
            <li key={r.id}>
              <button
                onClick={() => toggle(r)}
                className={cn("flex w-full items-center gap-3 px-4 py-3 text-left active:bg-surface/60")}
              >
                <LoopAvatar src={r.avatar} alt={r.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold">{r.name}</p>
                    {r.verified && <VerifiedBadge />}
                  </div>
                  {r.subtitle && <p className="truncate text-xs text-muted-foreground">{r.subtitle}</p>}
                </div>
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-bold",
                    isSel
                      ? "border-transparent bg-gradient-primary text-primary-foreground shadow-glow"
                      : "border-border text-transparent"
                  )}
                >
                  ✓
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </MobileShell>
  );
}

function ActionRow({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <button className="flex items-center gap-3 rounded-2xl bg-surface p-3 text-left">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">{icon}</span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
    </button>
  );
}
