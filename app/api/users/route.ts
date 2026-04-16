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

    if (!isSupabaseConfigured) {
      return NextResponse.json({ userId: demoUserId(), demo: true });
    }

    // Look up existing user
    const { data: existing, error: lookupError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (lookupError) {
      const code = (lookupError as { code?: string }).code;
      if (
        code === "42501" ||
        code === "PGRST301" ||
        code === "401" ||
        code === "42P01" ||
        lookupError.message?.includes("does not exist")
      ) {
        console.warn("Supabase unavailable, falling back to demo:", lookupError.message);
        return NextResponse.json({ userId: demoUserId(), demo: true });
      }
    }

    if (existing) {
      // Check if this user already submitted a response
      const { data: existingResponse } = await supabase
        .from("responses")
        .select("id")
        .eq("user_id", existing.id)
        .maybeSingle();

      if (existingResponse) {
        return NextResponse.json(
          {
            error: "survey_completed",
            message:
              "You have already completed this survey. Each email can only participate once.",
          },
          { status: 409 }
        );
      }

      // User exists but hasn't completed survey — let them continue
      return NextResponse.json({ userId: existing.id });
    }

    // New user — insert
    const { data, error } = await supabase
      .from("users")
      .insert([{ name: name.trim(), email: email.trim().toLowerCase() }])
      .select("id")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ userId: demoUserId(), demo: true });
    }

    return NextResponse.json({ userId: data.id });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ userId: demoUserId(), demo: true });
  }
}
