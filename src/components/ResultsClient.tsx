"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadLatest } from "@/lib/scoring";
import type { AssessmentResult } from "@/lib/types";

export default function ResultsClient() {
  const [result, setResult] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("psycscope-latest");
      if (raw) {
        setResult(JSON.parse(raw));
        return;
      }
    } catch { /* ignore */ }
    setResult(loadLatest());
  }, []);

  if (!result) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "2.5rem" }}>
        <p>No results yet.</p>
        <Link href="/assess" className="btn btn-primary" style={{ marginTop: "1rem", display: "inline-flex" }}>
          Start screening
        </Link>
      </div>
    );
  }

  const sorted = [...result.scores].sort((a, b) => b.percent - a.percent);
  const positive = sorted.filter((s) => s.positive);

  return (
    <div>
      <div className="card big-stat">
        <div className="number">{result.overallPercent}%</div>
        <div className="label">
          of the 32 screened disorders show possible concern
          <br />
          <strong style={{ color: "var(--text)" }}>{result.positiveCount} / 32</strong> flagged
        </div>
      </div>

      <div className="disclaimer">
        <strong>Not a diagnosis.</strong> This screen compares your self-report answers to common clinical
        thresholds. Only a qualified professional can diagnose. If you are in crisis, contact emergency
        services or a crisis line in your country.
      </div>

      {result.aiSummary && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ marginTop: 0 }}>AI summary</h2>
          <div className="ai-summary">{result.aiSummary}</div>
        </div>
      )}

      <h2>All disorders</h2>
      <div className="disorder-list">
        {sorted.map((s) => (
          <div key={s.id} className={`disorder-row ${s.positive ? "positive" : ""}`}>
            <span style={{ minWidth: "2.5rem", fontWeight: 700 }}>{s.percent}%</span>
            <div style={{ flex: 1 }}>
              <strong>{s.name}</strong>
              <span className="category-pill">{s.category}</span>
            </div>
            <div className="bar-track">
              <div
                className={`bar-fill ${s.positive ? "warn" : ""}`}
                style={{ width: `${s.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {positive.length > 0 && (
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <h3 style={{ marginTop: 0 }}>Areas to discuss with a clinician</h3>
          <ul>
            {positive.map((s) => (
              <li key={s.id}>
                <strong>{s.name}</strong> — {s.shortDescription}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="actions-row" style={{ marginTop: "2rem" }}>
        <Link href="/assess" className="btn btn-secondary">
          Retake screen
        </Link>
        <Link href="/history" className="btn btn-ghost">
          View history
        </Link>
      </div>
    </div>
  );
}
