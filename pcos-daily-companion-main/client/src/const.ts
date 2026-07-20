import { ensureAnonymousSession } from "@/lib/supabase";

// The app starts without collecting an account. Supabase creates a private
// anonymous identity so each person's records remain separate.
export const startLogin = () => {
  void ensureAnonymousSession()
    .then(() => window.location.reload())
    .catch(error => console.error("Unable to create anonymous session", error));
};
