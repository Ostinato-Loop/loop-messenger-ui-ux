import { BadgeCheck, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerifiedBadge({ className }: { className?: string }) {
  return <BadgeCheck className={cn("h-4 w-4 text-[var(--verified)] fill-[var(--verified)]/20", className)} />;
}

export function BusinessBadge({ className }: { className?: string }) {
  return <Briefcase className={cn("h-3.5 w-3.5 text-primary", className)} />;
}
