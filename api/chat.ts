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

IMPORTANT:

If user sends a greeting such as:
hi
hello
hey
good morning
good evening

Return:

{
  "type":"greeting",
  "message":"Hey 👋 I'm LearnIcon AI. Tell me what you'd like to build today."
}

If user is casually chatting and NOT asking to build something:

Return:

{
  "type":"chat",
  "message":"Normal conversational response"
}

ONLY generate a project when user wants to build, create, learn, code, design, launch or make something.

For project requests return:

{
  "type":"project",
  "overview":{
    "title":"",
    "content":""
  },
  "steps":[
    {
      "title":"",
      "content":""
    }
  ],
  "quiz":[
    {
      "question":"",
      "options":["","","",""],
      "answer":""
    }
  ]
}

Rules:
- overview exactly 1
- steps exactly 5
- quiz exactly 5
- no markdown
- no explanations outside JSON
- return valid JSON only

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