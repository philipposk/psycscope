import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sharedCookieOptions } from "@/lib/supabase/cookies";
import { safeNext } from "@/lib/safe-next.mjs";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"), "/");
  // Keep the destination so "ask for a new link" still lands where the person was headed.
  const fail = `${origin}/sign-in?error=auth${next !== "/" ? `&next=${encodeURIComponent(next)}` : ""}`;

  if (searchParams.get("error") || searchParams.get("error_description")) {
    return NextResponse.redirect(fail);
  }

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookieOptions: sharedCookieOptions,
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(list) {
            try {
              for (const { name, value, options } of list) {
                cookieStore.set(name, value, options);
              }
            } catch { /* ignore */ }
          },
        },
      },
    );
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(fail);
}
