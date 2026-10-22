"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createSupabaseClient } from "@/lib/supabase/client";
import { isDisposableEmail } from "@/lib/email";

const RESEND_COOLDOWN_S = 60;
const NETWORK_ERROR = "Could not reach the server. Check your connection and try again.";
const LINK_ERROR =
  "That sign-in link did not work. It may have expired or been used already, or been opened in a different browser. Ask for a new link.";
const BUSY_ERROR = "Email sign-in is busy right now. Use Google, or try again in a few minutes.";

function isRateLimit(err: { message?: string; status?: number }): boolean {
  const msg = (err.message || "").toLowerCase();
  return err.status === 429 || msg.includes("rate limit") || msg.includes("only request this after");
}

/**
 * Sign-in is passwordless: Google, or a one-time link + code emailed by Supabase.
 * Every *.6x7.gr app shares one auth store and one session cookie, so there is no password signup:
 * a password account created for someone else's email would open that person's account everywhere.
 * People who signed up with a password before keep the same account: the emailed link signs them in.
 */
export default function SignInForm({ next, linkFailed }: { next: string; linkFailed: boolean }) {
  const supabase = createSupabaseClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(linkFailed ? LINK_ERROR : "");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function sendLink(e?: React.FormEvent) {
    e?.preventDefault();
    setErr("");
    const addr = email.trim();
    if (isDisposableEmail(addr)) {
      setErr("Use a permanent email.");
      return;
    }
    setBusy(true);
    let otpErr: { message?: string; status?: number } | null = null;
    try {
      ({ error: otpErr } = await supabase.auth.signInWithOtp({
        email: addr,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      }));
    } catch {
      otpErr = { message: NETWORK_ERROR };
    }
    setBusy(false);
    if (otpErr) {
      setErr(isRateLimit(otpErr) ? BUSY_ERROR : otpErr.message || NETWORK_ERROR);
      return;
    }
    setCode("");
    setSent(true);
    setCooldown(RESEND_COOLDOWN_S);
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    let failed = "";
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code.replace(/\s/g, ""),
        type: "email",
      });
      if (error) failed = isRateLimit(error) ? BUSY_ERROR : "That code did not work. Check it, or ask for a new link.";
    } catch {
      failed = NETWORK_ERROR;
    }
    setBusy(false);
    if (failed) {
      setErr(failed);
      return;
    }
    router.push(next);
    router.refresh();
  }

  async function google() {
    setErr("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) setErr(error.message);
  }

  return (
    <div className="center-narrow">
      <h1>{sent ? "Check your email" : "Sign in"}</h1>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
        Optional — screening works without an account. One 6x7 login works across all{" "}
        <a href="https://6x7.gr">6x7.gr</a> apps.
      </p>

      {sent ? (
        <>
          <p style={{ fontSize: "0.95rem" }}>
            We sent a sign-in link to <strong>{email.trim()}</strong>. Open it on this device, or type the code from
            the email below. Check your spam folder too. The link and the code work once: using one cancels the other.
          </p>
          <form onSubmit={verifyCode}>
            <div className="form-field">
              <label htmlFor="code">Code from the email</label>
              <input
                id="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                minLength={6}
                maxLength={12}
                style={{ letterSpacing: "0.15em" }}
              />
            </div>
            {err && <p className="err" role="alert">{err}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={busy}>
              {busy ? "…" : "Sign in with code"}
            </button>
          </form>
          <p style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", fontSize: "0.9rem" }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setSent(false);
                setErr("");
                setCooldown(0);
              }}
            >
              Use a different email
            </button>
            <button type="button" className="btn btn-ghost" disabled={busy || cooldown > 0} onClick={() => void sendLink()}>
              {cooldown > 0 ? `Send a new link (${cooldown}s)` : "Send a new link"}
            </button>
          </p>
        </>
      ) : (
        <>
          <button type="button" className="btn btn-secondary" style={{ width: "100%" }} onClick={google}>
            Continue with Google
          </button>
          <form onSubmit={sendLink} style={{ marginTop: "1.25rem" }}>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {err && <p className="err" role="alert">{err}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={busy}>
              {busy ? "…" : "Email me a sign-in link"}
            </button>
          </form>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", marginTop: "1rem" }}>
            No password needed. New here? The link creates your account. Used a password before? Same email, same
            account.
          </p>
        </>
      )}
      <p style={{ textAlign: "center", marginTop: "1rem" }}>
        <Link href="/">← Back to screening</Link>
      </p>
    </div>
  );
}
