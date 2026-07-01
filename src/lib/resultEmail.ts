import type { AssessmentResult } from "./types";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildResultsEmail(result: AssessmentResult): { subject: string; html: string; text: string } {
  const positive = result.scores.filter((s) => s.positive);
  const subject = `PsycScope screening summary — ${result.positiveCount}/32 areas flagged`;

  const positiveList = positive.length
    ? positive.map((s) => `<li><strong>${esc(s.name)}</strong> (${s.percent}% screen)</li>`).join("")
    : "<li>No strong flags on this screen.</li>";

  const html = `<!DOCTYPE html>
<html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#1a1a1a;max-width:560px">
  <h1 style="font-size:1.25rem">PsycScope screening summary</h1>
  <p style="color:#555">Screening only — <strong>not a diagnosis</strong>. Share with a clinician if useful.</p>
  <p style="font-size:2rem;font-weight:700;margin:0.5rem 0">${result.overallPercent}%</p>
  <p>of the 32 disorders screened show possible concern (<strong>${result.positiveCount}/32</strong>).</p>
  ${result.aiSummary ? `<h2>Summary</h2><p>${esc(result.aiSummary).replace(/\n/g, "<br>")}</p>` : ""}
  <h2>Flagged areas</h2>
  <ul>${positiveList}</ul>
  <p style="font-size:0.85rem;color:#666;margin-top:2rem">
    Sent from <a href="https://psyc.6x7.gr">psyc.6x7.gr</a>. We do not store your answers on our servers after sending this email.
    Crisis help worldwide: <a href="https://findahelpline.com">findahelpline.com</a>
  </p>
</body></html>`;

  const text = `PsycScope screening summary (not a diagnosis)

${result.overallPercent}% of disorders screened show possible concern (${result.positiveCount}/32).

${result.aiSummary ? `Summary:\n${result.aiSummary}\n\n` : ""}Flagged: ${positive.map((s) => s.name).join(", ") || "none"}

https://psyc.6x7.gr`;

  return { subject, html, text };
}
