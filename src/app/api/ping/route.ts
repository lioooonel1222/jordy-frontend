import { NextResponse } from "next/server";

type Body = { message: string };

export async function POST(req: Request) {
  try {
    const { message } = (await req.json()) as Body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "No message" }, { status: 400 });
    }

    // einfache Heuristik: lange Texte oder "essay" → Claude
    const useClaude =
      message.length > 300 || /essay|aufsatz|analyse|bericht/i.test(message);

    let reply = "";
    let modelUsed: "gpt" | "claude" = useClaude ? "claude" : "gpt";

    if (useClaude) {
      if (!process.env.ANTHROPIC_API_KEY) {
        return NextResponse.json(
          { error: "ANTHROPIC_API_KEY fehlt" },
          { status: 500 }
        );
      }

      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "content-type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20240620",
          max_tokens: 500,
          messages: [{ role: "user", content: message }],
        }),
      });

      const text = await r.text();
      if (!r.ok) {
        return NextResponse.json(
          { error: "Claude Error", status: r.status, detail: text },
          { status: 500 }
        );
      }

      const data = JSON.parse(text);
      reply = data?.content?.[0]?.text || "Claude keine Antwort.";
    } else {
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json(
          { error: "OPENAI_API_KEY fehlt" },
          { status: 500 }
        );
      }

      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: message }],
        }),
      });

      const text = await r.text();
      if (!r.ok) {
        return NextResponse.json(
          { error: "OpenAI Error", status: r.status, detail: text },
          { status: 500 }
        );
      }

      const data = JSON.parse(text);
      reply =
        data?.choices?.[0]?.message?.content || "GPT keine Antwort.";
    }

    return NextResponse.json({ reply, model: modelUsed });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server Exception", detail: String(err?.message || err) },
      { status: 500 }
    );
  }
}
