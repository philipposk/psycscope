import AssessmentClient from "@/components/AssessmentClient";

export default function AssessPage() {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Screening questionnaire</h1>
      <p style={{ color: "var(--text-muted)" }}>
        Answer honestly. Progress saves on your device while you answer — safe to switch apps.
        When finished, email yourself the results; we don&apos;t keep them on the website.
      </p>
      <AssessmentClient />
    </div>
  );
}
