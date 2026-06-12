import { createFileRoute } from "@tanstack/react-router";
import { Video, Radio, Phone, PhoneOff } from "lucide-react";
import { MobileShell } from "@/components/loop/MobileShell";
import { ScreenHeader } from "@/components/loop/ScreenHeader";
import { RouteError } from "@/components/loop/RouteError";

export const Route = createFileRoute("/calls")({
  head: () => ({ meta: [{ title: "Calls — Loop Messenger" }] }),
  errorComponent: RouteError,
  component: CallsPage,
});

function CallsPage() {
  return (
    <MobileShell>
      <ScreenHeader
        title="Calls"
        subtitle="Voice, video, audio rooms"
        right={
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-surface hover:text-foreground">
            <Video className="h-5 w-5" />
          </button>
        }
      />

      <div className="px-4 pt-4 pb-8 space-y-6">
        {/* Live audio rooms */}
        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Live audio rooms
          </h2>
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border/60 bg-surface/50 px-4 py-6 text-center">
            <Radio className="h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm font-medium text-muted-foreground">No live rooms right now</p>
            <p className="text-xs text-muted-foreground/60">
              Audio rooms will appear here when someone in your network goes live.
            </p>
          </div>
        </section>

        {/* Recent calls */}
        <section>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Recent
          </h2>
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border/60 bg-surface/50 px-4 py-6 text-center">
            <PhoneOff className="h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm font-medium text-muted-foreground">No recent calls</p>
            <p className="text-xs text-muted-foreground/60">
              Your call history will appear here.
            </p>
          </div>
        </section>

        <div className="pt-2 flex justify-center gap-4">
          <button className="flex flex-col items-center gap-1.5 rounded-2xl bg-surface px-6 py-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Phone className="h-6 w-6" />
            </span>
            <span className="text-xs font-medium">Voice call</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 rounded-2xl bg-surface px-6 py-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Video className="h-6 w-6" />
            </span>
            <span className="text-xs font-medium">Video call</span>
          </button>
        </div>
      </div>
    </MobileShell>
  );
}
