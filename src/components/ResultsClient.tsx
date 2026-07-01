"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ResultsDisplay from "@/components/ResultsDisplay";
import { loadSessionResult } from "@/lib/sessionResult";
import type { AssessmentResult } from "@/lib/types";

export default function ResultsClient() {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setResult(loadSessionResult());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "2.5rem" }}>
        <p>No results in this session.</p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          We don&apos;t store past screenings on the website — complete a screen or view the example demo.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginTop: "1rem" }}>
          <Link href="/assess" className="btn btn-primary">
            Start screening
          </Link>
          <Link href="/demo" className="btn btn-secondary">
            View example demo
          </Link>
        </div>
      </div>
    );
  }

  return <ResultsDisplay result={result} />;
}
