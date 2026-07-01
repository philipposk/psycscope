"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LIKERT_OPTIONS } from "@/lib/disorders";
import {
  buildResult,
  disordersNeedingDeepening,
  questionsForPhase,
  saveLocal,
} from "@/lib/scoring";
import type { AssessmentAnswers, LikertValue } from "@/lib/types";

type Step = "primary" | "deepening" | "narrative" | "analyzing";

export default function AssessmentClient() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("primary");
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [idx, setIdx] = useState(0);
  const [narrative, setNarrative] = useState("");
  const [error, setError] = useState("");

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
    questions.length > 0 ? ((idx + (answers[current?.id] !== undefined ? 1 : 0)) / questions.length) * 100 : 0;

  const setAnswer = useCallback((qid: string, v: LikertValue) => {
    setAnswers((prev) => ({ ...prev, [qid]: v }));
  }, []);

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
      saveLocal(data);
      sessionStorage.setItem("psycscope-latest", JSON.stringify(data));
      router.push("/results");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      const fallback = buildResult(answers, narrative);
      saveLocal(fallback);
      sessionStorage.setItem("psycscope-latest", JSON.stringify(fallback));
      router.push("/results");
    }
  }

  function skipAI() {
    const result = buildResult(answers, narrative.trim() || undefined);
    saveLocal(result);
    sessionStorage.setItem("psycscope-latest", JSON.stringify(result));
    router.push("/results");
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

  if (step === "narrative") {
    return (
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
    );
  }

  if (!current) return null;

  return (
    <div>
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
            {idx < questions.length - 1 ? "Next" : step === "primary" ? "Continue" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
