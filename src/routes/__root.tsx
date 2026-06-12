import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useNavigate,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider, useAuth } from "../lib/auth";
import { LoopLogo } from "../components/loop/LoopLogo";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="mx-auto w-full max-w-sm text-center">
        <div className="mx-auto mb-6 flex justify-center">
          <LoopLogo />
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Error 404</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">This loop doesn't exist</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for has been moved, archived, or never existed in the Loop.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            Back to Chats
          </Link>
          <Link
            to="/discover"
            className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Explore Discover
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Loop Messenger — Your RALD world lives here" },
      { name: "description", content: "Loop Messenger — the communication hub of the RALD ecosystem. One identity, every conversation." },
      { name: "author", content: "LILCKY STUDIO LIMITED" },
      { name: "theme-color", content: "#FF7A00" },
      { property: "og:title", content: "Loop Messenger" },
      { property: "og:description", content: "One identity. Every conversation. Built for Africa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@raldcloud" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/** Inner guard — runs inside AuthProvider so useAuth() is available */
function AppGuard() {
  const { ready, user } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();
  const pathname = router.latestLocation?.pathname ?? "/";

  useEffect(() => {
    if (!ready) return;
    const onAuthPage = pathname === "/auth";
    if (!user && !onAuthPage) {
      navigate({ to: "/auth" });
    } else if (user && onAuthPage) {
      navigate({ to: "/" });
    }
  }, [ready, user, pathname, navigate]);

  return <Outlet />;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppGuard />
      </AuthProvider>
    </QueryClientProvider>
  );
}
