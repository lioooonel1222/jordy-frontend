import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    hasOpenAI: Boolean(process.env.OPENAI_API_KEY),
    hasAnthropic: Boolean(process.env.ANTHROPIC_API_KEY),
    // keine Key-Werte anzeigen! nur Booleans
  });
}
