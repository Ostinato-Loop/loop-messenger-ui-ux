import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Settings, QrCode, Shield, Lock, Bell, Link2, Globe, ChevronRight, LogOut } from "lucide-react";
import { MobileShell } from "@/components/loop/MobileShell";
import { ScreenHeader } from "@/components/loop/ScreenHeader";
import { LoopAvatar } from "@/components/loop/Avatar";
import { VerifiedBadge } from "@/components/loop/VerifiedBadge";
import { useAuth } from "@/lib/auth";
import { RouteError } from "@/components/loop/RouteError";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Loop Messenger" }] }),
  errorComponent: RouteError,
  component: ProfilePage,
});

const ecosystem = [
  { name: "Loop", color: "from-orange-400 to-amber-500" },
  { name: "PayRALD", color: "from-emerald-400 to-teal-500" },
  { name: "GitRald", color: "from-violet-400 to-indigo-500" },
  { name: "RALD Mail", color: "from-rose-400 to-pink-500" },
  { name: "DunaRald", color: "from-sky-400 to-cyan-500" },
  { name: "RALD AI", color: "from-fuchsia-400 to-purple-500" },
];

function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = () => {
    signOut();
    navigate({ to: "/auth" });
  };
  const name = user?.name ?? "John Doe";
  const handle = user?.handle ?? "@johndoe";
  const avatar = user?.avatar ?? "https://i.pravatar.cc/150?u=johndoe";
  const raldId = user?.raldId ?? "rald.cloud/johndoe";

  return (
    <MobileShell>
      <ScreenHeader
        title="Profile"
        right={
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-surface hover:text-foreground">
            <Settings className="h-5 w-5" />
          </button>
        }
      />

      <div className="px-4 pt-2 pb-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-surface to-surface-elevated p-5 shadow-elevated">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <LoopAvatar src={avatar} alt={name} size={72} ring online />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-lg font-semibold">{name}</p>
                <VerifiedBadge />
              </div>
              <p className="text-xs text-muted-foreground">{handle}</p>
              <p className="mt-1 text-[11px] text-primary">RALD ID · {raldId}</p>
            </div>
            <button
              aria-label="Show QR"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/50 text-primary"
            >
              <QrCode className="h-5 w-5" />
            </button>
          </div>

          <div className="relative mt-5 grid grid-cols-3 gap-2 text-center">
            <Stat label="Communities" value="12" />
            <Stat label="Connections" value="284" />
            <Stat label="Following" value="1.2k" />
          </div>
        </div>

        <section className="mt-6">
          <SectionTitle>Connected RALD apps</SectionTitle>
          <div className="grid grid-cols-3 gap-2">
            {ecosystem.map((a) => (
              <div
                key={a.name}
                className="flex flex-col items-center gap-2 rounded-2xl border border-border/60 bg-surface p-3"
              >
                <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${a.color}`} />
                <p className="text-[11px] font-medium">{a.name}</p>
              </div>
            ))}
          </div>
          <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-transparent py-3 text-xs font-medium text-muted-foreground hover:text-foreground">
            <Link2 className="h-4 w-4" /> Connect another app
          </button>
        </section>

        <section className="mt-6">
          <SectionTitle>Account</SectionTitle>
          <ul className="overflow-hidden rounded-2xl border border-border/60 bg-surface">
            <Row icon={<Shield className="h-4 w-4" />} label="Security" hint="2FA active" />
            <Row icon={<Lock className="h-4 w-4" />} label="Privacy" hint="End-to-end encrypted" />
            <Row icon={<Bell className="h-4 w-4" />} label="Notifications" />
            <Row icon={<Globe className="h-4 w-4" />} label="Language & region" hint="English" />
            <Row icon={<Link2 className="h-4 w-4" />} label="Third-party permissions" hint="3 apps" />
          </ul>
        </section>

        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-surface py-3 text-sm font-semibold text-destructive">
          <LogOut className="h-4 w-4" /> Sign out
        </button>

        <p className="mt-6 text-center text-[11px] text-muted-foreground">
          Loop Messenger · part of the <span className="text-primary">RALD ecosystem</span>
        </p>
      </div>
    </MobileShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-background/40 py-2">
      <p className="text-base font-semibold">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</h2>;
}

function Row({ icon, label, hint }: { icon: React.ReactNode; label: string; hint?: string }) {
  return (
    <li>
      <button className="flex w-full items-center gap-3 border-b border-border/40 px-4 py-3 text-left last:border-0 hover:bg-surface-elevated">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">{icon}</span>
        <span className="flex-1 text-sm font-medium">{label}</span>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </button>
    </li>
  );
}
