import { createFileRoute } from "@tanstack/react-router";
import { Search, TrendingUp, MapPin, Calendar, Sparkles } from "lucide-react";
import { MobileShell } from "@/components/loop/MobileShell";
import { ScreenHeader } from "@/components/loop/ScreenHeader";
import { LoopAvatar } from "@/components/loop/Avatar";
import { VerifiedBadge } from "@/components/loop/VerifiedBadge";
import { suggestedPeople, trending, events, communities } from "@/lib/mock-data";

export const Route = createFileRoute("/discover")({
  head: () => ({ meta: [{ title: "Discover — Loop Messenger" }] }),
  component: DiscoverPage,
});

function DiscoverPage() {
  return (
    <MobileShell>
      <ScreenHeader title="Discover" subtitle="People, communities & opportunities" />

      <div className="px-4 pt-3 pb-8">
        <div className="flex items-center gap-2 rounded-2xl bg-surface px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search across RALD"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <section className="mt-6">
          <SectionTitle icon={<Sparkles className="h-3.5 w-3.5" />}>Suggested for you</SectionTitle>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {suggestedPeople.map((p) => (
              <div
                key={p.id}
                className="flex w-40 shrink-0 flex-col items-center gap-2 rounded-2xl border border-border/60 bg-surface p-4 text-center"
              >
                <LoopAvatar src={p.avatar} alt={p.name} size={64} />
                <div className="flex items-center gap-1">
                  <p className="text-sm font-semibold">{p.name}</p>
                  {p.verified && <VerifiedBadge />}
                </div>
                <p className="line-clamp-2 text-[11px] text-muted-foreground">{p.bio}</p>
                <button className="mt-1 w-full rounded-full bg-gradient-primary py-1.5 text-xs font-semibold text-primary-foreground shadow-glow">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <SectionTitle icon={<TrendingUp className="h-3.5 w-3.5" />}>Trending across RALD</SectionTitle>
          <ul className="space-y-2">
            {trending.map((t) => (
              <li key={t.id} className="rounded-2xl bg-surface p-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{t.topic}</p>
                <p className="mt-0.5 text-sm font-semibold leading-snug">{t.title}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{t.posts} posts</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <SectionTitle icon={<MapPin className="h-3.5 w-3.5" />}>Nearby communities</SectionTitle>
          <ul className="space-y-2">
            {communities.slice(0, 3).map((c) => (
              <li key={c.id} className="flex items-center gap-3 rounded-2xl bg-surface p-3">
                <LoopAvatar src={c.avatar} alt={c.name} size={44} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.members.toLocaleString()} members · {c.category}</p>
                </div>
                <button className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                  View
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <SectionTitle icon={<Calendar className="h-3.5 w-3.5" />}>Events near you</SectionTitle>
          <ul className="space-y-2">
            {events.map((e) => (
              <li
                key={e.id}
                className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-surface to-surface-elevated p-4"
              >
                <p className="text-sm font-semibold">{e.title}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{e.where} · {e.attendees} attending</p>
                <button className="mt-3 rounded-full bg-gradient-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-glow">
                  RSVP
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </MobileShell>
  );
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {icon}
      {children}
    </h2>
  );
}
