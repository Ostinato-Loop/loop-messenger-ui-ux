import { createFileRoute, useNavigate } from "@tanstack/react-router";
  import { useEffect, useState } from "react";
  import { ArrowRight, ShieldCheck, KeyRound, Loader2, Globe } from "lucide-react";
  import { z } from "zod";
  import { useAuth } from "@/lib/auth";
  import { LoopLogo } from "@/components/loop/LoopLogo";
  import { RouteError } from "@/components/loop/RouteError";

  const AUTH_ORIGIN  = "https://auth.rald.cloud";
  const CALLBACK_URL = "https://chat.rald.cloud/auth";

  const searchSchema = z.object({
    rald_token: z.string().optional(),
    app_id: z.string().optional(),
  });

  export const Route = createFileRoute("/auth")({
    head: () => ({ meta: [{ title: "Sign in with RALD — Loop Messenger" }] }),
    validateSearch: searchSchema,
    errorComponent: RouteError,
    component: AuthPage,
  });

  function AuthPage() {
    const { signIn, user, ready } = useAuth();
    const navigate = useNavigate();
    const { rald_token: raldToken } = Route.useSearch();

    const [loading, setLoading]       = useState(!!raldToken);
    const [step, setStep]             = useState<"intro" | "token">("intro");
    const [manualToken, setManualToken] = useState("");
    const [error, setError]           = useState<string | null>(null);

    // Auto-sign-in: triggered when auth.rald.cloud redirects back with ?rald_token=
    useEffect(() => {
      if (!raldToken || !ready) return;
      let cancelled = false;
      (async () => {
        setLoading(true);
        setError(null);
        try {
          await signIn(raldToken);
          if (!cancelled) navigate({ to: "/" });
        } catch {
          if (!cancelled) {
            setError("Sign-in failed — your session may have expired. Try again.");
            setLoading(false);
          }
        }
      })();
      return () => { cancelled = true; };
    }, [raldToken, ready]);

    if (user) { navigate({ to: "/" }); return null; }

    // Full-screen spinner while SSO callback is processing
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <LoopLogo />
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Completing sign-in…</p>
          </div>
        </div>
      );
    }

    // URL sent to auth.rald.cloud — after login it will redirect back here with ?rald_token=
    const ssoUrl =
      `${AUTH_ORIGIN}/?redirect_to=${encodeURIComponent(CALLBACK_URL)}&app_id=loop-messenger`;

    const handleManualSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      if (!manualToken.trim()) { setError("Paste your RALD identity token."); return; }
      setLoading(true);
      try {
        await signIn(manualToken.trim());
        navigate({ to: "/" });
      } catch {
        setError("That token couldn't be verified. Try again.");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="relative mx-auto flex min-h-screen w-full max-w-[480px] flex-col overflow-hidden bg-background">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

        <header className="relative flex items-center justify-between px-6 pt-8">
          <LoopLogo withWord />
          <a
            href="https://profiles.rald.cloud"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            <Globe className="h-3.5 w-3.5" /> rald.cloud
          </a>
        </header>

        <main className="relative flex flex-1 flex-col px-6 pt-12">
          {step === "intro" ? (
            <>
              {error && (
                <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs text-destructive">
                  {error}
                </div>
              )}
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
                Neon Orange Edition
              </p>
              <h1 className="mt-3 text-[34px] font-semibold leading-[1.05] tracking-tight">
                Your entire <span className="text-gradient-primary">RALD world</span> lives here.
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Sign in once with RALD Identity. Loop Messenger, PayRALD, GitRald and the rest of
                the ecosystem unlock instantly — one account, one inbox, one graph.
              </p>

              <ul className="mt-8 space-y-3">
                <Feature
                  icon={<ShieldCheck className="h-4 w-4" />}
                  title="End-to-end encrypted"
                  copy="Powered by RALD Identity tokens — never stored, never sold."
                />
                <Feature
                  icon={<KeyRound className="h-4 w-4" />}
                  title="One tap, straight in"
                  copy="Sign in on auth.rald.cloud once and you land directly in Messenger."
                />
                <Feature
                  icon={<Globe className="h-4 w-4" />}
                  title="Built for Africa, ready for the world"
                  copy="Cloudflare edge by default. Sub-second navigation on any device."
                />
              </ul>

              <div className="mt-auto pb-10 pt-10 flex flex-col gap-3">
                {/* Primary: one-tap SSO — navigates to auth.rald.cloud then back */}
                <a
                  href={ssoUrl}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow active:scale-[0.99]"
                >
                  Continue with RALD <ArrowRight className="h-4 w-4" />
                </a>

                {/* Secondary fallback: manual token for advanced users */}
                <button
                  type="button"
                  onClick={() => { setError(null); setStep("token"); }}
                  className="text-center text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Paste a token manually →
                </button>

                <p className="text-center text-[11px] text-muted-foreground">
                  By continuing you agree to RALD's{" "}
                  <span className="text-foreground">Terms</span> &{" "}
                  <span className="text-foreground">Privacy Policy</span>.
                </p>
              </div>
            </>
          ) : (
            <form onSubmit={handleManualSubmit} className="flex flex-1 flex-col">
              <button
                type="button"
                onClick={() => setStep("intro")}
                className="self-start text-xs text-muted-foreground hover:text-foreground"
              >
                ← Back
              </button>
              <h1 className="mt-6 text-2xl font-semibold tracking-tight">Paste RALD token</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Copy your identity token from{" "}
                <a href="https://profiles.rald.cloud" className="text-primary">
                  profiles.rald.cloud
                </a>{" "}
                → Dashboard → Connected Apps.
              </p>

              <label className="mt-8 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Identity token
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-3 focus-within:border-primary">
                <input
                  autoFocus
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="eyJhbGciOi…"
                  className="w-full bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-70"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {loading ? "Verifying…" : "Sign in"}
              </button>

              <div className="mt-auto pb-10 pt-10 text-center">
                <p className="text-[11px] text-muted-foreground">
                  No RALD account?{" "}
                  <a href="https://profiles.rald.cloud" className="text-primary">
                    Create one at profiles.rald.cloud
                  </a>
                </p>
              </div>
            </form>
          )}
        </main>
      </div>
    );
  }

  function Feature({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
    return (
      <li className="flex items-start gap-3 rounded-2xl border border-border/60 bg-surface/60 p-3.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          {icon}
        </span>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{copy}</p>
        </div>
      </li>
    );
  }
  