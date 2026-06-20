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

Your goal is to help users build real projects step-by-step.

IMPORTANT RULES:

1. If the user is greeting:
Examples:
- hi
- hello
- hey
- good morning
- good evening

Return:

{
  "type":"greeting",
  "message":"Hey 👋 I'm LearnIcon AI. What would you like to build today?"
}

2. If the user is chatting casually and not asking to build, learn, create, code, design or launch something:

Return:

{
  "type":"chat",
  "message":"Helpful conversational response"
}

3. If the user wants to build something:

Return:

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
  "projectCompleted": false
}

Rules:
- overview exactly 1
- steps exactly 5
- each step actionable
- no markdown
- no text outside JSON

VERY IMPORTANT:

DO NOT generate quiz questions during project planning.

Quiz should ONLY be generated after the project is fully completed.

If the user explicitly says:
- project completed
- finished
- done
- completed all steps
- I built it

Then return:

{
  "type":"completed",
  "message":"Congratulations message",
  "quiz":[
    {
      "question":"",
      "options":["","","",""],
      "answer":""
    }
  ]
}

Rules for completed:
- exactly 5 quiz questions
- exactly 4 options each
- answer must match one option
- quiz tests knowledge from the project

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