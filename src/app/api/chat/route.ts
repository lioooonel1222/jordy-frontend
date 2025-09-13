import { NextResponse } from "next/server";

type Body = { message: string };

export async function POST(req: Request) {
  try {
    const { message } = (await req.json()) as Body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "No message" }, { status: 400 });
    }

    // einfache Routing-Heuristik: lange/„Essay“-Prompts → Claude, sonst GPT
    const useClaude =
      message.length > 300 || /essay|aufsatz|analyse|bericht/i.test(message);

    let reply = "";
    let modelUsed: "gpt" | "claude" = "gpt";

    if (useClaude) {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY || "",
          "content-type": "application/json",
          // Pflicht-Header bei Anthropic:
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 800,
          messages: [{ role: "user", content: message }],
        }),
      });

      if (!r.ok) {
        const t = await r.text();
        throw new Error(`Anthropic error ${r.status}: ${t}`);
      }

      const data = await r.json();
      reply = data?.content?.[0]?.text || "Claude konnte nicht antworten.";
      modelUsed = "claude";
    } else {
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY || ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: message }],
        }),
      });

      if (!r.ok) {
        const t = await r.text();
        throw new Error(`OpenAI error ${r.status}: ${t}`);
      }

      const data = await r.json();
      reply =
        data?.choices?.[0]?.message?.content || "GPT konnte nicht antworten.";
      modelUsed = "gpt";
    }

    return NextResponse.json({ reply, model: modelUsed });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}
