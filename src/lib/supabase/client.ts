import { createBrowserClient } from "@supabase/ssr";
import { cookieOptionsForHost } from "./cookies";

export function createSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookieOptions: cookieOptionsForHost(typeof window !== "undefined" ? window.location.hostname : undefined) },
  );
}
