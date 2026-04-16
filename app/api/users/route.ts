import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

function demoUserId() {
  return `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email } = body as { name: string; email: string };

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Demo mode: return a fake UUID if Supabase isn't configured
    if (!isSupabaseConfigured) {
      return NextResponse.json({ userId: demoUserId(), demo: true });
    }

    // Check if email already exists
    const { data: existing, error: lookupError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    // If Supabase auth fails (bad key, table missing, etc.) — fall back to demo
    if (lookupError) {
      const code = (lookupError as { code?: string }).code;
      if (code === "42501" || code === "PGRST301" || code === "401") {
        console.warn("Supabase unavailable, falling back to demo mode:", lookupError.message);
        return NextResponse.json({ userId: demoUserId(), demo: true });
      }
      // Table doesn't exist yet
      if (code === "42P01" || lookupError.message?.includes("does not exist")) {
        console.warn("Supabase table missing — run supabase-schema.sql first:", lookupError.message);
        return NextResponse.json({ userId: demoUserId(), demo: true });
      }
    }

    if (existing) {
      return NextResponse.json({ userId: existing.id });
    }

    const { data, error } = await supabase
      .from("users")
      .insert([{ name: name.trim(), email: email.trim().toLowerCase() }])
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      // Fall back to demo rather than hard-failing
      return NextResponse.json({ userId: demoUserId(), demo: true });
    }

    return NextResponse.json({ userId: data.id });
  } catch (err) {
    console.error("API error:", err);
    // Never hard-fail the survey — always let the user proceed
    return NextResponse.json({ userId: demoUserId(), demo: true });
  }
}
