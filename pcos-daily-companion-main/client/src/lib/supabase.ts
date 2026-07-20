import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !publishableKey) {
  console.warn("Supabase is not configured. Copy .env.example to .env and add the project values.");
}

export const supabase = createClient(
  url || "https://placeholder.supabase.co",
  publishableKey || "placeholder-key",
);

export async function ensureAnonymousSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) return session.user;
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  if (!data.user) throw new Error("匿名身份创建失败，请稍后重试");
  return data.user;
}
