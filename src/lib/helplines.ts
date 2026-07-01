export type HelplineLine = {
  name: string;
  contact: string;
  hours?: string;
};

export type CountryHelplines = {
  code: string;
  name: string;
  emergency: string;
  lines: HelplineLine[];
  /** findahelpline.com country path segment */
  findAHelpline: string;
};

/** Curated verified-style entries; crisis directory powered by ThroughLine / Find A Helpline. */
export const HELPLINES: Record<string, CountryHelplines> = {
  GR: {
    code: "GR",
    name: "Greece",
    emergency: "112",
    findAHelpline: "gr",
    lines: [
      { name: "Suicide prevention (Klimaka)", contact: "1018", hours: "24/7" },
      { name: "Emotional support line", contact: "10306" },
      { name: "National helpline for children", contact: "1056" },
    ],
  },
  DK: {
    code: "DK",
    name: "Denmark",
    emergency: "112",
    findAHelpline: "dk",
    lines: [
      { name: "Livslinien (suicide prevention)", contact: "70 20 12 01", hours: "24/7" },
      { name: "Psykiatrifonden rådgivning", contact: "39 25 25 25" },
    ],
  },
  US: {
    code: "US",
    name: "United States",
    emergency: "911",
    findAHelpline: "us",
    lines: [
      { name: "988 Suicide & Crisis Lifeline", contact: "988", hours: "24/7" },
      { name: "Crisis Text Line", contact: "Text HOME to 741741" },
    ],
  },
  GB: {
    code: "GB",
    name: "United Kingdom",
    emergency: "999",
    findAHelpline: "gb",
    lines: [
      { name: "Samaritans", contact: "116 123", hours: "24/7" },
      { name: "Shout (text)", contact: "Text SHOUT to 85258" },
    ],
  },
  IE: {
    code: "IE",
    name: "Ireland",
    emergency: "112",
    findAHelpline: "ie",
    lines: [
      { name: "Samaritans", contact: "116 123", hours: "24/7" },
    ],
  },
  DE: {
    code: "DE",
    name: "Germany",
    emergency: "112",
    findAHelpline: "de",
    lines: [
      { name: "Telefonseelsorge", contact: "0800 111 0 111", hours: "24/7" },
    ],
  },
  FR: {
    code: "FR",
    name: "France",
    emergency: "112",
    findAHelpline: "fr",
    lines: [
      { name: "Suicide Écoute", contact: "3114", hours: "24/7" },
    ],
  },
  NL: {
    code: "NL",
    name: "Netherlands",
    emergency: "112",
    findAHelpline: "nl",
    lines: [
      { name: "113 Zelfmoordpreventie", contact: "0800 0113", hours: "24/7" },
    ],
  },
  SE: {
    code: "SE",
    name: "Sweden",
    emergency: "112",
    findAHelpline: "se",
    lines: [
      { name: "Mind Självmordslinjen", contact: "90101", hours: "24/7" },
    ],
  },
  NO: {
    code: "NO",
    name: "Norway",
    emergency: "112",
    findAHelpline: "no",
    lines: [
      { name: "Mental Helse Hjelpetelefonen", contact: "116 123", hours: "24/7" },
    ],
  },
  AU: {
    code: "AU",
    name: "Australia",
    emergency: "000",
    findAHelpline: "au",
    lines: [
      { name: "Lifeline", contact: "13 11 14", hours: "24/7" },
    ],
  },
  CA: {
    code: "CA",
    name: "Canada",
    emergency: "911",
    findAHelpline: "ca",
    lines: [
      { name: "988 Suicide Crisis Helpline", contact: "988", hours: "24/7" },
    ],
  },
  IN: {
    code: "IN",
    name: "India",
    emergency: "112",
    findAHelpline: "in",
    lines: [
      { name: "Kiran mental health helpline", contact: "1800-599-0019", hours: "24/7" },
    ],
  },
};

export const GLOBAL_HELPLINE_URL = "https://findahelpline.com";

export function helplinesForCountry(code: string | null | undefined): CountryHelplines | null {
  if (!code) return null;
  return HELPLINES[code.toUpperCase()] ?? null;
}

export function findAHelplineUrl(country?: CountryHelplines | null): string {
  if (country?.findAHelpline) {
    return `${GLOBAL_HELPLINE_URL}/countries/${country.findAHelpline}`;
  }
  return GLOBAL_HELPLINE_URL;
}

export function findAHelplineTopicUrl(topic = "suicide"): string {
  return `${GLOBAL_HELPLINE_URL}/topics/${topic}`;
}
