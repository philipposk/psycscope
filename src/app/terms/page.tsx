export default function TermsPage() {
  return (
    <div>
      <h1>Terms</h1>
      <div className="card">
        <p>
          PsycScope is provided &quot;as is&quot; for educational screening only. It does not
          provide medical advice, diagnosis, or treatment. By using this service you agree not
          to rely on it for clinical decisions.
        </p>
        <p>Operator: 6x7.gr · <a href="mailto:support@6x7.gr">support@6x7.gr</a></p>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Terms — PsycScope",
  description: "Terms of use for PsycScope. Screening only, not medical advice or diagnosis.",
  alternates: { canonical: "/terms" },
};
