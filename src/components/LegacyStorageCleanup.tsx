"use client";

import { useEffect } from "react";

/** Drop legacy local history blob — we no longer store completed results in localStorage. */
export default function LegacyStorageCleanup() {
  useEffect(() => {
    try {
      localStorage.removeItem("psycscope-assessment-v1");
    } catch {
      // ignore
    }
  }, []);
  return null;
}
