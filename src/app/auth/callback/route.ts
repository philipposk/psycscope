import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sharedCookieOptions } from "@/lib/supabase/cookies";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const provErr = searchParams.get("error_description") || searchParams.get("error");
  if (provErr) {
    return NextResponse.redirect(`${origin}/sign-in?error=${encodeURIComponent(provErr)}`);
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
    return NextResponse.redirect(`${origin}/sign-in?error=${encodeURIComponent(error.message)}`);
  }
  return NextResponse.redirect(`${origin}/sign-in?error=auth`);
}
