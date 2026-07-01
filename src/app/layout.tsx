import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import LegacyStorageCleanup from "@/components/LegacyStorageCleanup";
import PageAssistantWidget from "@/components/PageAssistantWidget";
import { createSupabaseServer } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "PsycScope — 32-disorder psychological screening",
  description:
    "Screen 32 well-known psychological disorders with self-report questions and optional AI analysis. Screening only — not diagnosis. By 6x7.gr.",
  icons: { icon: "/favicon.ico" },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body>
        <div className="shell">
          <Header userEmail={user?.email} />
          <main>{children}</main>
        </div>
        <LegacyStorageCleanup />
        <PageAssistantWidget />
      </body>
    </html>
  );
}
