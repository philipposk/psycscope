import AssessmentClient from "@/components/AssessmentClient";

export default function AssessPage() {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Screening questionnaire</h1>
      <p style={{ color: "var(--text-muted)" }}>
        Answer honestly. There are no wrong answers. You can pause and return later — progress
        is kept in this browser until you finish.
      </p>
      <AssessmentClient />
    </div>
  );
}
