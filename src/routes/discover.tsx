import { createFileRoute } from "@tanstack/react-router";
import { Search, TrendingUp, MapPin, Calendar, Sparkles, Radio, Compass } from "lucide-react";
import { MobileShell } from "@/components/loop/MobileShell";
import { ScreenHeader } from "@/components/loop/ScreenHeader";
import { RouteError } from "@/components/loop/RouteError";

export const Route = createFileRoute("/discover")({
  head: () => ({ meta: [{ title: "Discover — Loop Messenger" }] }),
  errorComponent: RouteError,
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

        {/* Live now */}
        <section className="mt-5">
          <SectionTitle icon={<Radio className="h-3.5 w-3.5" />}>Live now</SectionTitle>
          <ComingSoonCard
            icon={<Radio className="h-8 w-8 text-muted-foreground/30" />}
            label="No live rooms right now"
            hint="Audio rooms will appear here when someone goes live."
          />
        </section>

        {/* Suggested people */}
        <section className="mt-6">
          <SectionTitle icon={<Sparkles className="h-3.5 w-3.5" />}>Suggested for you</SectionTitle>
          <ComingSoonCard
            icon={<Sparkles className="h-8 w-8 text-muted-foreground/30" />}
            label="People suggestions on the way"
            hint="We'll surface connections from your RALD network here."
          />
        </section>

        {/* Feed */}
        <section className="mt-6">
          <SectionTitle icon={<TrendingUp className="h-3.5 w-3.5" />}>For you</SectionTitle>
          <ComingSoonCard
            icon={<Compass className="h-8 w-8 text-muted-foreground/30" />}
            label="Your personalised feed is coming"
            hint="Posts, announcements, and community highlights will appear here."
          />
        </section>

        {/* Trending */}
        <section className="mt-6">
          <SectionTitle icon={<TrendingUp className="h-3.5 w-3.5" />}>Trending across RALD</SectionTitle>
          <ComingSoonCard
            icon={<TrendingUp className="h-8 w-8 text-muted-foreground/30" />}
            label="Trending topics coming soon"
            hint="See what the RALD ecosystem is talking about."
          />
        </section>

        {/* Nearby communities */}
        <section className="mt-6">
          <SectionTitle icon={<MapPin className="h-3.5 w-3.5" />}>Nearby communities</SectionTitle>
          <ComingSoonCard
            icon={<MapPin className="h-8 w-8 text-muted-foreground/30" />}
            label="Location-aware communities arriving soon"
            hint="Communities near you will show up here once geo-discovery launches."
          />
        </section>

        {/* Events */}
        <section className="mt-6">
          <SectionTitle icon={<Calendar className="h-3.5 w-3.5" />}>Events near you</SectionTitle>
          <ComingSoonCard
            icon={<Calendar className="h-8 w-8 text-muted-foreground/30" />}
            label="Events coming soon"
            hint="RALD events, meetups, and audio rooms will be listed here."
          />
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

function ComingSoonCard({ icon, label, hint }: { icon: React.ReactNode; label: string; hint: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border/60 bg-surface/50 px-4 py-6 text-center">
      {icon}
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-xs text-muted-foreground/60">{hint}</p>
    </div>
  );
}
