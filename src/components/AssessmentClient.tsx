"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LIKERT_OPTIONS } from "@/lib/disorders";
import {
  buildResult,
  clearDraft,
  disordersNeedingDeepening,
  loadDraft,
  questionsForPhase,
  saveDraft,
  saveLocal,
} from "@/lib/scoring";
import type { AssessmentAnswers, LikertValue } from "@/lib/types";

type Step = "primary" | "deepening" | "narrative" | "analyzing";

function clampIdx(idx: number, step: Step, answers: AssessmentAnswers): number {
  if (step === "narrative" || step === "analyzing") return 0;
  const deepeningFor =
    step === "deepening" ? disordersNeedingDeepening(answers) : [];
  const qs = questionsForPhase(
    step === "primary" ? "primary" : "deepening",
    deepeningFor,
  );
  if (qs.length === 0) return 0;
  return Math.min(Math.max(0, idx), qs.length - 1);
}

export default function AssessmentClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("primary");
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [idx, setIdx] = useState(0);
  const [narrative, setNarrative] = useState("");
  const [error, setError] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [resumed, setResumed] = useState(false);
  const stateRef = useRef({ answers, step, idx, narrative });

  stateRef.current = { answers, step, idx, narrative };

  // Restore in-progress screening after tab switch / phone backgrounding
  useEffect(() => {
    const draft = loadDraft();
    if (draft && Object.keys(draft.answers).length > 0) {
      setAnswers(draft.answers);
      setStep(draft.step);
      setIdx(clampIdx(draft.idx, draft.step, draft.answers));
      setNarrative(draft.narrative || "");
      setResumed(true);
    }
    setHydrated(true);
  }, []);

  const persistDraft = useCallback(() => {
    const { answers: a, step: s, idx: i, narrative: n } = stateRef.current;
    if (s === "analyzing") return;
    saveDraft({ answers: a, step: s, idx: i, narrative: n });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persistDraft();
  }, [hydrated, answers, step, idx, narrative, persistDraft]);

  // Mobile browsers drop in-memory state when backgrounded — flush on hide
  useEffect(() => {
    const onHide = () => persistDraft();
    const onVis = () => {
      if (document.visibilityState === "hidden") onHide();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", onHide);
    };
  }, [persistDraft]);

  const deepeningFor = useMemo(
    () => (step === "deepening" ? disordersNeedingDeepening(answers) : []),
    [step, answers],
  );

  const questions = useMemo(() => {
    if (step === "primary") return questionsForPhase("primary", []);
    if (step === "deepening") return questionsForPhase("deepening", deepeningFor);
    return [];
  }, [step, deepeningFor]);

  const current = questions[idx];
  const progress =
    questions.length > 0
      ? ((idx + (answers[current?.id] !== undefined ? 1 : 0)) / questions.length) * 100
      : 0;

  const setAnswer = useCallback((qid: string, v: LikertValue) => {
    setAnswers((prev) => {
      const next = { ...prev, [qid]: v };
      stateRef.current = { ...stateRef.current, answers: next };
      saveDraft({
        answers: next,
        step: stateRef.current.step as "primary" | "deepening" | "narrative",
        idx: stateRef.current.idx,
        narrative: stateRef.current.narrative,
      });
      return next;
    });
  }, []);

  function finishAssessment(result: ReturnType<typeof buildResult>) {
    clearDraft();
    saveLocal(result);
    sessionStorage.setItem("psycscope-latest", JSON.stringify(result));
    router.push("/results");
  }

  async function finishWithAI() {
    setStep("analyzing");
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answers, narrative: narrative.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      finishAssessment(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      finishAssessment(buildResult(answers, narrative));
    }
  }

  function skipAI() {
    finishAssessment(buildResult(answers, narrative.trim() || undefined));
  }

  function startOver() {
    clearDraft();
    setAnswers({});
    setStep("primary");
    setIdx(0);
    setNarrative("");
    setResumed(false);
    setError("");
  }

  function onNext() {
    if (!current || answers[current.id] === undefined) return;
    if (idx < questions.length - 1) {
      setIdx(idx + 1);
      return;
    }
    if (step === "primary") {
      const need = disordersNeedingDeepening(answers);
      if (need.length > 0) {
        setStep("deepening");
        setIdx(0);
      } else {
        setStep("narrative");
      }
      return;
    }
    if (step === "deepening") {
      setStep("narrative");
    }
  }

  function onBack() {
    if (idx > 0) {
      setIdx(idx - 1);
      return;
    }
    if (step === "deepening") {
      setStep("primary");
      setIdx(questionsForPhase("primary", []).length - 1);
    } else if (step === "narrative") {
      const need = disordersNeedingDeepening(answers);
      if (need.length > 0) {
        setStep("deepening");
        setIdx(questionsForPhase("deepening", need).length - 1);
      } else {
        setStep("primary");
        setIdx(questionsForPhase("primary", []).length - 1);
      }
    }
  }

  if (!hydrated) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
        <div className="spinner" />
      </div>
    );
  }

  if (step === "analyzing") {
    return (
      <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
        <div className="spinner" />
        <p>AI is reviewing your answers compassionately…</p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          This is screening, not diagnosis.
        </p>
      </div>
    );
  }

  const resumeBanner = resumed && (
    <div
      className="disclaimer"
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.75rem",
        marginBottom: "1rem",
      }}
    >
      <span>Picked up where you left off — safe to switch apps and come back.</span>
      <button type="button" className="btn btn-ghost" onClick={startOver} style={{ padding: "0.35rem 0.75rem" }}>
        Start over
      </button>
    </div>
  );

  if (step === "narrative") {
    return (
      <div>
        {resumeBanner}
        <div className="card question-card">
          <h2>Anything else you want to share?</h2>
          <p className="question-meta">
            Optional — describe context, duration, or what worries you most. AI uses this to refine your screen.
          </p>
          <textarea
            className="narrative"
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            placeholder="e.g. I've felt this way for about six months since changing jobs…"
          />
          {error && <p className="err">{error}</p>}
          <div className="actions-row">
            <button type="button" className="btn btn-ghost" onClick={onBack}>
              Back
            </button>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="button" className="btn btn-secondary" onClick={skipAI}>
                Skip AI — see scores
              </button>
              <button type="button" className="btn btn-primary" onClick={finishWithAI}>
                Analyze with AI
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div>
      {resumeBanner}
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0 0 1rem" }}>
        {step === "primary" ? "Primary screen" : "Follow-up"} · Question {idx + 1} of {questions.length}
      </p>
      <div className="card question-card">
        {current.disorderName && (
          <span className="category-pill" style={{ marginLeft: 0, marginBottom: "0.5rem" }}>
            {current.disorderName}
          </span>
        )}
        <h2>{current.text}</h2>
        <p className="question-meta">Over the past two weeks, how often…</p>
        <div className="likert">
          {LIKERT_OPTIONS.map((opt) => (
            <label key={opt.value}>
              <input
                type="radio"
                name={current.id}
                checked={answers[current.id] === opt.value}
                onChange={() => setAnswer(current.id, opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
        <div className="actions-row">
          <button type="button" className="btn btn-ghost" onClick={onBack} disabled={step === "primary" && idx === 0}>
            Back
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onNext}
            disabled={answers[current.id] === undefined}
          >
            {idx < questions.length - 1 ? "Next" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
