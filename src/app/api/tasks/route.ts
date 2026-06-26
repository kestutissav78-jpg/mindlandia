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
Convert a council decision into project tasks.

Return ONLY JSON.

{
  "tasks": [
    {
      "title": "Short task title",
      "priority": "High",
      "bucket": "This Week"
    }
  ]
}

Rules:
- 5 to 8 tasks
- Short task titles
- Max 60 characters
- Priority = High, Medium or Low
- Bucket = This Week, Next Week or Blocked
`
        },
        {
          role: "user",
          content: decision,
        },
      ],
    });

    const json =
      response.choices[0]?.message?.content || '{"tasks":[]}';

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
