"use client";

import Link from "next/link";
import CrisisHelp from "@/components/CrisisHelp";
import EmailResultsForm from "@/components/EmailResultsForm";
import type { AssessmentResult } from "@/lib/types";

export default function ResultsDisplay({
  result,
  showEmail = true,
}: {
  result: AssessmentResult;
  showEmail?: boolean;
}) {
  const sorted = [...result.scores].sort((a, b) => b.percent - a.percent);
  const positive = sorted.filter((s) => s.positive);

  return (
    <div>
      {result.isDemo && (
        <div className="disclaimer" style={{ marginBottom: "1rem" }}>
          <strong>Example demo only</strong> — realistic sample profile, not your personal answers.
          <Link href="/assess" style={{ marginLeft: "0.5rem" }}>
            Take the real screen →
          </Link>
        </div>
      )}

      <div className="card big-stat">
        <div className="number">{result.overallPercent}%</div>
        <div className="label">
          of the 32 screened disorders show possible concern
          <br />
          <strong style={{ color: "var(--text)" }}>{result.positiveCount} / 32</strong> flagged
        </div>
      </div>

      <div className="disclaimer">
        <strong>Not a diagnosis.</strong> Only you can see these results in this session unless you
        email them. Nobody else on the internet can browse your answers. Screening compares your
        self-report to common clinical thresholds — only a qualified professional can diagnose.
      </div>

      {result.aiSummary && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ marginTop: 0 }}>Summary</h2>
          <div className="ai-summary">{result.aiSummary}</div>
        </div>
      )}

      {showEmail && !result.isDemo && <EmailResultsForm result={result} />}

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

      <CrisisHelp />

      <div className="actions-row" style={{ marginTop: "2rem" }}>
        <Link href="/assess" className="btn btn-secondary">
          {result.isDemo ? "Take real screen" : "Retake screen"}
        </Link>
        {result.isDemo && (
          <Link href="/demo" className="btn btn-ghost">
            View demo again
          </Link>
        )}
      </div>
    </div>
  );
}
