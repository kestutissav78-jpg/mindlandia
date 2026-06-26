import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const decision = body.decision || "";

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
You are an experienced startup COO.

Return ONLY JSON.

{
  "objectives": ["..."],
  "milestones": ["..."],
  "deliverables": ["..."],
  "risks": ["..."],
  "kpis": ["..."],
  "budget": ["..."]
}

Rules:
- 3–5 items per section.
- Keep every item under 80 characters.
- Practical, execution-focused.
- No explanations outside JSON.
`,
        },
        {
          role: "user",
          content: decision,
        },
      ],
      response_format: { type: "json_object" },
    });

    return Response.json(
      JSON.parse(response.choices[0]?.message?.content || "{}")
    );
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
