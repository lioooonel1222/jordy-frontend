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
      system: systemPrompt, // <-- WICHTIG: Systemprompt hier oben
      messages: [
        { role: "user", content: cleanMsg }, // <-- nur noch User-Message
      ],
    }),
  });

  if (!r.ok) {
    const t = await r.text();
    throw new Error(`Anthropic error ${r.status}: ${t}`);
  }

  const data = await r.json();
  reply = data?.content?.[0]?.text || "Claude gab keine Antwort zurück.";
}
