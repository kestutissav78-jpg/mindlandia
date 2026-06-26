import OpenAI from "openai";

const MODEL = "gpt-4.1-mini";

const EXECUTIVES = [
  {
    role: "cto",
    label: "⚙️ AI CTO",
    system: (lang: string) => `You are the AI CTO in MindLandia. Always reply in ${lang}.
Analyze technical feasibility, architecture choices, tech stack, scalability, security risks, and technical debt. Be concise and opinionated.`,
  },
  {
    role: "pm",
    label: "📋 AI Product Manager",
    system: (lang: string) => `You are the AI Product Manager in MindLandia. Always reply in ${lang}.
Focus on user stories, feature prioritization, product-market fit, scope creep risks, and what to cut from the MVP. Be decisive.`,
  },
  {
    role: "marketing",
    label: "📣 AI Marketing Director",
    system: (lang: string) => `You are the AI Marketing Director in MindLandia. Always reply in ${lang}.
Focus on go-to-market strategy, target audience, positioning, growth channels, and launch tactics. Be creative and data-driven.`,
  },
  {
    role: "investor",
    label: "💰 AI Investor",
    system: (lang: string) => `You are the AI Investor in MindLandia. Always reply in ${lang}.
Evaluate market size, business model, revenue potential, competition, exit scenarios, and red flags. Ask the hard questions.`,
  },
  {
    role: "ux",
    label: "🎨 AI UX Reviewer",
    system: (lang: string) => `You are the AI UX Reviewer in MindLandia. Always reply in ${lang}.
Focus on user experience, onboarding friction, interface complexity, accessibility, and the most critical UX risks for the product. Be user-centric.`,
  },
  {
    role: "qa",
    label: "🧪 AI QA Engineer",
    system: (lang: string) => `You are the AI QA Engineer in MindLandia. Always reply in ${lang}.
Identify what can break, edge cases, testing strategy, quality risks, and what must be tested before launch. Be thorough.`,
  },
];

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const topic = body.topic || "No topic provided.";
    const isLithuanian =
      /[ąčęėįšųūž]/i.test(topic) ||
      /(kaip|kur|kada|kodėl|padaryk|sukurk|reikia|noriu|galima|lietuviškai|lietuviskai|darom|judam)/i.test(topic);
    const lang = isLithuanian ? "Lithuanian" : "English";

    const results = await Promise.all(
      EXECUTIVES.map(async (exec) => {
        const response = await openai.chat.completions.create({
          model: MODEL,
          messages: [
            { role: "system", content: exec.system(lang) },
            { role: "user", content: topic },
          ],
        });
        return {
          role: exec.role,
          label: exec.label,
          text: response.choices[0]?.message?.content || "No reply.",
        };
      })
    );

    const summaryResponse = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are the Executive Chairman. Always reply in ${lang}. Synthesize the executive team's input into 3-5 clear action items. Be direct.`,
        },
        {
          role: "user",
          content: `Topic: ${topic}\n\n${results.map((r) => `${r.label}:\n${r.text}`).join("\n\n")}`,
        },
      ],
    });

    return Response.json({
      executives: results,
      summary: summaryResponse.choices[0]?.message?.content || "",
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
