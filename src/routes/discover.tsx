import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, TrendingUp, MapPin, Calendar, Sparkles, Heart, MessageCircle, Repeat2, Pin, Radio } from "lucide-react";
import { MobileShell } from "@/components/loop/MobileShell";
import { ScreenHeader } from "@/components/loop/ScreenHeader";
import { LoopAvatar } from "@/components/loop/Avatar";
import { VerifiedBadge } from "@/components/loop/VerifiedBadge";
import { suggestedPeople, trending, events, communities, feed, audioRooms } from "@/lib/mock-data";
import { RouteError } from "@/components/loop/RouteError";

export const Route = createFileRoute("/discover")({
  head: () => ({ meta: [{ title: "Discover — Loop Messenger" }] }),
  component: DiscoverPage,
});

function DiscoverPage() {
  return (
    <MobileShell>
      <ScreenHeader title="Discover" subtitle="Your RALD world, alive" />

      <div className="px-4 pt-3 pb-8">
        <div className="flex items-center gap-2 rounded-2xl bg-surface px-3 py-2.5">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search people, communities, posts"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Live now strip */}
        <section className="mt-5">
          <SectionTitle icon={<Radio className="h-3.5 w-3.5" />}>Live now</SectionTitle>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {audioRooms.filter((r) => r.live).map((r) => (
              <div key={r.id} className="flex w-56 shrink-0 flex-col gap-2 rounded-2xl bg-gradient-to-br from-primary/20 via-surface to-surface p-3.5">
                <span className="flex w-fit items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  <span className="h-1 w-1 animate-pulse rounded-full bg-primary" /> Live
                </span>
                <p className="text-sm font-semibold leading-snug">{r.title}</p>
                <p className="text-[11px] text-muted-foreground">{r.host} · {r.listeners} listening</p>
              </div>
            ))}
          </div>
        </section>

        {/* Suggested people */}
        <section className="mt-6">
          <SectionTitle icon={<Sparkles className="h-3.5 w-3.5" />}>Suggested for you</SectionTitle>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {suggestedPeople.map((p) => (
              <div
                key={p.id}
                className="flex w-40 shrink-0 flex-col items-center gap-2 rounded-2xl border border-border/60 bg-surface p-4 text-center"
              >
                <LoopAvatar src={p.avatar} alt={p.name} size={56} />
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

        {/* Feed */}
        <section className="mt-6">
          <SectionTitle icon={<TrendingUp className="h-3.5 w-3.5" />}>For you</SectionTitle>
          <ul className="space-y-3">
            {feed.map((p) => (
              <li key={p.id} className="rounded-2xl border border-border/60 bg-surface p-4">
                {p.pinned && (
                  <div className="mb-2 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
                    <Pin className="h-3 w-3" /> Pinned by RALD
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <LoopAvatar src={p.avatar} alt={p.author} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-semibold">{p.author}</p>
                      {p.verified && <VerifiedBadge />}
                      <span className="text-[11px] text-muted-foreground">· {p.time}</span>
                    </div>
                    {p.community && <p className="text-[11px] text-primary">{p.community}</p>}
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{p.text}</p>

                    <div className="mt-3 flex items-center gap-5 text-[12px] text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-primary">
                        <Heart className="h-4 w-4" /> {p.likes.toLocaleString()}
                      </button>
                      <button className="flex items-center gap-1 hover:text-foreground">
                        <MessageCircle className="h-4 w-4" /> {p.comments}
                      </button>
                      <button className="flex items-center gap-1 hover:text-[var(--success)]">
                        <Repeat2 className="h-4 w-4" /> {p.reposts}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Trending */}
        <section className="mt-6">
          <SectionTitle icon={<TrendingUp className="h-3.5 w-3.5" />}>Trending across RALD</SectionTitle>
          <ul className="grid grid-cols-2 gap-2">
            {trending.map((t) => (
              <li key={t.id} className="rounded-2xl bg-surface p-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{t.topic}</p>
                <p className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug">{t.title}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{t.posts} posts</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Nearby */}
        <section className="mt-6">
          <SectionTitle icon={<MapPin className="h-3.5 w-3.5" />}>Nearby communities</SectionTitle>
          <ul className="space-y-2">
            {communities.slice(0, 3).map((c) => (
              <li key={c.id}>
                <Link
                  to="/community/$id"
                  params={{ id: c.id }}
                  className="flex items-center gap-3 rounded-2xl bg-surface p-3"
                >
                  <LoopAvatar src={c.avatar} alt={c.name} size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{c.name}</p>
                    <p className="text-[11px] text-muted-foreground">{c.members.toLocaleString()} members · {c.category}</p>
                  </div>
                  <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">View</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Events */}
        <section className="mt-6">
          <SectionTitle icon={<Calendar className="h-3.5 w-3.5" />}>Events near you</SectionTitle>
          <ul className="space-y-2">
            {events.map((e) => (
              <li key={e.id} className="overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-surface to-surface-elevated p-4">
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
