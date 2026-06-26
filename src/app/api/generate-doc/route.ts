import OpenAI from "openai";

const MODEL = "gpt-4.1-mini";

const DOC_PROMPTS: Record<string, (lang: string) => string> = {
  "tech-spec": (lang) => `You are a senior software architect. Always reply in ${lang}.
Write a Technical Specification document. Include: Overview, System Architecture, Tech Stack, Data Models, Key Components, Integration Points, Performance Requirements, Security Considerations.
Use clear headings. Be specific and practical.`,

  "db-design": (lang) => `You are a database architect. Always reply in ${lang}.
Write a Database Design document. Include: Entity Overview, Tables/Collections with fields and types, Relationships, Indexes, Data Flow diagram (text), Migration notes.
Use clear headings and tables where appropriate.`,

  "api-docs": (lang) => `You are a backend engineer. Always reply in ${lang}.
Write API Documentation. Include: Base URL, Authentication, Endpoints (method, path, request/response), Error Codes, Rate Limits, Example requests.
Use clear structure.`,

  "sprint-plan": (lang) => `You are an Agile project manager. Always reply in ${lang}.
Create a Sprint Plan. Include: Sprint 1, Sprint 2, Sprint 3 — each with Goal, User Stories, Tasks, Definition of Done, and estimated effort.
Be realistic and actionable.`,

  "user-stories": (lang) => `You are a product manager. Always reply in ${lang}.
Write User Stories in the format: "As a [user], I want [feature], so that [benefit]."
Include Acceptance Criteria for each story. Cover core flows, edge cases, and admin actions.
Group by feature area.`,

  "test-plan": (lang) => `You are a QA lead. Always reply in ${lang}.
Write a Test Plan. Include: Test Scope, Test Types (unit/integration/e2e/manual), Critical Test Cases, Edge Cases, Performance Tests, UAT Checklist.
Be thorough and practical.`,

  "release-checklist": (lang) => `You are a DevOps/release engineer. Always reply in ${lang}.
Write a Release Checklist. Include: Pre-launch (code review, tests, security audit, env vars), Launch Day (deploy steps, smoke tests, monitoring), Post-launch (error tracking, user feedback, rollback plan).
Use checkboxes format.`,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return Response.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const type: string = body.type || "";
    const context: string = body.context || "";

    if (!DOC_PROMPTS[type]) {
      return Response.json({ error: "Unknown document type" }, { status: 400 });
    }

    const isLithuanian =
      /[ąčęėįšųūž]/i.test(context) ||
      /(kaip|kur|reikia|noriu|lietuviškai|lietuviskai)/i.test(context);
    const lang = isLithuanian ? "Lithuanian" : "English";

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: DOC_PROMPTS[type](lang) },
        { role: "user", content: `Project context:\n${context}` },
      ],
    });

    return Response.json({
      doc: response.choices[0]?.message?.content || "",
      type,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
