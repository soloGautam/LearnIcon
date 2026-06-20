import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req: any, res: any) {
  try {
    const msg = await anthropic.messages.create({
      model: "claude-haiku-4-5-20241022",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: "Reply with only: LearnIcon Claude Connected",
        },
      ],
    });

    let text = "No response";

    if (
      msg.content.length > 0 &&
      msg.content[0].type === "text"
    ) {
      text = msg.content[0].text;
    }

    return res.status(200).json({
      success: true,
      reply: text,
    });
  } catch (e: any) {
    console.error(e);

    return res.status(500).json({
      success: false,
      error: e?.message || "Unknown error",
    });
  }
}