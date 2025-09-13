import { NextResponse } from "next/server";

type Body = { message: string };

export async function POST(req: Request) {
  try {
    const { message } = (await req.json()) as Body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "No message" }, { status: 400 });
    }

    const forceGPT = message.trim().toLowerCase().startsWith("!gpt ");
    const forceClaude = message.trim().toLowerCase().startsWith("!claude ");

    // Default-Heuristik (wenn nicht erzwungen):
    const heuristicClaude =
      message.length > 300 || /essay|aufsatz|analyse|bericht/i.test(message);

    // Provider bestimmen
    const useClaude = forceClaude || (!forceGPT && heuristicClaude);
    let reply = "";
    let modelUsed: "gpt" | "claude" = useClaude ? "claude" : "gpt";

    if (useClaude) {
      const key = process.env.ANTHROPIC_API_KEY;
      if (!key) {
        return NextResponse.json(
          { error: "ANTHROPIC_API_KEY missing" },
          { status: 500 }
        );
      }

      const cleanMsg = forceClaude ? message.replace(/^!claude\s*/i, "") : message;

      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": key,
          "content-type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 800,
          messages: [{ role: "user", content: cleanMsg }],
        }),
      });

      if (!r.ok) {
        const t = await r.text();
        throw new Error(`Anthropic error ${r.status}: ${t}`);
      }

      const data = await r.json();
      reply = data?.content?.[0]?.text || "Claude gab keine Antwort zurück.";
    } else {
      const key = process.env.OPENAI_API_KEY;
      if (!key) {
        return NextResponse.json(
          { error: "OPENAI_API_KEY missing" },
          { status: 500 }
        );
      }

      const cleanMsg = forceGPT ? message.replace(/^!gpt\s*/i, "") : message;

      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: cleanMsg }],
        }),
      });

      if (!r.ok) {
        const t = await r.text();
        throw new Error(`OpenAI error ${r.status}: ${t}`);
      }

      const data = await r.json();
      reply = data?.choices?.[0]?.message?.content || "GPT gab keine Antwort zurück.";
    }

    return NextResponse.json({ reply, model: modelUsed });
  } catch (err: any) {
    console.error("CHAT API ERROR:", err?.message || err);
    return NextResponse.json(
      { error: "Server error", detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}
