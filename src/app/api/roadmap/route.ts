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
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
Return ONLY JSON.

{
  "roadmap": [
    {
      "stage": "Validation",
      "goal": "Validate demand"
    }
  ]
}

Rules:
- 5 to 7 stages
- Short goals
- Logical order
- Startup focused
`
        },
        {
          role: "user",
          content: decision,
        },
      ],
    });

    const json =
      response.choices[0]?.message?.content || '{"roadmap":[]}';

    return Response.json(JSON.parse(json));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}
