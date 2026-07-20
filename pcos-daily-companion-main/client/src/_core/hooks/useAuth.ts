import { ensureAnonymousSession, supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

type AppUser = { id: string; name: string };

const toAppUser = (user: { id: string; user_metadata?: Record<string, unknown> } | null): AppUser | null => {
  if (!user) return null;
  const name = typeof user.user_metadata?.display_name === "string" ? user.user_metadata.display_name : "匿名同伴";
  return { id: user.id, name };
};

export function useAuth(options?: UseAuthOptions) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      setUser(toAppUser(data.session?.user ?? null));
      setError(sessionError ?? null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(toAppUser(session?.user ?? null));
      setLoading(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!options?.redirectOnUnauthenticated || loading || user) return;
    if (options.redirectPath) {
      window.location.href = options.redirectPath;
      return;
    }
    void ensureAnonymousSession().catch(setError);
  }, [loading, options?.redirectOnUnauthenticated, options?.redirectPath, user]);

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();
    setUser(toAppUser(data.session?.user ?? null));
    setError(error ?? null);
    return { data, error };
  }, []);

  return { user, loading, error, isAuthenticated: Boolean(user), refresh, logout };
}
