export default function PrivacyPage() {
  return (
    <div>
      <h1>Privacy</h1>
      <div className="card">
        <p>
          PsycScope stores screening answers locally in your browser by default. If you sign in
          with a 6x7 account, we may save results to our Supabase database to sync across
          devices.
        </p>
        <p>
          AI analysis sends your answers (and optional narrative) to our LLM providers
          (OpenRouter, OpenAI, or Groq) for processing. We do not sell your data.
        </p>
        <p>
          Contact: <a href="mailto:privacy@6x7.gr">privacy@6x7.gr</a>
        </p>
      </div>
    </div>
  );
}
