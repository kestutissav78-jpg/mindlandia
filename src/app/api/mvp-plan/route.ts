import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json();

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
You are a senior startup CTO.

Create a concise MVP specification.

Format exactly:

PROJECT

FEATURES

SCREENS

DATABASE

APIS

MVP SCOPE

V2 SCOPE

Keep everything short and practical.
`
        },
        {
          role: "user",
          content: decision,
        },
      ],
    });

    return Response.json({
      plan: response.choices[0]?.message?.content || "",
    });

  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";

    return Response.json(
      { error: message },
      { status: 500 }
    );
  }
}
