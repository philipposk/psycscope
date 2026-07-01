import type { Capability } from "@page-assistant/core";

async function apiJson<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, {
    credentials: "same-origin",
    ...init,
    headers: { "content-type": "application/json", ...init?.headers },
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((d as { error?: string }).error || `Request failed (${r.status})`);
  return d as T;
}

export const PSYC_PA_KNOWLEDGE = `PsycScope (psyc.6x7.gr) screens 32 well-known psychological disorders using validated-style self-report questions plus optional AI refinement.

IMPORTANT: This is a screening tool, NOT a diagnosis. Results show what percentage of the 32 disorders show possible clinical concern based on answers. Users should consult qualified mental health professionals for diagnosis and treatment.

Flow: intro → 32 primary screens → deepening questions for flagged areas → optional narrative → AI analysis → results chart.

Disorders covered: depression, anxiety, PTSD, OCD, ADHD, bipolar, eating disorders, substance use, insomnia, autism traits, personality patterns, and more.

Crisis: If someone mentions self-harm or suicide, urge them to contact local emergency services or a crisis line immediately.`;

export function psycCapabilities(): Capability[] {
  return [
    {
      name: "explain_disorder",
      description: "Explain what a screened disorder means in plain language (educational, not diagnostic).",
      parameters: {
        type: "object",
        properties: { disorderId: { type: "string", description: "e.g. mdd, gad, ptsd" } },
        required: ["disorderId"],
      },
      async run({ disorderId }: { disorderId: string }) {
        return apiJson<{ name: string; description: string }>(
          `/api/disorders/${encodeURIComponent(disorderId)}`,
        );
      },
      render: (r: { name: string; description: string }) =>
        `**${r.name}**: ${r.description}`,
    },
    {
      name: "get_latest_results",
      description: "Summarize the user's most recent screening results from this browser session.",
      parameters: { type: "object", properties: {} },
      async run() {
        if (typeof window === "undefined") return { summary: "Open results in the browser." };
        try {
          const raw = sessionStorage.getItem("psycscope-latest");
          const parsed = raw ? JSON.parse(raw) : null;
          const result = Array.isArray(parsed) ? parsed[0] : parsed;
          if (!result?.scores) return { summary: "No results yet. Complete /assess first." };
          const positive = result.scores.filter((s: { positive: boolean }) => s.positive);
          const summary = positive.length
            ? `${result.overallPercent}% of disorders flag possible concern (${positive.length}/32): ${positive.map((s: { name: string }) => s.name).join(", ")}. Screening only — not diagnosis.`
            : `No strong flags (${result.overallPercent}% overall). Screening is not diagnosis.`;
          return { summary };
        } catch {
          return { summary: "Could not read local results." };
        }
      },
      render: (r: { summary: string }) => r.summary,
    },
    {
      name: "navigate",
      description: "Open a PsycScope page: /, /assess, /results, /history, /about.",
      parameters: {
        type: "object",
        properties: { path: { type: "string" } },
        required: ["path"],
      },
      async run({ path }: { path: string }) {
        const allowed = ["/", "/assess", "/results", "/demo", "/about"];
        if (!allowed.includes(path)) throw new Error(`Allowed: ${allowed.join(", ")}`);
        if (typeof window !== "undefined") window.location.href = path;
        return { ok: true, path };
      },
      render: (r: { path: string }) => `Opened ${r.path}.`,
    },
    {
      name: "start_assessment",
      description: "Start or restart the 32-disorder screening questionnaire.",
      parameters: { type: "object", properties: {} },
      confirm: true,
      async run() {
        if (typeof window !== "undefined") window.location.href = "/assess";
        return { ok: true };
      },
      render: () => "Starting a new screening. Your previous in-progress answers will reset.",
    },
  ];
}
