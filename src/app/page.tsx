import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="hero">
        <h1>How many of the 32 best-known disorders might apply to you?</h1>
        <p>
          PsycScope runs a structured self-report screen across 32 common psychological
          conditions — then optionally refines results with AI. Free, private, no account
          required.
        </p>
        <Link href="/assess" className="btn btn-primary" style={{ fontSize: "1.05rem", padding: "0.85rem 1.5rem" }}>
          Start screening — about 10 minutes
        </Link>
        <Link href="/demo" className="btn btn-secondary" style={{ marginLeft: "0.75rem", fontSize: "1.05rem", padding: "0.85rem 1.5rem" }}>
          See example results
        </Link>
      </section>

      <div className="disclaimer">
        <strong>Screening, not diagnosis.</strong> PsycScope uses validated-style questions
        inspired by PHQ-9, GAD-7, MDQ, ASRS, and similar instruments. Results show what
        percentage of disorders flag possible concern — only a clinician can diagnose. If you
        are in immediate danger, call emergency services.
      </div>

      <div className="card-grid">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>32 disorders</h3>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.95rem" }}>
            Depression, anxiety, PTSD, OCD, ADHD, bipolar, eating disorders, substance use,
            insomnia, autism traits, personality patterns, and more.
          </p>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Smart follow-up</h3>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.95rem" }}>
            Primary screens first, then deeper questions only where you flag concern. Optional
            narrative + AI compassionately refines your profile.
          </p>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Voice assistant</h3>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.95rem" }}>
            Ask the built-in Page Assistant to explain disorders, navigate results, or guide
            you through screening — grounded in your real data.
          </p>
        </div>
      </div>

      <p style={{ textAlign: "center", marginTop: "2.5rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
        Part of the{" "}
        <a href="https://6x7.gr">6x7.gr</a> platform ·{" "}
        <Link href="/about">About &amp; disclaimers</Link>
      </p>
    </div>
  );
}
