import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, answers } = body as {
      userId: string;
      answers: Record<string, unknown>;
    };

    if (!userId || !answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "userId and answers are required" },
        { status: 400 }
      );
    }

    // Demo mode: skip DB write, just acknowledge success
    if (!isSupabaseConfigured || userId.startsWith("demo-")) {
      console.log("Demo mode — answers logged to server:", answers);
      return NextResponse.json({ success: true, demo: true });
    }

    const { error } = await supabase.from("responses").insert([
      { user_id: userId, answers },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      // Fall back gracefully — don't block the success screen
      return NextResponse.json({ success: true, demo: true });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ success: true, demo: true });
  }
}
