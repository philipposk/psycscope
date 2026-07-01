"use client";

import { useCallback, useEffect, useState } from "react";
import { findAHelplineTopicUrl, type CountryHelplines } from "@/lib/helplines";

type HelplineResponse = {
  countryCode: string | null;
  country: CountryHelplines | null;
  findAHelplineUrl: string;
  globalUrl: string;
  source: string;
};

export default function CrisisHelp({ compact = false }: { compact?: boolean }) {
  const [data, setData] = useState<HelplineResponse | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoNote, setGeoNote] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/helplines")
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);

  const openFindAHelpline = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  function findHelpNearMe() {
    setGeoLoading(true);
    setGeoNote(null);
    if (!navigator.geolocation) {
      setGeoNote("Location not available in this browser — opening global directory.");
      openFindAHelpline(data?.globalUrl || "https://findahelpline.com");
      setGeoLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        // Find A Helpline ranks by location when opened; we don't send coords to our server.
        openFindAHelpline(data?.findAHelplineUrl || "https://findahelpline.com");
        setGeoNote("Opened Find A Helpline — they use your browser location locally, not our servers.");
        setGeoLoading(false);
      },
      () => {
        setGeoNote("Location denied — showing directory for your network region instead.");
        openFindAHelpline(data?.findAHelplineUrl || "https://findahelpline.com");
        setGeoLoading(false);
      },
      { timeout: 12000, maximumAge: 300000 },
    );
  }

  const c = data?.country;

  return (
    <div className={compact ? "" : "card"} style={{ marginTop: compact ? 0 : "1rem" }}>
      {!compact && <h2 style={{ marginTop: 0 }}>Crisis &amp; emotional support</h2>}
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: compact ? "0 0 0.75rem" : undefined }}>
        {c
          ? `Suggestions for ${c.name} (from your network region — approximate, not GPS).`
          : "Global directory — we could not detect your country from network alone."}
        {" "}
        Only you see your screening results; helpline numbers are public resources.
      </p>

      {c && (
        <ul style={{ margin: "0.5rem 0 1rem", paddingLeft: "1.2rem" }}>
          <li>
            <strong>Emergency:</strong> {c.emergency}
          </li>
          {c.lines.map((line) => (
            <li key={line.contact}>
              <strong>{line.name}:</strong> {line.contact}
              {line.hours ? ` (${line.hours})` : ""}
            </li>
          ))}
        </ul>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={findHelpNearMe}
          disabled={geoLoading}
        >
          {geoLoading ? "Opening…" : "Find help near me"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => openFindAHelpline(data?.findAHelplineUrl || "https://findahelpline.com")}
        >
          Browse {c?.name || "all"} helplines
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => openFindAHelpline(findAHelplineTopicUrl("suicide"))}
        >
          Suicide &amp; crisis lines
        </button>
      </div>

      {geoNote && (
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>{geoNote}</p>
      )}

      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.75rem", marginBottom: 0 }}>
        Directory powered by{" "}
        <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">
          Find A Helpline
        </a>{" "}
        (ThroughLine, 170+ countries). We do not store your location on our servers.
      </p>
    </div>
  );
}
