"use client";

import Link from "next/link";
import { loadHistory } from "@/lib/scoring";

export default function HistoryPage() {
  const history = typeof window !== "undefined" ? loadHistory() : [];

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Local history</h1>
      <p style={{ color: "var(--text-muted)" }}>
        Past screens stored in this browser only. Sign in to sync across devices (coming soon).
      </p>
      {history.length === 0 ? (
        <div className="card">No past screens yet.</div>
      ) : (
        <div className="disorder-list">
          {history.map((h) => (
            <Link
              key={h.id}
              href="/results"
              className="disorder-row"
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={() => sessionStorage.setItem("psycscope-latest", JSON.stringify(h))}
            >
              <span>{new Date(h.createdAt).toLocaleString()}</span>
              <span style={{ flex: 1 }} />
              <strong>{h.overallPercent}%</strong>
              <span style={{ color: "var(--text-muted)" }}>{h.positiveCount}/32 flagged</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
