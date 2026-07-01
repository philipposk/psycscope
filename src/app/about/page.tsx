export default function AboutPage() {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>About PsycScope</h1>
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <p>
          PsycScope screens 32 well-known psychological disorders using self-report items
          inspired by widely used clinical instruments (PHQ-9, GAD-7, MDQ, ASRS, AQ-10,
          AUDIT-C, and others). It is a <strong>screening tool</strong>, not a substitute for
          professional evaluation.
        </p>
        <p>
          Built by{" "}
          <a href="https://6x7.gr">6x7.gr</a> with optional AI refinement (OpenRouter /
          OpenAI / Groq), Page Assistant for voice guidance, and shared 6x7 authentication
          when you choose to sign in.
        </p>
      </div>

      <h2 id="assistant">Page Assistant</h2>
      <p style={{ color: "var(--text-muted)" }}>
        Use the floating assistant to explain disorders, read your results, or navigate the app.
        Voice mode uses ElevenLabs / OpenAI TTS when configured server-side.
      </p>

      <h2>Crisis resources</h2>
      <ul>
        <li>
          <strong>US:</strong> 988 Suicide &amp; Crisis Lifeline
        </li>
        <li>
          <strong>UK &amp; Ireland:</strong> Samaritans 116 123
        </li>
        <li>
          <strong>EU:</strong>{" "}
          <a href="https://findahelpline.com">findahelpline.com</a>
        </li>
        <li>
          <strong>Emergency:</strong> Call your local emergency number
        </li>
      </ul>

      <p style={{ marginTop: "2rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
        <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a>
      </p>
    </div>
  );
}
