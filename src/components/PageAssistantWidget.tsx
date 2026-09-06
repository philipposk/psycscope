"use client";

import { useEffect } from "react";
import { PageAssistant } from "@page-assistant/widget";
import { PSYC_PA_KNOWLEDGE, psycCapabilities } from "@/lib/page-assistant/capabilities";

export default function PageAssistantWidget() {
  useEffect(() => {
    const base = window.location.origin;
    PageAssistant.init({
      serverUrl: `${base}/api/pa`,
      appName: "PsycScope",
      persona:
        "You help users understand psychological screening on PsycScope. Be warm and careful — never diagnose. Only state facts from tools or the page. Urge professional help when appropriate.",
      knowledge: PSYC_PA_KNOWLEDGE,
      knowledgeUrl: `${base}/api/pa/llm.txt`,
      voice: true,
      settingsPageUrl: "/about#assistant",
      settingsStorageKey: "psyc_pa_settings",
      /* The assistant is here to explain screening, not to become a second app.
         The SDK grew a chat-history sidebar and a larger settings panel after
         the version PsycScope was built against; both are held back so the
         panel people already know does not change shape under them. This
         update is the microphone fix, not a redesign. */
      disableChatHistory: true,
      useExtendedSettings: false,
      /* No `lang` and no `strings`: PsycScope is written in English only —
         one `<html lang="en">`, no locale routing, no translations — so the
         SDK's English defaults and its own language resolution are correct. */
      autoScan: true,
      capabilities: psycCapabilities(),
      suggestions: [
        "What does this screening measure?",
        "Explain my latest results",
        "What's the difference between screening and diagnosis?",
        "Start the assessment",
      ],
      greeting: "Hi — I can explain disorders, your results, or guide you through screening.",
      getPageState: () => ({
        path: typeof window !== "undefined" ? window.location.pathname : "/",
      }),
    });
  }, []);
  return null;
}
