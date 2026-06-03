import { cn } from "@/lib/utils";

export function LoopAvatar({
  src,
  alt,
  size = 48,
  online,
  ring,
  className,
}: {
  src: string;
  alt: string;
  size?: number;
  online?: boolean;
  ring?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }}>
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        loading="lazy"
        className={cn(
          "h-full w-full rounded-full object-cover bg-surface-elevated",
          ring && "ring-2 ring-primary ring-offset-2 ring-offset-background"
        )}
      />
      {online && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[var(--success)] ring-2 ring-background" />
      )}
    </div>
  );
}
