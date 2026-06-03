import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Mic, MicOff, Video, VideoOff, ScreenShare, Hand, Smile, PhoneOff, Users, MoreHorizontal, Signal,
} from "lucide-react";
import { LoopAvatar } from "@/components/loop/Avatar";
import { activeCallParticipants } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { RouteError } from "@/components/loop/RouteError";

export const Route = createFileRoute("/call/$callId")({
  head: () => ({ meta: [{ title: "On call — Loop Messenger" }] }),
  errorComponent: RouteError,
  component: ActiveCall,
});

function ActiveCall() {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [video, setVideo] = useState(true);
  const [reaction, setReaction] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const fireReaction = (emoji: string) => {
    setReaction(emoji);
    setTimeout(() => setReaction(null), 1400);
  };

  const speaker = activeCallParticipants.find((p) => p.speaking) ?? activeCallParticipants[0];
  const others = activeCallParticipants.filter((p) => p.id !== speaker.id).slice(0, 5);

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[480px] flex-col overflow-hidden bg-[oklch(0.08_0.01_250)] text-foreground">
      {/* Hero / speaker */}
      <div className="relative flex-1 overflow-hidden">
        <img
          src={speaker.avatar}
          alt={speaker.name}
          className="absolute inset-0 h-full w-full scale-110 object-cover opacity-90 blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/80" />

        {/* Top bar */}
        <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-5">
          <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            <span className="text-[11px] font-semibold tracking-wide">LIVE · {fmt(seconds)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1.5 text-[11px] backdrop-blur">
              <Signal className="h-3 w-3 text-[var(--success)]" /> HD
            </span>
            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Speaker info */}
        <div className="absolute inset-x-0 bottom-44 px-4 text-center">
          <p className="text-2xl font-semibold tracking-tight drop-shadow-md">{speaker.name}</p>
          <p className="mt-1 text-xs text-white/70">Speaking · powered by Cloudflare RealtimeKit</p>
        </div>

        {/* Floating reaction */}
        {reaction && (
          <div className="pointer-events-none absolute bottom-40 left-1/2 -translate-x-1/2 text-5xl animate-in zoom-in-50 fade-in slide-in-from-bottom-10 duration-700">
            {reaction}
          </div>
        )}

        {/* Participants strip */}
        <div className="absolute bottom-24 left-0 right-0 px-4">
          <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {others.map((p) => (
              <div
                key={p.id}
                className={cn(
                  "relative h-20 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur",
                  p.speaking && "ring-2 ring-primary"
                )}
              >
                <img src={p.avatar} alt={p.name} className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1 pb-1 pt-3 text-[9px]">
                  <p className="truncate font-medium">{p.name}</p>
                </div>
                {p.muted && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive">
                    <MicOff className="h-2.5 w-2.5" />
                  </span>
                )}
              </div>
            ))}
            <button className="flex h-20 w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border border-white/10 bg-black/40 text-[10px] backdrop-blur">
              <Users className="h-4 w-4" />
              +{Math.max(0, 24)}
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="relative z-10 -mt-px border-t border-white/10 bg-black/70 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 backdrop-blur-xl">
        <div className="mb-3 flex justify-center gap-2">
          {["❤️", "🔥", "👏", "😂", "🎉"].map((e) => (
            <button
              key={e}
              onClick={() => fireReaction(e)}
              className="h-9 w-9 rounded-full bg-white/5 text-base hover:bg-white/10 active:scale-95"
            >
              {e}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-around">
          <ControlBtn active={!muted} onClick={() => setMuted((m) => !m)} icon={muted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />} label={muted ? "Muted" : "Mute"} />
          <ControlBtn active={video} onClick={() => setVideo((v) => !v)} icon={video ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />} label="Camera" />
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
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 text-[10px] text-white/70"
    >
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
