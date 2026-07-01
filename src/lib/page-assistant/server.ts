export function paLlmTxtMeta(origin: string) {
  const base = origin.replace(/\/$/, "");
  return {
    appName: "PsycScope",
    appUrl: base,
    description:
      "Screen 32 well-known psychological disorders with self-report questions and optional AI analysis. Screening only — not diagnosis.",
    version: "0.1",
    agentEndpoint: `${base}/api/pa/v1/agent`,
  };
}
