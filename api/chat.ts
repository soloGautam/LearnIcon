export const config = { runtime: "nodejs" };

const SYSTEM_PROMPT = `You are LearnIcon's AI building companion. You help learners turn ideas into shipped projects.

Output rules — VERY IMPORTANT:
- Always respond with a JSON object matching the schema below. No prose, no markdown fences, only JSON.
- "intro" is a friendly overview: what we will build, the high-level approach, and one short line of encouragement.
- "steps" must contain exactly 5 entries — concrete, actionable, in order.

Behaviour rules:
- If hasProject is false AND the user describes an idea, generate "projectSuggestion" with name, short desc, and buildIn = "app" if it's an app/code project, otherwise "external".
- If the project is code/app-related (buildIn = "app"), tell the user to stay inside LearnIcon and use the in-app Code Studio.
- If the project is non-code (buildIn = "external"), recommend FREE tools first, paid tools only as a secondary fallback. List 2-4 in projectSuggestion.recommendedTools.
- For external projects, remind the user to import their finished files back into the LearnIcon project so they can earn XP and be discovered by partner companies.
- If hasProject is true, do NOT propose a new project — only help refine and execute on the existing one.

Schema:
{
  "intro": { "title": string, "body": string, "encouragement": string },
  "steps": [ { "title": string, "body": string } x 5 ],
  "projectSuggestion": { "name": string, "desc": string, "buildIn": "app" | "external", "recommendedTools": string[] } | null
}`;

type Msg = { role: "user" | "assistant"; content: string };

interface Body {
  history: Msg[];
  hasProject: boolean;
  project: { name: string; desc: string; buildIn?: string } | null;
}

const MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";

export async function POST(req: Request): Promise<Response> {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "GEMINI_API_KEY is not configured. Add it to Vercel → Settings → Environment Variables." },
      { status: 500, headers: corsHeaders }
    );
  }

  try {
    const body = (await req.json()) as Body;
    const contextLine =
      body.hasProject && body.project
        ? `The user is working inside an existing project named "${body.project.name}" — ${body.project.desc}. Do not propose a new project.`
        : "The user has no active project. If their message describes an idea, suggest one.";

    const systemText = `${SYSTEM_PROMPT}\n\n${contextLine}\n\nRespond now with ONLY the JSON object.`;

    const contents = body.history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { role: "system", parts: [{ text: systemText }] },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!geminiRes.ok) {
      const status = geminiRes.status;
      const message =
        status === 429
          ? "Rate limit hit — please wait and try again."
          : status === 401 || status === 403
            ? "Invalid GEMINI_API_KEY. Check your Vercel environment variables."
            : status === 400
              ? "Bad request to Gemini API."
              : "Gemini request failed.";
      return Response.json({ error: message }, { status, headers: corsHeaders });
    }

    const data = (await geminiRes.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const content =
      data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "{}";

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(content);
    } catch {
      const start = content.indexOf("{");
      const end = content.lastIndexOf("}");
      if (start >= 0 && end > start) {
        try {
          parsed = JSON.parse(content.slice(start, end + 1));
        } catch {
          parsed = {};
        }
      } else {
        parsed = {};
      }
    }

    const intro =
      (parsed as any).intro ?? {
        title: "Here's the plan",
        body: String(content).slice(0, 500),
        encouragement: "Let's build it.",
      };
    const stepsRaw = Array.isArray((parsed as any).steps) ? (parsed as any).steps : [];
    const steps = stepsRaw.slice(0, 5).map((s: any, i: number) => ({
      title: String(s?.title ?? `Step ${i + 1}`),
      body: String(s?.body ?? ""),
    }));
    while (steps.length < 5) {
      steps.push({ title: `Step ${steps.length + 1}`, body: "" });
    }

    const projectSuggestion = (parsed as any).projectSuggestion ?? null;

    const totalChars =
      (intro?.body?.length ?? 0) + steps.reduce((acc: number, s: any) => acc + (s.body?.length ?? 0), 0);
    let creditCost = 2;
    if (totalChars > 1200) creditCost = 5;
    if (projectSuggestion?.buildIn === "app") creditCost = 7;

    return Response.json(
      { intro, steps, projectSuggestion, creditCost },
      { headers: corsHeaders }
    );
  } catch (e: any) {
    const message = e?.message ?? "Unknown error";
    return Response.json({ error: message }, { status: 500, headers: corsHeaders });
  }
}
