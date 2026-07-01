"use client";

import { useState } from "react";
import { loadRecentEmails, rememberEmail } from "@/lib/recentEmails";
import type { AssessmentResult } from "@/lib/types";

export default function EmailResultsForm({
  result,
  onSent,
}: {
  result: AssessmentResult;
  onSent?: () => void;
}) {
  const recent = loadRecentEmails();
  const [email, setEmail] = useState(recent[0] || "");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setBusy(true);
    try {
      const res = await fetch("/api/email-results", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), result }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      rememberEmail(email.trim());
      setMsg("Sent — check your inbox (and spam). We don't keep a copy on the website.");
      onSent?.();
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Could not send.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card" style={{ marginTop: "1.5rem" }}>
      <h2 style={{ marginTop: 0 }}>Keep your results</h2>
      <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
        We don&apos;t save completed screenings on this site — only you see them in this browser tab.
        Email yourself a copy to keep or share with a clinician.
      </p>
      <form onSubmit={submit}>
        <div className="form-field">
          <label htmlFor="result-email">Your email</label>
          <input
            id="result-email"
            type="email"
            list="psyc-email-suggestions"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <datalist id="psyc-email-suggestions">
            {recent.map((e) => (
              <option key={e} value={e} />
            ))}
          </datalist>
        </div>
        {err && <p className="err">{err}</p>}
        {msg && <p className="ok">{msg}</p>}
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Sending…" : "Email my results"}
        </button>
      </form>
    </div>
  );
}
