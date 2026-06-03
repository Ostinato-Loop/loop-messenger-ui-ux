import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ShieldCheck, KeyRound, Loader2, Globe } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { LoopLogo } from "@/components/loop/LoopLogo";
import { RouteError } from "@/components/loop/RouteError";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in with RALD — Loop Messenger" }] }),
  errorComponent: RouteError,
  component: AuthPage,
});

function AuthPage() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"intro" | "token">("intro");
  const [error, setError] = useState<string | null>(null);

  if (user) {
    navigate({ to: "/" });
  }

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!token.trim()) {
      setError("Enter your RALD handle or paste an identity token.");
      return;
    }
    setLoading(true);
    try {
      await signIn(token);
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-primary">
              Neon Orange Edition
            </p>
            <h1 className="mt-3 text-[34px] font-semibold leading-[1.05] tracking-tight">
              Your entire <span className="text-gradient-primary">RALD world</span> lives here.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Sign in once with RALD Identity. Loop Messenger, PayRALD, GitRald and the rest of the
              ecosystem unlock instantly — one account, one inbox, one graph.
            </p>

            <ul className="mt-8 space-y-3">
              <Feature icon={<ShieldCheck className="h-4 w-4" />} title="End-to-end encrypted" copy="Powered by RALD Identity tokens — never stored, never sold." />
              <Feature icon={<KeyRound className="h-4 w-4" />} title="No second password" copy="Auth lives on profiles.rald.cloud. Messenger just consumes the token." />
              <Feature icon={<Globe className="h-4 w-4" />} title="Built for Africa, ready for the world" copy="Cloudflare edge by default. Sub-second navigation on any device." />
            </ul>

            <div className="mt-auto pb-10 pt-10">
              <button
                onClick={() => setStep("token")}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow active:scale-[0.99]"
              >
                Continue with RALD <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                By continuing you agree to RALD's <span className="text-foreground">Terms</span> &{" "}
                <span className="text-foreground">Privacy Policy</span>.
              </p>
            </div>
          </>
        ) : (
          <form onSubmit={handleContinue} className="flex flex-1 flex-col">
            <button
              type="button"
              onClick={() => setStep("intro")}
              className="self-start text-xs text-muted-foreground hover:text-foreground"
            >
              ← Back
            </button>
            <h1 className="mt-6 text-2xl font-semibold tracking-tight">RALD Identity</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Paste your RALD token, or enter your handle to receive a one-tap approval on rald.cloud.
            </p>

            <label className="mt-8 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Handle or identity token
            </label>
            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-3 focus-within:border-primary">
              <span className="text-sm text-muted-foreground">@</span>
              <input
                autoFocus
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="johndoe"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-70"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              {loading ? "Verifying with RALD…" : "Sign in"}
            </button>

            <div className="mt-auto pb-10 pt-10 text-center">
              <p className="text-[11px] text-muted-foreground">
                Don't have a RALD account?{" "}
                <a href="https://profiles.rald.cloud" className="text-primary">Create one</a>
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
