"use client";

import { useEffect } from "react";
import { PageAssistant } from "@page-assistant/widget";
import { PSYC_PA_KNOWLEDGE, psycCapabilities } from "@/lib/page-assistant/capabilities";
import { PSYC_HISTORY_STRINGS, psycChatHistory } from "@/lib/page-assistant/chatHistory";

export default function PageAssistantWidget() {
  useEffect(() => {
    const base = window.location.origin;
    // Null when Supabase isn't configured: settings then offers device and off only.
    const history = psycChatHistory();
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
      /* Chat history: people choose in the assistant's settings (Data tab) between
         "Save on this device", "Save to my account" and "Don't save". What people tell
         a screening assistant is health information, so chats stay in this browser
         unless the user explicitly picks their account; signed-out visitors get the
         same device default. Device chats are kept per signed-in person, and chats
         made while signed out are never offered to whoever signs in next — this may
         be a shared computer. Account chats are deleted after 12 months without
         activity (supabase/migrations/0002_assistant_chats.sql). */
      chatHistoryMode: "device",
      chatHistoryAdapter: history?.adapter,
      offerSignedOutChats: false,
      onChatHistoryError: (e) => console.warn("[assistant] chat history:", e),
      /* The history choice lives in the extended settings panel, so that panel is
         back on. Its model picker stays hidden, as it was in the smaller panel. */
      showModelPicker: false,
      /* No `lang`: PsycScope is written in English only — one `<html lang="en">`,
         no locale routing — so the SDK's own language resolution is correct. The
         only strings overridden are the history hints, to make the opt-in plain. */
      strings: PSYC_HISTORY_STRINGS,
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
    // Sign-in on /sign-in happens without a page load; re-check whose chats to show.
    return history?.onAuthChange(() => void PageAssistant.refreshChatHistory());
  }, []);
  return null;
}
