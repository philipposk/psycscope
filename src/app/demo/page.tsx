import DemoClient from "@/components/DemoClient";

export const metadata = {
  title: "Example demo — PsycScope",
  description: "Sample screening results (not a real assessment).",
};

export default function DemoPage() {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Example screening results</h1>
      <DemoClient />
    </div>
  );
}
