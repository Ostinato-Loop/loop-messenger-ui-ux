import { Link, useRouterState, type LinkProps } from "@tanstack/react-router";
import { MessageCircle, Users, Phone, Compass, User } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tab = {
  to: LinkProps["to"];
  label: string;
  icon: typeof MessageCircle;
};

const tabs: Tab[] = [
  { to: "/", label: "Chats", icon: MessageCircle },
  { to: "/communities", label: "Communities", icon: Users },
  { to: "/calls", label: "Calls", icon: Phone },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/profile", label: "Profile", icon: User },
];

export function MobileShell({ children, hideNav }: { children: ReactNode; hideNav?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-background">
      <main className={cn("flex-1 pb-20", hideNav && "pb-0")}>{children}</main>

      {!hideNav && (
        <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-surface/95 backdrop-blur-xl">
          <ul className="flex items-center justify-around px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
            {tabs.map(({ to, label, icon: Icon }) => {
              const active = to === "/" ? pathname === "/" : pathname.startsWith(to as string);
              return (
                <li key={to as string} className="flex-1">
                  <Link
                    to={to}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-medium transition-colors",
                      active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-7 w-12 items-center justify-center rounded-full transition-all",
                        active && "bg-primary/15 shadow-glow"
                      )}
                    >
                      <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
                    </span>
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
