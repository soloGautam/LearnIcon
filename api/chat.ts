export const config = { runtime: "nodejs" };

const SYSTEM_PROMPT = `You are LearnIcon's AI building companion. Help learners build projects in 5 clear steps. Respond ONLY with JSON:
{
  "intro": { "title": string, "body": string, "encouragement": string },
  "steps": [ { "title": string, "body": string } x 5 ],
  "projectSuggestion": null | { "name": string, "desc": string, "buildIn": "app" | "external", "recommendedTools": string[] }
}`;

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "ANTHROPIC_API_KEY missing" }, { status: 500 });
  }

  try {
    const body = await req.json() as {
      history: { role: string; content: string }[];
      hasProject?: boolean;
      project?: { name: string; desc: string } | null;
    };

    const messages = body.history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const projectContext = body.hasProject && body.project
      ? `User is working on: ${body.project.name}. Don't suggest new projects.`
      : "If user describes an idea, suggest a project.";

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20241022",
        max_tokens: 1024,
        system: `${SYSTEM_PROMPT}\n${projectContext}\nRespond ONLY with JSON.`,
        messages,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      const error = await response.json().catch(() => ({}));
      return Response.json(
        { error: `Claude API ${status}: ${error.error?.message || "error"}` },
        { status }
      );
    }

    const data = await response.json() as { content?: { type: string; text?: string }[] };
    const text = data.content?.find((b) => b.type === "text")?.text || "{}";

    let parsed: any = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start >= 0 && end > start) {
        try {
          parsed = JSON.parse(text.slice(start, end + 1));
        } catch {
          // Return fallback
          parsed = {
            intro: { title: "Plan", body: text.slice(0, 200), encouragement: "Let's build!" },
            steps: Array.from({ length: 5 }, (_, i) => ({ title: `Step ${i + 1}`, body: "" })),
          };
        }
      }
    }

    const intro = parsed.intro ?? { title: "Here's the plan", body: "Let's start", encouragement: "Go!" };
    const steps = (parsed.steps ?? []).slice(0, 5);
    while (steps.length < 5) steps.push({ title: `Step ${steps.length + 1}`, body: "" });

    const creditCost = parsed.projectSuggestion?.buildIn === "app" ? 7 : (text.length > 1200 ? 5 : 2);

    return Response.json({
      intro,
      steps,
      projectSuggestion: parsed.projectSuggestion ?? null,
      creditCost,
    });
  } catch (e: any) {
    console.error("Chat error:", e?.message);
    return Response.json(
      { error: `Error: ${e?.message || "unknown"}` },
      { status: 500 }
    );
  }
}
