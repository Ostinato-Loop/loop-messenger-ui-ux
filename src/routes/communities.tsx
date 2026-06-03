import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { MobileShell } from "@/components/loop/MobileShell";
import { ScreenHeader } from "@/components/loop/ScreenHeader";
import { LoopAvatar } from "@/components/loop/Avatar";
import { VerifiedBadge } from "@/components/loop/VerifiedBadge";
import { communities } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { RouteError } from "@/components/loop/RouteError";

export const Route = createFileRoute("/communities")({
  head: () => ({ meta: [{ title: "Communities — Loop Messenger" }] }),
  errorComponent: RouteError,
  component: CommunitiesPage,
});

const cats = ["All", "University", "Business", "Creator", "City", "Interest"];

function activityDot(level: "high" | "medium" | "low") {
  return level === "high" ? "bg-[var(--success)]" : level === "medium" ? "bg-primary" : "bg-muted-foreground";
}

function CommunitiesPage() {
  const [cat, setCat] = useState("All");
  const list = communities.filter((c) => cat === "All" || c.category === cat);
  const yours = communities.filter((c) => c.joined);

  return (
    <MobileShell>
      <ScreenHeader
        title="Communities"
        subtitle="Connect with people, brands, and ideas"
        right={
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-surface hover:text-foreground">
            <Search className="h-5 w-5" />
          </button>
        }
      />

      <div className="px-4 pt-3">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors",
                cat === c
                  ? "bg-gradient-primary text-primary-foreground shadow-glow"
                  : "bg-surface text-muted-foreground hover:text-foreground"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {yours.length > 0 && (
          <section className="mb-5">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your communities</h2>
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {yours.map((c) => (
                <div key={c.id} className="flex w-28 shrink-0 flex-col items-center gap-2 rounded-2xl bg-surface p-3">
                  <LoopAvatar src={c.avatar} alt={c.name} size={56} ring />
                  <p className="line-clamp-2 text-center text-xs font-medium leading-tight">{c.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Discover</h2>
            <span className="flex items-center gap-1 text-[11px] text-primary">
              <Sparkles className="h-3 w-3" /> For you
            </span>
          </div>

          <ul className="space-y-3 pb-8">
            {list.map((c) => (
              <li
                key={c.id}
                className="flex items-start gap-3 rounded-2xl border border-border/60 bg-surface p-3.5 shadow-elevated"
              >
                <Link to="/community/$id" params={{ id: c.id }} className="flex min-w-0 flex-1 items-start gap-3">
                  <LoopAvatar src={c.avatar} alt={c.name} size={52} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-semibold">{c.name}</p>
                      {c.verified && <VerifiedBadge />}
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
                    <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="rounded-full bg-background px-2 py-0.5">{c.category}</span>
                      <span>{c.members.toLocaleString()} members</span>
                      <span className="flex items-center gap-1">
                        <span className={cn("h-1.5 w-1.5 rounded-full", activityDot(c.activity))} />
                        {c.activity}
                      </span>
                    </div>
                  </div>
                </Link>
                <button
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                    c.joined
                      ? "bg-surface-elevated text-muted-foreground"
                      : "bg-gradient-primary text-primary-foreground shadow-glow"
                  )}
                >
                  {c.joined ? "Joined" : "Join"}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <button
        aria-label="New community"
        className="fixed bottom-24 right-[max(1rem,calc(50%-240px+1rem))] z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow active:scale-95"
      >
        <Plus className="h-5 w-5" />
      </button>
    </MobileShell>
  );
}
