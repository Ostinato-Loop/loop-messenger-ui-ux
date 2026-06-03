import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Bell, Share2, Lock, Users, MessageCircle, Hash, Check, X, Loader2, ShieldAlert, PartyPopper } from "lucide-react";
import { MobileShell } from "@/components/loop/MobileShell";
import { LoopAvatar } from "@/components/loop/Avatar";
import { VerifiedBadge } from "@/components/loop/VerifiedBadge";
import { RouteError } from "@/components/loop/RouteError";
import { communities, communityPosts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/community/$id")({
  loader: ({ params }) => {
    const c = communities.find((x) => x.id === params.id);
    if (!c) throw notFound();
    return c;
  },
  notFoundComponent: CommunityNotFound,
  errorComponent: RouteError,
  component: CommunityPage,
});

type JoinState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; reason: "banned" | "already" | "network"; message: string }
  | { status: "success" };

function CommunityPage() {
  const c = Route.useLoaderData();
  const navigate = useNavigate();
  const [joined, setJoined] = useState(!!c.joined);
  const [showSheet, setShowSheet] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [join, setJoin] = useState<JoinState>({ status: "idle" });
  const [tab, setTab] = useState<"feed" | "about" | "members">("feed");

  const openSheet = () => {
    setJoin({ status: "idle" });
    setAgreed(false);
    setShowSheet(true);
  };

  const confirmJoin = async () => {
    setJoin({ status: "loading" });
    // Simulated network round-trip with deterministic mock failures
    await new Promise((r) => setTimeout(r, 900));

    if (c.id === "loop-biz") {
      setJoin({
        status: "error",
        reason: "banned",
        message: "You can't join Loop Business Network. Your account was restricted by an admin.",
      });
      return;
    }
    if (joined) {
      setJoin({
        status: "error",
        reason: "already",
        message: "You're already a member of this community.",
      });
      return;
    }
    // Tiny chance of a network blip for realism on a known id
    if (c.id === "nairobi-runners" && Math.random() < 0.35) {
      setJoin({
        status: "error",
        reason: "network",
        message: "Network hiccup. Check your connection and try again.",
      });
      return;
    }

    setJoined(true);
    setJoin({ status: "success" });
  };

  const closeSheet = () => {
    if (join.status === "loading") return;
    setShowSheet(false);
  };

  return (
    <MobileShell hideNav>
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-primary/30 via-surface to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,oklch(0.76_0.19_55_/_0.35),transparent_60%)]" />
        <Link
          to="/communities"
          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/60 text-foreground backdrop-blur">
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      <div className="-mt-10 px-4">
        <div className="flex items-end gap-3">
          <LoopAvatar src={c.avatar} alt={c.name} size={80} ring />
          <div className="min-w-0 flex-1 pb-2">
            <div className="flex items-center gap-1.5">
              <h1 className="truncate text-lg font-semibold">{c.name}</h1>
              {c.verified && <VerifiedBadge />}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {c.category} · {c.members.toLocaleString()} members
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.description}</p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => (joined ? setJoined(false) : openSheet())}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-semibold transition-colors",
              joined
                ? "bg-surface text-foreground"
                : "bg-gradient-primary text-primary-foreground shadow-glow"
            )}
          >
            {joined ? <><Check className="h-4 w-4" /> Joined</> : "Join community"}
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-muted-foreground">
            <Bell className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate({ to: "/chat/$chatId", params: { chatId: c.id } })}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-muted-foreground"
          >
            <MessageCircle className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <Stat label="Posts today" value="48" />
          <Stat label="Online now" value="312" />
          <Stat label="Channels" value="8" />
        </div>

        <div className="mt-5 flex gap-1 rounded-full bg-surface p-1">
          {(["feed", "about", "members"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "flex-1 rounded-full py-1.5 text-xs font-semibold capitalize transition-colors",
                tab === t ? "bg-background text-foreground shadow-elevated" : "text-muted-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-4 pb-12">
          {tab === "feed" && (
            <ul className="space-y-3">
              {communityPosts.map((p) => (
                <li key={p.id} className="rounded-2xl border border-border/60 bg-surface p-4">
                  <div className="flex items-center gap-2">
                    <LoopAvatar src={p.avatar} alt={p.author} size={32} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{p.author}</p>
                      <p className="text-[11px] text-muted-foreground">{p.time}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed">{p.text}</p>
                  <div className="mt-3 flex gap-4 text-[11px] text-muted-foreground">
                    <span>❤️ {p.likes}</span>
                    <span>💬 {p.comments}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {tab === "about" && (
            <div className="space-y-3 text-sm">
              <Row icon={<Hash className="h-4 w-4" />} title="Category" value={c.category} />
              <Row icon={<Users className="h-4 w-4" />} title="Members" value={c.members.toLocaleString()} />
              <Row icon={<Lock className="h-4 w-4" />} title="Privacy" value="Public — anyone with the link can join" />
              <div className="rounded-2xl border border-border/60 bg-surface p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Community rules
                </p>
                <ol className="mt-2 space-y-2 text-sm">
                  <li>1. Be respectful — every member is part of the RALD family.</li>
                  <li>2. No spam, scams, or unverified financial offers.</li>
                  <li>3. Keep conversations on-topic for {c.category.toLowerCase()} work.</li>
                  <li>4. Report bad actors — admins respond within 24h.</li>
                </ol>
              </div>
            </div>
          )}

          {tab === "members" && (
            <ul className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="flex items-center gap-3 rounded-2xl bg-surface p-3">
                  <LoopAvatar src={`https://i.pravatar.cc/100?u=${c.id}-${i}`} alt="member" size={40} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Member {i + 1}</p>
                    <p className="text-[11px] text-muted-foreground">{i === 0 ? "Admin" : "Member"}</p>
                  </div>
                  <button className="rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
                    Message
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showSheet && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={closeSheet}
        >
          <div
            className="mx-auto w-full max-w-[480px] rounded-t-3xl border-t border-border bg-surface p-6 shadow-elevated animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />

            {join.status === "success" ? (
              <div className="py-2 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <PartyPopper className="h-6 w-6" />
                </div>
                <h2 className="mt-3 text-lg font-semibold">You're in</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Welcome to {c.name}. Say hi in the feed and turn on highlights to stay in the loop.
                </p>
                <button
                  onClick={() => setShowSheet(false)}
                  className="mt-5 w-full rounded-full bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow"
                >
                  Open community
                </button>
              </div>
            ) : join.status === "error" ? (
              <div className="py-2">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-base font-semibold">
                      {join.reason === "banned"
                        ? "You're restricted from this community"
                        : join.reason === "already"
                        ? "Already a member"
                        : "Couldn't complete join"}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">{join.message}</p>
                  </div>
                </div>
                <div className="mt-5 flex gap-2">
                  {join.reason === "network" && (
                    <button
                      onClick={confirmJoin}
                      className="flex-1 rounded-full bg-gradient-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
                    >
                      Retry
                    </button>
                  )}
                  <button
                    onClick={() => setShowSheet(false)}
                    className="flex-1 rounded-full bg-surface-elevated py-2.5 text-sm font-semibold text-foreground"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Join {c.name}</h2>
                  <button
                    onClick={closeSheet}
                    disabled={join.status === "loading"}
                    className="text-muted-foreground disabled:opacity-40"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  You'll receive notifications for highlights, mentions and town halls. Your RALD profile becomes
                  discoverable to members.
                </p>

                <ul className="mt-5 space-y-2.5 text-sm">
                  <SheetRow icon={<Bell className="h-4 w-4" />} text="Highlights only — quiet by default" />
                  <SheetRow icon={<Lock className="h-4 w-4" />} text="End-to-end encrypted direct messages" />
                  <SheetRow icon={<Users className="h-4 w-4" />} text={`Join ${c.members.toLocaleString()} members`} />
                </ul>

                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-border/60 bg-surface-elevated/40 p-3">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[oklch(0.76_0.19_55)]"
                  />
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    I've read and agree to the <span className="font-medium text-foreground">community rules</span>{" "}
                    and Loop's code of conduct.
                  </span>
                </label>

                <button
                  onClick={confirmJoin}
                  disabled={join.status === "loading" || !agreed}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-50"
                >
                  {join.status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Joining…
                    </>
                  ) : (
                    "Confirm & join"
                  )}
                </button>
                <button
                  onClick={closeSheet}
                  disabled={join.status === "loading"}
                  className="mt-2 w-full rounded-full py-2.5 text-xs font-medium text-muted-foreground disabled:opacity-40"
                >
                  Not now
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </MobileShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface py-2">
      <p className="text-sm font-semibold">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function Row({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface p-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">{icon}</span>
      <div>
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{title}</p>
        <p className="text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function SheetRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">{icon}</span>
      <span>{text}</span>
    </li>
  );
}

function CommunityNotFound() {
  return (
    <MobileShell hideNav>
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface">
          <Users className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="mt-4 text-lg font-semibold">Community not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This community was archived, renamed or made private.
        </p>
        <Link
          to="/communities"
          className="mt-6 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          Browse communities
        </Link>
      </div>
    </MobileShell>
  );
}
