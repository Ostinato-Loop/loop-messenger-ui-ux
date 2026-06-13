import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Mic, MicOff, Video, VideoOff, ScreenShare, Hand, Smile, PhoneOff, MoreHorizontal, Signal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RouteError } from "@/components/loop/RouteError";

export const Route = createFileRoute("/call/$callId")({
  head: () => ({ meta: [{ title: "On call — Loop Messenger" }] }),
  errorComponent: RouteError,
  component: ActiveCall,
});

function ActiveCall() {
  const { callId } = Route.useParams();
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [video, setVideo] = useState(true);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[480px] flex-col overflow-hidden bg-[oklch(0.08_0.01_250)] text-white">
      {/* Hero */}
      <div className="relative flex flex-1 flex-col items-center justify-center gap-4">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/80" />

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-5">
          <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            <span className="text-[11px] font-semibold tracking-wide">{fmt(seconds)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1.5 text-[11px] backdrop-blur">
              <Signal className="h-3 w-3 text-[var(--success)]" /> Connecting
            </span>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Connecting placeholder */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="flex h-24 w-24 animate-pulse items-center justify-center rounded-full bg-white/10 ring-4 ring-white/20">
            <div className="h-16 w-16 rounded-full bg-white/10" />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">Connecting…</p>
            <p className="mt-1 text-xs text-white/50">Call ID: {callId}</p>
            <p className="mt-3 max-w-xs text-center text-xs text-white/40">
              Live calling via Cloudflare RealtimeKit is on the way.
              Hang tight — your call is initialising.
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 border-t border-white/10 bg-black/70 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl">
        <div className="flex items-center justify-around">
          <ControlBtn
            active={!muted}
            onClick={() => setMuted((m) => !m)}
            icon={muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            label={muted ? "Muted" : "Mute"}
          />
          <ControlBtn
            active={video}
            onClick={() => setVideo((v) => !v)}
            icon={video ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            label="Camera"
          />
          <ControlBtn icon={<ScreenShare className="h-5 w-5" />} label="Share" />
          <ControlBtn icon={<Hand className="h-5 w-5" />} label="Raise" />
          <ControlBtn icon={<Smile className="h-5 w-5" />} label="React" />
          <button
            onClick={() => navigate({ to: "/calls" })}
            aria-label="End call"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-elevated active:scale-95"
          >
            <PhoneOff className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ControlBtn({
  icon, label, onClick, active = true,
}: { icon: React.ReactNode; label: string; onClick?: () => void; active?: boolean }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 text-[10px] text-white/70">
      <span
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
          active ? "bg-white/10 text-white" : "bg-destructive/90 text-destructive-foreground"
        )}
      >
        {icon}
      </span>
      {label}
    </button>
  );
}
