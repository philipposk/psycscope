import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import LegacyStorageCleanup from "@/components/LegacyStorageCleanup";
import PageAssistantWidget from "@/components/PageAssistantWidget";
import { createSupabaseServer } from "@/lib/supabase/server";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://psyc.6x7.gr").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "PsycScope",
  openGraph: {
    type: "website",
    siteName: "PsycScope",
    title: "PsycScope — 32-disorder psychological screening",
    description:
      "Screen 32 well-known psychological disorders with self-report questions and optional AI analysis. Screening only — not diagnosis.",
  },
  twitter: { card: "summary" },
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
