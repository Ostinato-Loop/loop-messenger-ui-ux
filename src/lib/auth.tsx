import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type RaldUser = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  raldId: string;
  verified: boolean;
};

type AuthCtx = {
  user: RaldUser | null;
  ready: boolean;
  signIn: (token: string) => Promise<RaldUser>;
  signOut: () => void;
};

const STORAGE_KEY = "loop.rald.session";

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RaldUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      ready,
      signIn: async (token) => {
        // Mock: in production this verifies the token against profiles.rald.cloud.
        await new Promise((r) => setTimeout(r, 650));
        const handle = token.trim().toLowerCase() || "johndoe";
        const u: RaldUser = {
          id: handle,
          name: handle === "johndoe" ? "John Doe" : handle.replace(/(^|\s)\S/g, (s) => s.toUpperCase()),
          handle: `@${handle}`,
          avatar: `https://i.pravatar.cc/150?u=${handle}`,
          raldId: `rald.cloud/${handle}`,
          verified: true,
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        setUser(u);
        return u;
      },
      signOut: () => {
        window.localStorage.removeItem(STORAGE_KEY);
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
