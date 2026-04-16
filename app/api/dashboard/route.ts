import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

// Demo data for when Supabase is not configured
const DEMO_DATA = {
  totalResponses: 127,
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
    { name: "2-3/week", responses: 22, avgProductivity: 3.1 },
    { name: "Weekly", responses: 11, avgProductivity: 2.9 },
    { name: "Never", responses: 7, avgProductivity: 2.4 },
  ],
  sideEffectsData: [
    { name: "Jitteriness", count: 52 },
    { name: "Heart rate", count: 38 },
    { name: "Sleep disruption", count: 71 },
    { name: "Anxiety", count: 29 },
    { name: "Headaches", count: 44 },
    { name: "Alertness", count: 89 },
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

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("x-dashboard-password");
  const password = process.env.DASHBOARD_PASSWORD ?? "admin123";

  if (authHeader !== password) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json({ ...DEMO_DATA, demo: true });
  }

  try {
    const { data: responses, error } = await supabase
      .from("responses")
      .select("answers, created_at");

    if (error) {
      // Table missing, auth failure, or any Supabase issue → show demo data
      console.warn("Supabase dashboard error (falling back to demo):", error.message);
      return NextResponse.json({ ...DEMO_DATA, demo: true });
    }

    if (!responses || responses.length === 0) {
      return NextResponse.json({ ...DEMO_DATA, demo: true, totalResponses: 0 });
    }

    // Aggregate source data (question 2)
    const sourceCounts: Record<string, number> = {};
    const frequencyCounts: Record<string, { count: number; prodSum: number }> = {};
    const sideEffectCounts: Record<string, number> = {};

    for (const row of responses) {
      const a = row.answers as Record<string, unknown>;

      // Source (Q2)
      const source = a[2] as string | undefined;
      if (source) sourceCounts[source] = (sourceCounts[source] ?? 0) + 1;

      // Frequency + productivity (Q1 + Q5)
      const freq = a[1] as string | undefined;
      const prod = a[5] as number | undefined;
      if (freq) {
        if (!frequencyCounts[freq]) frequencyCounts[freq] = { count: 0, prodSum: 0 };
        frequencyCounts[freq].count++;
        if (prod) frequencyCounts[freq].prodSum += prod;
      }

      // Side effects (Q6)
      const effects = a[6] as string[] | undefined;
      if (Array.isArray(effects)) {
        effects.forEach((e) => {
          const shortName = e.split(" /")[0].split(" (")[0].trim();
          sideEffectCounts[shortName] = (sideEffectCounts[shortName] ?? 0) + 1;
        });
      }
    }

    const sourceData = Object.entries(sourceCounts).map(([name, value]) => ({
      name,
      value,
    }));

    const frequencyData = Object.entries(frequencyCounts).map(
      ([name, { count, prodSum }]) => ({
        name: name.split(" ")[0],
        responses: count,
        avgProductivity: count > 0 ? Math.round((prodSum / count) * 10) / 10 : 0,
      })
    );

    const sideEffectsData = Object.entries(sideEffectCounts).map(
      ([name, count]) => ({ name, count })
    );

    return NextResponse.json({
      totalResponses: responses.length,
      sourceData,
      frequencyData,
      sideEffectsData,
      dependencyData: DEMO_DATA.dependencyData,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
