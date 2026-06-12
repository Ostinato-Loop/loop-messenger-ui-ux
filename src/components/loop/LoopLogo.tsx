import logo from "@/assets/loop-messenger-logo.jpg";
import { cn } from "@/lib/utils";

export function LoopLogo({ className, withWord = false }: { className?: string; withWord?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <img
        src={logo}
        alt="Loop Messenger"
        width={32}
        height={32}
        className="h-8 w-8 rounded-lg object-cover drop-shadow-[0_0_10px_oklch(0.76_0.19_55/0.55)]"
      />
      {withWord && (
        <span className="text-lg font-semibold tracking-tight">
          <span className="text-primary">Loop</span> <span className="text-foreground">Messenger</span>
        </span>
      )}
    </div>
  );
}
