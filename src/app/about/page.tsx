import Link from "next/link";
import CrisisHelp from "@/components/CrisisHelp";

export default function AboutPage() {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>About PsycScope</h1>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <p>
          PsycScope is a <strong>self-report screening tool</strong> covering 32 well-known
          psychological conditions. It is <strong>not</strong> a diagnostic instrument and does
          not replace evaluation by a licensed clinician.
        </p>
        <p style={{ marginBottom: 0 }}>
          Your completed results stay in this browser session only unless you email them to
          yourself. Nobody else can browse your answers. See{" "}
          <Link href="/privacy">Privacy</Link> for details.
        </p>
      </div>

      <h2>Scientific basis</h2>
      <p style={{ color: "var(--text-muted)" }}>
        Items are inspired by widely used screening measures and DSM-5-TR symptom domains. We
        shortened and combined items for a single sitting — this is a <em>pragmatic screen</em>,
        not a validated clone of any one instrument.
      </p>

      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ marginTop: 0 }}>Instruments &amp; references</h3>
        <ul style={{ margin: 0, paddingLeft: "1.2rem", lineHeight: 1.7 }}>
          <li>
            <strong>Depression:</strong> PHQ-9 (Patient Health Questionnaire) — Kroenke, Spitzer
            &amp; Williams, 2001
          </li>
          <li>
            <strong>Generalized anxiety:</strong> GAD-7 — Spitzer et al., 2006
          </li>
          <li>
            <strong>Bipolar:</strong> Mood Disorder Questionnaire (MDQ) — Hirschfeld et al.
          </li>
          <li>
            <strong>ADHD (adult):</strong> Adult ADHD Self-Report Scale (ASRS) — Kessler et al.
          </li>
          <li>
            <strong>Autism traits:</strong> AQ-10 short form — Allison et al., 2012
          </li>
          <li>
            <strong>Alcohol:</strong> AUDIT-C — Bush et al.
          </li>
          <li>
            <strong>PTSD:</strong> PC-PTSD-5 — Prins et al.
          </li>
          <li>
            <strong>Insomnia:</strong> Insomnia Severity Index (ISI) — Bastien et al.
          </li>
          <li>
            <strong>Framework:</strong> Symptom domains aligned with DSM-5-TR (APA, 2022) for
            educational grouping only
          </li>
        </ul>
      </div>

      <h2>Approach</h2>
      <ul>
        <li>
          <strong>Biopsychosocial screening:</strong> mood, anxiety, trauma, neurodevelopment,
          psychosis, personality, eating, substance, sleep, and somatic domains — common in primary
          care and psychology intake.
        </li>
        <li>
          <strong>Two-stage flow:</strong> brief primary items per disorder, then deepening
          questions only where you flag concern (reduces fatigue vs. 96 fixed items).
        </li>
        <li>
          <strong>Optional AI layer:</strong> narratively refines wording — still constrained to
          your answers; never invents symptoms.
        </li>
      </ul>

      <h2>Limitations</h2>
      <ul>
        <li>Screening overestimates and underestimates — many flagged areas are false positives.</li>
        <li>Self-report is affected by mood today, language, and honesty.</li>
        <li>Not for emergencies — use crisis resources below or local emergency services.</li>
        <li>Not validated for legal, employment, or forensic use.</li>
      </ul>

      <h2 id="assistant">Page Assistant</h2>
      <p style={{ color: "var(--text-muted)" }}>
        Embedded assistant (page-assistant by 6x7.gr) explains disorders and navigates the app.
        Voice uses server-side TTS when configured.
      </p>

      <CrisisHelp />

      <h2>Operator &amp; legal</h2>
      <p>
        Built by <a href="https://6x7.gr">6x7.gr</a>. Contact{" "}
        <a href="mailto:support@6x7.gr">support@6x7.gr</a> ·{" "}
        <a href="mailto:privacy@6x7.gr">privacy@6x7.gr</a>
      </p>
      <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
        <Link href="/privacy">Privacy policy</Link> · <Link href="/terms">Terms of use</Link>
      </p>
    </div>
  );
}
