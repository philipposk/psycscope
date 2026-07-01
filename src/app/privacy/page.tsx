export default function PrivacyPage() {
  return (
    <div>
      <h1>Privacy</h1>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Who can see your results?</h2>
        <p>
          <strong>Only you</strong>, in this browser session. PsycScope does not publish results,
          rank users, or expose answers to other visitors. We do not keep a browsable
          &quot;history&quot; on the website after you leave.
        </p>

        <h2>What we store</h2>
        <ul>
          <li>
            <strong>In-progress answers</strong> — saved locally on your device while you
            complete the questionnaire (so switching apps on your phone does not lose progress).
          </li>
          <li>
            <strong>Completed results</strong> — kept in session memory until you close the tab;
            not written to our database unless you sign in (optional, not required).
          </li>
          <li>
            <strong>Email</strong> — if you choose &quot;Email my results,&quot; we send one message
            via Resend and do not keep your answers on our servers afterward.
          </li>
          <li>
            <strong>Recent email suggestions</strong> — stored only in your browser&apos;s
            localStorage for convenience.
          </li>
        </ul>

        <h2>AI analysis</h2>
        <p>
          Optional AI processing sends your answers (and optional narrative) to our LLM providers
          (OpenRouter, OpenAI, or Groq) for one-time summarization. Do not include names of third
          parties you are not allowed to share.
        </p>

        <h2>Location &amp; crisis help</h2>
        <p>
          We guess your country from network IP (Vercel edge headers) to suggest nearby helplines —
          no GPS unless you tap &quot;Find help near me,&quot; which opens Find A Helpline in your
          browser (they handle location locally).
        </p>

        <h2>Contact</h2>
        <p>
          <a href="mailto:privacy@6x7.gr">privacy@6x7.gr</a>
        </p>
      </div>
    </div>
  );
}
