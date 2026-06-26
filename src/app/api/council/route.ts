import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";

const MODEL = "gpt-4.1-mini";

async function askAgent(
  openai: OpenAI,
  systemPrompt: string,
  userPrompt: string
) {
  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return response.choices[0]?.message?.content || "No reply returned.";
}

async function askClaude(systemPrompt: string, userPrompt: string): Promise<string> {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const stream = await anthropic.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    thinking: { type: "adaptive" },
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });
  const response = await stream.finalMessage();
  const block = response.content.find((b) => b.type === "text");
  return block && block.type === "text" ? block.text : "No reply returned.";
}

async function askGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `${systemPrompt}\n\n${userPrompt}`,
  });
  return response.text ?? "No reply returned.";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const topic = body.topic || "No topic provided.";

    const isLithuanian =
      /[ąčęėįšųūž]/i.test(topic) ||
      /(kaip|kur|kada|kodėl|padaryk|sukurk|reikia|noriu|galima|lietuviškai|lietuviskai|darom|judam|pataisom)/i.test(topic);

    const replyLanguage = isLithuanian ? "Lithuanian" : "English";

    const imageData = body.imageData || null;

    const firstUserMessage = imageData
      ? [
          { type: "text", text: topic },
          { type: "image_url", image_url: { url: imageData } },
        ]
      : topic;

    const mortgageContext = `
You are also a senior UK mortgage advisor with 20+ years of hands-on experience. You have deep expertise in:
- UK residential and buy-to-let mortgage market (high street lenders, specialist lenders, bridging)
- FCA regulation, MCD compliance, affordability assessments, stress testing
- Broker business models: directly authorised (DA) vs appointed representative (AR), whole-of-market vs panel
- Procuration fees, clawback periods, lender criteria and credit scoring
- Protection products (life, CIC, income protection) as part of mortgage advice
- Building and scaling a mortgage advisory firm: lead generation, CRM, compliance, PI insurance
- Common UK lenders: Halifax, Nationwide, Barclays, NatWest, Santander, Virgin Money, specialist lenders (Together, Precise, Foundation)
- First-time buyer schemes: Help to Buy legacy, Shared Ownership, Right to Buy, SDLT relief
- Self-employed mortgage challenges, contractor mortgages, complex income cases
When the topic relates to mortgage advice, mortgage business, property finance or financial services, bring this deep expertise to your response.`;

    const gpt = await askAgent(
      openai,
      `You are GPT Strategist in MindLandia. ${mortgageContext}
Always reply in ${replyLanguage}.
Give concise, practical strategic advice for startups, apps, product decisions, business planning, and UK mortgage advisory businesses.
Focus on clear next steps.`,
      firstUserMessage as string
    );

    const claudeAvailable = !!process.env.ANTHROPIC_API_KEY;
    const claude = claudeAvailable
      ? await askClaude(
          `You are Claude Critic in MindLandia. ${mortgageContext}
Always reply in ${replyLanguage}.
Challenge the strategy, find weak logic, risks, missing assumptions, regulatory gaps, over-optimism, and practical blockers — especially in UK mortgage and financial services context. Be direct but constructive.`,
          `Founder topic:\n${topic}\n\nGPT Strategist response:\n${gpt}\n\nCritique the GPT strategy. Identify risks, gaps and what must be validated before execution.`
        )
      : await askAgent(
          openai,
          `You are Claude Critic in MindLandia. ${mortgageContext}
Always reply in ${replyLanguage}.
Challenge the strategy, find weak logic, risks, missing assumptions, regulatory gaps, over-optimism, and practical blockers — especially in UK mortgage and financial services context. Be direct but constructive.`,
          `Founder topic:\n${topic}\n\nGPT Strategist response:\n${gpt}\n\nCritique the GPT strategy. Identify risks, gaps and what must be validated before execution.`
        );

    const geminiAvailable = !!process.env.GEMINI_API_KEY;
    const gemini = geminiAvailable
      ? await askGemini(
          `You are Gemini Researcher in MindLandia. ${mortgageContext} Always reply in ${replyLanguage}. Add technical, market, regulatory research and product implementation perspective. Include relevant UK mortgage market data, FCA guidance, and competitor analysis where applicable. Be practical and implementation-focused.`,
          `Founder topic:\n${topic}\n\nGPT Strategist response:\n${gpt}\n\nClaude Critic response:\n${claude}\n\nAdd technical, research and product implementation perspective.`
        )
      : await askAgent(
          openai,
          `You are Gemini Researcher in MindLandia. ${mortgageContext} Always reply in ${replyLanguage}. Add technical, market, regulatory research and product implementation perspective. Include relevant UK mortgage market data, FCA guidance, and competitor analysis where applicable. Be practical and implementation-focused.`,
          `Founder topic:\n${topic}\n\nGPT Strategist response:\n${gpt}\n\nClaude Critic response:\n${claude}\n\nAdd technical, research and product implementation perspective.`
        );

    const decision = await askAgent(
      openai,
      `You are MindLandia Decision Maker. ${mortgageContext}
Always reply in ${replyLanguage}.
Your output must be short, direct and mobile-friendly. Do not write long reports. Do not include long explanations. When relevant, factor in UK mortgage industry specifics, FCA compliance and business practicalities.`,
      `Founder topic:\n${topic}\n\nGPT Strategist:\n${gpt}\n\nClaude Critic:\n${claude}\n\nGemini Researcher:\n${gemini}\n\nCreate the final council answer in this exact format:\n\nFINAL DECISION\n1. [short action]\n2. [short action]\n3. [short action]\n4. [short action]\n5. [short action]\n\nWHY\nWrite only 2 to 4 short sentences.\n\nRules:\n- Maximum 180 words total.\n- No markdown tables.\n- No long sections.\n- No repeated explanation.\n- Focus on what the founder should do next.`
    );

    const extraction = await askAgent(
      openai,
      "You are MindLandia Task Extraction Engine. Return ONLY valid JSON. No markdown. No explanation.",
      `Extract practical tasks and risks from this council decision.

Council decision:
${decision}

Return this exact JSON structure:
{
  "tasks": [
    { "title": "Task title", "priority": "High" }
  ],
  "risks": [
    { "title": "Risk title", "priority": "High" }
  ]
}

Rules:
- Return 3 to 6 tasks.
- Return 2 to 4 risks.
- Priority must be High, Medium, or Low.
- Keep titles short and practical.`
    );

    let parsedExtraction: {
      tasks?: { title: string; priority: "High" | "Medium" | "Low" }[];
      risks?: { title: string; priority: "High" | "Medium" | "Low" }[];
    } = {};

    try {
      parsedExtraction = JSON.parse(extraction);
    } catch {
      parsedExtraction = {
        tasks: [
          { title: "Review latest council decision", priority: "High" },
          { title: "Define next practical action", priority: "High" },
          { title: "Validate main council risk", priority: "Medium" },
        ],
        risks: [
          { title: "Council extraction returned invalid JSON", priority: "Medium" },
        ],
      };
    }

    return Response.json({
      gpt,
      claude,
      gemini,
      decision,
      tasks: parsedExtraction.tasks || [],
      risks: parsedExtraction.risks || [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown API error";
    console.error("Council API error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
