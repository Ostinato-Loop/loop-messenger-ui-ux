import { Link, useRouter } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { MobileShell } from "./MobileShell";

export function RouteError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <MobileShell hideNav>
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-lg font-semibold">Something broke in the loop</h1>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          {error?.message || "We couldn't load this screen. Check your connection and try again."}
        </p>
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            Try again
          </button>
          <Link
            to="/"
            className="rounded-full bg-surface px-5 py-2.5 text-sm font-semibold text-foreground"
          >
            Go to Chats
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}
