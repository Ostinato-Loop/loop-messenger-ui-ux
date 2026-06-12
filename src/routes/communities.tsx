import { createFileRoute } from "@tanstack/react-router";
import { Search, Plus, Users } from "lucide-react";
import { useState } from "react";
import { MobileShell } from "@/components/loop/MobileShell";
import { ScreenHeader } from "@/components/loop/ScreenHeader";
import { cn } from "@/lib/utils";
import { RouteError } from "@/components/loop/RouteError";

export const Route = createFileRoute("/communities")({
  head: () => ({ meta: [{ title: "Communities — Loop Messenger" }] }),
  errorComponent: RouteError,
  component: CommunitiesPage,
});

const cats = ["All", "University", "Business", "Creator", "City", "Interest"];

function CommunitiesPage() {
  const [cat, setCat] = useState("All");

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

      <div className="px-4 pt-3 pb-24">
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

        <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/60 bg-surface/50 px-4 py-10 text-center">
          <Users className="h-10 w-10 text-muted-foreground/30" />
          <p className="text-sm font-semibold text-muted-foreground">Communities are on the way</p>
          <p className="text-xs text-muted-foreground/60 max-w-xs">
            Discover and join communities across the RALD ecosystem — universities, businesses, creators, and more.
            Be the first to start one.
          </p>
          <button className="mt-2 flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-glow">
            <Plus className="h-4 w-4" /> Create a community
          </button>
        </div>
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
