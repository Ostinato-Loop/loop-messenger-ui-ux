import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Users, Share2, MessageCircle } from "lucide-react";
import { MobileShell } from "@/components/loop/MobileShell";
import { RouteError } from "@/components/loop/RouteError";

export const Route = createFileRoute("/community/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Community ${params.id} — Loop Messenger` }],
  }),
  errorComponent: RouteError,
  component: CommunityPage,
});

function CommunityPage() {
  const { id } = Route.useParams();

  return (
    <MobileShell hideNav>
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-border/60 bg-background/90 px-3 py-2 backdrop-blur-xl">
        <Link
          to="/communities"
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-surface"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="flex-1 truncate text-sm font-semibold text-muted-foreground">Community</p>
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-surface">
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      {/* Coming soon */}
      <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-dashed border-border bg-surface">
          <Users className="h-9 w-9 text-muted-foreground/40" />
        </div>
        <h1 className="mt-5 text-lg font-semibold">Communities are on the way</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Community pages are launching soon across the RALD ecosystem. Check back shortly.
        </p>
        {id && (
          <p className="mt-3 text-[11px] text-muted-foreground/50">Requested ID: {id}</p>
        )}

        <div className="mt-8 flex gap-3">
          <Link
            to="/communities"
            className="flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            <Users className="h-4 w-4" /> Browse communities
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-full bg-surface px-5 py-2.5 text-sm font-semibold text-foreground"
          >
            <MessageCircle className="h-4 w-4" /> Chats
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}
