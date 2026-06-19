export const config = { runtime: "nodejs" };

const SYSTEM_PROMPT = `You are LearnIcon's AI building companion. Help learners build projects in 5 clear steps. Respond ONLY with JSON:
{
  "intro": { "title": string, "body": string, "encouragement": string },
  "steps": [ { "title": string, "body": string } x 5 ],
  "projectSuggestion": null | { "name": string, "desc": string, "buildIn": "app" | "external", "recommendedTools": string[] }
}`;

export default async function handler(req: Request): Promise<Response> {
  console.log("STEP 1: Handler entered");

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY missing");
    return Response.json(
      { error: "ANTHROPIC_API_KEY missing" },
      { status: 500 }
    );
  }

  try {
    console.log("STEP 2: Parsing request body");

    const body = await req.json() as {
      history: { role: string; content: string }[];
      hasProject?: boolean;
      project?: { name: string; desc: string } | null;
    };

    console.log(
      "STEP 3: Body parsed. History length:",
      body.history?.length || 0
    );

    const history = Array.isArray(body.history) ? body.history : [];

    // Keep only last 20 messages
    const trimmedHistory = history.slice(-20);

    const messages = trimmedHistory.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: String(m.content || "").slice(0, 4000),
    }));

    console.log(
      "STEP 4: Messages prepared:",
      messages.length
    );

    const projectContext =
      body.hasProject && body.project
        ? `User is working on: ${body.project.name}. Don't suggest new projects.`
        : "If user describes an idea, suggest a project.";

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      console.error("STEP 5: Anthropic timeout");
      controller.abort();
    }, 25000);

    console.log("STEP 6: Calling Anthropic");

    const response = await fetch(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "claude-3-5-haiku-latest",
          max_tokens: 1024,
          system: `${SYSTEM_PROMPT}\n${projectContext}\nRespond ONLY with JSON.`,
          messages,
        }),
      }
    );

    clearTimeout(timeout);

    console.log(
      "STEP 7: Anthropic responded",
      response.status
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "STEP 8: Anthropic error",
        response.status,
        errorText
      );

      return Response.json(
        {
          error: `Anthropic ${response.status}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json() as any;

    console.log("STEP 9: Response JSON parsed");

    const text =
      data?.content?.find((x: any) => x.type === "text")?.text || "{}";

    let parsed: any;

    try {
      parsed = JSON.parse(text);
    } catch {
      console.warn("STEP 10: JSON parse fallback");

      parsed = {
        intro: {
          title: "AI Response",
          body: text.slice(0, 500),
          encouragement: "Keep building!",
        },
        steps: Array.from({ length: 5 }, (_, i) => ({
          title: `Step ${i + 1}`,
          body: "",
        })),
      };
    }

    const intro = parsed.intro ?? {
      title: "Let's build",
      body: "Here's a plan",
      encouragement: "You got this",
    };

    const steps = Array.isArray(parsed.steps)
      ? parsed.steps.slice(0, 5)
      : [];

    while (steps.length < 5) {
      steps.push({
        title: `Step ${steps.length + 1}`,
        body: "",
      });
    }

    const creditCost =
      parsed.projectSuggestion?.buildIn === "app"
        ? 7
        : text.length > 1200
        ? 5
        : 2;

    console.log("STEP 11: Returning response");

    return Response.json({
      intro,
      steps,
      projectSuggestion: parsed.projectSuggestion ?? null,
      creditCost,
    });
  } catch (e: any) {
    console.error("CHAT FAILURE:", e);

    return Response.json(
      {
        error: e?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}