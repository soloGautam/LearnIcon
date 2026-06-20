import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: any, res: any) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "GEMINI_API_KEY missing",
      });
    }

    const body = req.body || {};
    const userPrompt = body.message || "Build a simple project";

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

    const prompt = `
You are LearnIcon AI.

Return ONLY valid JSON.

Format:

{
  "overview": {
    "title": "",
    "content": ""
  },
  "steps": [
    {
      "title": "",
      "content": ""
    }
  ],
  "quiz": [
    {
      "question": "",
      "options": ["","","",""],
      "answer": ""
    }
  ]
}

Rules:
- overview = 1 item
- steps = exactly 5 items
- quiz = exactly 5 questions
- no markdown
- no explanations outside JSON

User Request:
${userPrompt}
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();

    return res.status(200).json({
      success: true,
      raw: text,
    });
  } catch (e: any) {
    console.error(e);

    return res.status(500).json({
      success: false,
      error: e?.message || "Unknown error",
    });
  }
}