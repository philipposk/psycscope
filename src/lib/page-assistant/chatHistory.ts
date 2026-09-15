import {
  supabaseChatHistoryAdapter,
  type ChatHistoryAdapter,
  type WidgetStrings,
} from "@page-assistant/widget";
import { createSupabaseClient } from "@/lib/supabase/client";

/** Rows this app writes to public.assistant_chats carry this `app` value. */
export const PSYC_CHAT_APP = "psycscope";

export interface PsycChatHistory {
  adapter: ChatHistoryAdapter;
  /** Calls `onChange` when someone signs in or out in this tab. Returns an unsubscribe. */
  onAuthChange(onChange: () => void): () => void;
}

/**
 * The backend for the assistant's "Save to my account" choice, or null when Supabase
 * isn't configured (the assistant then offers "this device" and "don't save" only).
 *
 * Built on the app's browser client, so every query runs as the signed-in user and
 * row-level security (supabase/migrations/0002_assistant_chats.sql) limits them to their
 * own rows. Never pass a service-role client here.
 *
 * The reference adapter's currentUserId() reads the signed-in user from the session. The
 * widget keys device-saved chats by it too, so on a shared browser each person only ever
 * sees their own.
 */
export function psycChatHistory(): PsycChatHistory | null {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  const supabase = createSupabaseClient();
  return {
    adapter: supabaseChatHistoryAdapter(supabase, { app: PSYC_CHAT_APP, retentionMonths: 12 }),
    onAuthChange(onChange) {
      const { data } = supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_IN" || event === "SIGNED_OUT") onChange();
      });
      return () => data.subscription.unsubscribe();
    },
  };
}

/**
 * Screening answers are health information, so saving chats to an account is opt-in and
 * the settings copy says plainly what that means. Everything else keeps the SDK's English.
 */
export const PSYC_HISTORY_STRINGS: Partial<WidgetStrings> = {
  historyModeAccountHint:
    "Only if you choose it. Your chats with the assistant, including anything you share about your mental health, are stored with your 6x7 account so you can open them on any device you sign in on. Only you can see them, and you can delete them at any time.",
  historyModeDeviceHint:
    "The default. Your chats stay in this browser only and are never sent to your account. On a shared computer, choose \"Don't save\".",
};
