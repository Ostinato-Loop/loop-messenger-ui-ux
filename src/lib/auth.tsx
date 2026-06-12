// Loop Messenger — Auth Provider
// Session Standard V2: HttpOnly cookie only, zero localStorage
// LILCKY STUDIO LIMITED

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

const API = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "") ?? "https://messenger.rald.cloud";

export type RaldUser = {
  id: string;
  name: string;
  handle: string;
  avatar: string | null;
  raldId: string;
  verified: boolean;
  email: string | null;
  role: string;
};

type AuthCtx = {
  user: RaldUser | null;
  ready: boolean;
  signIn: (raldToken: string) => Promise<RaldUser>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

/* ── Helpers ─────────────────────────────────────────────────────── */

function mapUser(raw: Record<string, unknown>): RaldUser {
  const id = (raw.id as string) ?? "";
  const email = (raw.email as string | null) ?? (raw.phone as string | null) ?? null;
  const displayName =
    (raw.displayName as string | null) ??
    (raw.display_name as string | null) ??
    (raw.username as string | null) ??
    (email ? email.split("@")[0] : null) ??
    "Loop User";
  const username = (raw.username as string | null) ?? id;
  return {
    id,
    name: displayName,
    handle: `@${username}`,
    avatar: (raw.avatar as string | null) ?? (raw.avatar_url as string | null) ?? null,
    raldId: `rald.cloud/${username}`,
    verified: (raw.role as string) !== "user" || Boolean(raw.verified),
    email,
    role: (raw.role as string) ?? "user",
  };
}

async function fetchMe(): Promise<RaldUser | null> {
  try {
    const res = await fetch(`${API}/auth/me`, { credentials: "include" });
    if (!res.ok) return null;
    return mapUser(await res.json());
  } catch {
    return null;
  }
}

/* ── Provider ────────────────────────────────────────────────────── */

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RaldUser | null>(null);
  const [ready, setReady] = useState(false);
  const booted = useRef(false);

  // Boot: attempt silent session restore from HttpOnly cookie
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    (async () => {
      try {
        const silent = await fetch(`${API}/auth/silent`, { credentials: "include" });
        if (silent.ok) {
          const body = await silent.json() as { valid?: boolean };
          if (body.valid) {
            const me = await fetchMe();
            setUser(me);
          }
        }
      } catch {
        // Network error — offline mode, stay unauthenticated
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      ready,

      signIn: async (raldToken: string) => {
        const res = await fetch(`${API}/auth/rald-sso`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rald_token: raldToken }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({})) as { error?: string };
          throw new Error(err.error ?? "Authentication failed");
        }
        // Cookie is now set by the server (HttpOnly, rald_session)
        const me = await fetchMe();
        if (!me) throw new Error("Could not load profile after sign-in");
        setUser(me);
        return me;
      },

      signOut: async () => {
        try {
          await fetch(`${API}/auth/logout`, { method: "POST", credentials: "include" });
        } catch {
          // Best-effort — cookie will expire on its own
        }
        setUser(null);
      },
    }),
    [user, ready],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
