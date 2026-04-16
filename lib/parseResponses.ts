export interface ParsedResponse {
  id: string;
  name: string;
  email: string;
  frequency: string;
  source: string;
  timing: string;
  reasons: string[];
  productivity: number;
  sideEffects: string[];
  sleepHours: string;
  examUsage: string;
  dependency: number;
  submittedAt: string;
}

export interface RawResponseRow {
  id: string;
  answers: Record<string, unknown>;
  created_at: string;
  users: { name: string; email: string } | null;
}

export function parseResponseData(row: RawResponseRow): ParsedResponse {
  const a = row.answers;
  return {
    id: row.id,
    name: row.users?.name ?? "Anonymous",
    email: row.users?.email ?? "—",
    frequency: (a[1] as string) ?? "—",
    source: (a[2] as string) ?? "—",
    timing: (a[3] as string) ?? "—",
    reasons: Array.isArray(a[4]) ? (a[4] as string[]) : [],
    productivity: typeof a[5] === "number" ? (a[5] as number) : 0,
    sideEffects: Array.isArray(a[6]) ? (a[6] as string[]) : [],
    sleepHours: (a[7] as string) ?? "—",
    examUsage: (a[8] as string) ?? "—",
    dependency: typeof a[9] === "number" ? (a[9] as number) : 0,
    submittedAt: row.created_at,
  };
}

// ── Aggregation helpers ──────────────────────────────────────────────────────

export function computeSourceData(rows: ParsedResponse[]) {
  const counts: Record<string, number> = {};
  rows.forEach((r) => {
    if (r.source && r.source !== "—") {
      counts[r.source] = (counts[r.source] ?? 0) + 1;
    }
  });
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function computeFrequencyData(rows: ParsedResponse[]) {
  const map: Record<string, { count: number; prodSum: number }> = {};
  rows.forEach((r) => {
    if (!r.frequency || r.frequency === "—") return;
    const key = r.frequency.split("–")[0].trim(); // shorten "2–3 times a week" → "2"
    const shortKey =
      r.frequency === "Multiple times a day"
        ? "Multiple/day"
        : r.frequency === "Once a day"
        ? "Once/day"
        : r.frequency === "2–3 times a week"
        ? "2–3/week"
        : r.frequency === "Once a week or less"
        ? "≤Once/week"
        : r.frequency;
    if (!map[shortKey]) map[shortKey] = { count: 0, prodSum: 0 };
    map[shortKey].count++;
    if (r.productivity > 0) map[shortKey].prodSum += r.productivity;
  });
  return Object.entries(map).map(([name, { count, prodSum }]) => ({
    name,
    responses: count,
    avgProductivity: count > 0 ? Math.round((prodSum / count) * 10) / 10 : 0,
  }));
}

export function computeSideEffectsData(rows: ParsedResponse[]) {
  const counts: Record<string, number> = {};
  rows.forEach((r) => {
    r.sideEffects.forEach((e) => {
      const short = e.split(" /")[0].split(" (")[0].trim();
      counts[short] = (counts[short] ?? 0) + 1;
    });
  });
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function computeDependencyData(rows: ParsedResponse[]) {
  const labels = [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ];
  const counts = [0, 0, 0, 0, 0];
  rows.forEach((r) => {
    if (r.dependency >= 1 && r.dependency <= 5) {
      counts[r.dependency - 1]++;
    }
  });
  return labels.map((name, i) => ({ name, value: counts[i] }));
}

export function dailyCaffeinePercent(rows: ParsedResponse[]): number {
  if (rows.length === 0) return 0;
  const daily = rows.filter(
    (r) =>
      r.frequency === "Multiple times a day" || r.frequency === "Once a day"
  ).length;
  return Math.round((daily / rows.length) * 100);
}

// ── CSV export ───────────────────────────────────────────────────────────────

export function toCSV(rows: ParsedResponse[]): string {
  const header = [
    "Name",
    "Email",
    "Frequency",
    "Primary Source",
    "Timing",
    "Reasons",
    "Productivity (1-5)",
    "Side Effects",
    "Sleep Hours",
    "Exam Usage",
    "Dependency (1-5)",
    "Submitted At",
  ];
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [
      escape(r.name),
      escape(r.email),
      escape(r.frequency),
      escape(r.source),
      escape(r.timing),
      escape(r.reasons.join("; ")),
      r.productivity.toString(),
      escape(r.sideEffects.join("; ")),
      escape(r.sleepHours),
      escape(r.examUsage),
      r.dependency.toString(),
      escape(new Date(r.submittedAt).toLocaleString()),
    ].join(",")
  );
  return [header.join(","), ...lines].join("\n");
}

export function downloadCSV(rows: ParsedResponse[]) {
  const csv = toCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `caffeine-survey-responses-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
