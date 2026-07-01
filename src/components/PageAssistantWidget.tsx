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
