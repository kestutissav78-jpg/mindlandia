import OpenAI from "openai";
import { ProjectBrainV2 } from "@/types/mindlandia";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const decision: string = body.decision || "";
    const projectName: string = body.projectName || "";
    const existing: ProjectBrainV2 = body.existing || {
      goals: [], decisions: [], constraints: [], risks: [],
      features: [], techArchitecture: [], marketResearch: [],
    };

    const isLithuanian =
      /[ąčęėįšųūž]/i.test(decision) ||
      /(kaip|kur|kada|kodėl|padaryk|sukurk|reikia|noriu|galima|lietuv)/i.test(decision);
    const lang = isLithuanian ? "Lithuanian" : "English";

    const prompt = `You are updating the Project Brain for "${projectName}".

Extract NEW insights from the council decision below and merge with existing brain data.
Return ONLY valid JSON. Keep existing items, add new ones. Max 6 items per section.
Each item must be under 100 characters.

Existing brain:
${JSON.stringify(existing, null, 2)}

New council decision:
${decision}

Return JSON in this exact shape:
{
  "goals": ["..."],
  "decisions": ["..."],
  "constraints": ["..."],
  "risks": ["..."],
  "features": ["..."],
  "techArchitecture": ["..."],
  "marketResearch": ["..."]
}

Reply in ${lang}.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: "You extract structured project knowledge. Return only JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0]?.message?.content || "{}");

    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
