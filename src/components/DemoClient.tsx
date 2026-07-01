"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import ResultsDisplay from "@/components/ResultsDisplay";
import { buildFilipposDemo, saveSessionResult } from "@/lib/sessionResult";

export default function DemoClient() {
  const router = useRouter();
  const demo = useMemo(() => buildFilipposDemo(), []);

  useEffect(() => {
    saveSessionResult(demo);
  }, [demo]);

  return (
    <div>
      <p style={{ color: "var(--text-muted)", marginBottom: "1.25rem" }}>
        Sample profile for a busy developer (moderate anxiety, focus, and sleep flags). Use this to see
        what results look like — then take your own screen.
      </p>
      <ResultsDisplay result={demo} showEmail={false} />
      <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <button type="button" className="btn btn-ghost" onClick={() => router.push("/results")}>
          Open as live session results →
        </button>
      </p>
    </div>
  );
}
