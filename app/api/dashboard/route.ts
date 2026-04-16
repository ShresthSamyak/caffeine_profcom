import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  parseResponseData,
  computeSourceData,
  computeFrequencyData,
  computeSideEffectsData,
  computeDependencyData,
  dailyCaffeinePercent,
  type RawResponseRow,
} from "@/lib/parseResponses";

// ── Demo data ────────────────────────────────────────────────────────────────
const DEMO_RESPONSES = [
  {
    id: "d1",
    name: "Alice Chen",
    email: "alice@example.com",
    frequency: "Multiple times a day",
    source: "Coffee",
    timing: "Morning (8 am – 12 pm)",
    reasons: ["Boost energy levels", "Improve focus & concentration"],
    productivity: 5,
    sideEffects: ["Jitteriness / shakiness", "Sleep disruption / insomnia"],
    sleepHours: "5–6 hours",
    examUsage: "Yes, significantly more",
    dependency: 4,
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "d2",
    name: "Bob Smith",
    email: "bob@example.com",
    frequency: "Once a day",
    source: "Tea",
    timing: "Morning (8 am – 12 pm)",
    reasons: ["Enjoy the taste", "Social habit"],
    productivity: 3,
    sideEffects: ["Improved alertness (positive)"],
    sleepHours: "7–8 hours",
    examUsage: "No change",
    dependency: 2,
    submittedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "d3",
    name: "Carol Williams",
    email: "carol@example.com",
    frequency: "2–3 times a week",
    source: "Energy drinks",
    timing: "Afternoon (12 pm – 5 pm)",
    reasons: ["Combat fatigue / drowsiness", "Athletic or physical performance"],
    productivity: 4,
    sideEffects: ["Increased heart rate", "Anxiety or nervousness"],
    sleepHours: "6–7 hours",
    examUsage: "Yes, significantly more",
    dependency: 3,
    submittedAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "d4",
    name: "David Lee",
    email: "david@example.com",
    frequency: "Multiple times a day",
    source: "Coffee",
    timing: "Early morning (before 8 am)",
    reasons: ["Boost energy levels", "Improve focus & concentration", "Improve mood"],
    productivity: 4,
    sideEffects: ["Sleep disruption / insomnia", "Headaches (when not consumed)"],
    sleepHours: "5–6 hours",
    examUsage: "Yes, slightly more",
    dependency: 5,
    submittedAt: new Date(Date.now() - 345600000).toISOString(),
  },
  {
    id: "d5",
    name: "Eva Martinez",
    email: "eva@example.com",
    frequency: "Once a week or less",
    source: "Soft drinks / Soda",
    timing: "Afternoon (12 pm – 5 pm)",
    reasons: ["Enjoy the taste"],
    productivity: 2,
    sideEffects: ["None — no side effects"],
    sleepHours: "7–8 hours",
    examUsage: "No change",
    dependency: 1,
    submittedAt: new Date(Date.now() - 432000000).toISOString(),
  },
];

const DEMO_AGGREGATED = {
  totalResponses: 127,
  dailyCaffeinePercent: 68,
  sourceData: [
    { name: "Coffee", value: 54 },
    { name: "Tea", value: 23 },
    { name: "Energy drinks", value: 28 },
    { name: "Soft drinks", value: 12 },
    { name: "Pre-workout", value: 7 },
    { name: "Other", value: 3 },
  ],
  frequencyData: [
    { name: "Multiple/day", responses: 48, avgProductivity: 4.2 },
    { name: "Once/day", responses: 39, avgProductivity: 3.8 },
    { name: "2–3/week", responses: 22, avgProductivity: 3.1 },
    { name: "≤Once/week", responses: 11, avgProductivity: 2.9 },
    { name: "Never", responses: 7, avgProductivity: 2.4 },
  ],
  sideEffectsData: [
    { name: "Sleep disruption", count: 71 },
    { name: "Alertness", count: 89 },
    { name: "Jitteriness", count: 52 },
    { name: "Headaches", count: 44 },
    { name: "Heart rate", count: 38 },
    { name: "Anxiety", count: 29 },
    { name: "Digestive", count: 18 },
    { name: "None", count: 9 },
  ],
  dependencyData: [
    { name: "Strongly Disagree", value: 15 },
    { name: "Disagree", value: 22 },
    { name: "Neutral", value: 31 },
    { name: "Agree", value: 37 },
    { name: "Strongly Agree", value: 22 },
  ],
};

// ── Route ────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("x-dashboard-password");
  const password = process.env.DASHBOARD_PASSWORD ?? "admin123";

  if (authHeader !== password) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json({
      ...DEMO_AGGREGATED,
      responses: DEMO_RESPONSES,
      demo: true,
    });
  }

  try {
    // Fetch responses joined with user data
    const { data: rows, error } = await supabase
      .from("responses")
      .select("id, answers, created_at, users(name, email)")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase dashboard error (falling back to demo):", error.message);
      return NextResponse.json({
        ...DEMO_AGGREGATED,
        responses: DEMO_RESPONSES,
        demo: true,
      });
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json({
        ...DEMO_AGGREGATED,
        totalResponses: 0,
        responses: [],
        demo: false,
        empty: true,
      });
    }

    const parsed = (rows as unknown as RawResponseRow[]).map(parseResponseData);

    return NextResponse.json({
      totalResponses: parsed.length,
      dailyCaffeinePercent: dailyCaffeinePercent(parsed),
      sourceData: computeSourceData(parsed),
      frequencyData: computeFrequencyData(parsed),
      sideEffectsData: computeSideEffectsData(parsed),
      dependencyData: computeDependencyData(parsed),
      responses: parsed,
      demo: false,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return NextResponse.json({
      ...DEMO_AGGREGATED,
      responses: DEMO_RESPONSES,
      demo: true,
    });
  }
}
