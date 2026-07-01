"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase/client";
import { isDisposableEmail } from "@/lib/email";

export default function SignInPage() {
  const supabase = createSupabaseClient();
  const router = useRouter();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const nextUrl = () =>
    typeof window === "undefined"
      ? "/"
      : new URLSearchParams(window.location.search).get("next") || "/";

  useEffect(() => {
    const e = new URLSearchParams(window.location.search).get("error");
    if (e) setErr(e === "auth" ? "Sign-in failed." : e);
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setBusy(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
        router.push(nextUrl());
        router.refresh();
      } else {
        if (isDisposableEmail(email)) throw new Error("Use a permanent email.");
        const { error } = await supabase.auth.signUp({
          email,
          password: pw,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        setMsg("Check your email to confirm, then sign in.");
        setMode("in");
      }
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setErr("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setErr(error.message);
  }

  return (
    <div className="center-narrow">
      <h1>{mode === "in" ? "Sign in" : "Create account"}</h1>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
        Optional — screening works without an account. One 6x7 login works across all{" "}
        <a href="https://6x7.gr">6x7.gr</a> apps.
      </p>
      <form onSubmit={submit}>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-field">
          <label htmlFor="pw">Password</label>
          <input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} required minLength={6} />
        </div>
        {err && <p className="err">{err}</p>}
        {msg && <p className="ok">{msg}</p>}
        <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={busy}>
          {busy ? "…" : mode === "in" ? "Sign in" : "Sign up"}
        </button>
      </form>
      <button type="button" className="btn btn-secondary" style={{ width: "100%", marginTop: "0.75rem" }} onClick={google}>
        Continue with Google
      </button>
      <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
        {mode === "in" ? (
          <>
            No account?{" "}
            <button type="button" className="btn btn-ghost" onClick={() => setMode("up")}>
              Sign up
            </button>
          </>
        ) : (
          <>
            Have an account?{" "}
            <button type="button" className="btn btn-ghost" onClick={() => setMode("in")}>
              Sign in
            </button>
          </>
        )}
      </p>
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        <Link href="/">← Back to screening</Link>
      </p>
    </div>
  );
}
