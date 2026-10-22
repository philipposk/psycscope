import type { Metadata } from "next";
import { safeNext } from "@/lib/safe-next.mjs";
import SignInForm from "./SignInForm";

export const metadata: Metadata = { title: "Sign in · PsycScope", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function SignInPage({ searchParams }: Props) {
  const sp = await searchParams;
  return <SignInForm next={safeNext(typeof sp.next === "string" ? sp.next : null, "/")} linkFailed={Boolean(sp.error)} />;
}
