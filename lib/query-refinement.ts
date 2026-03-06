import OpenAI from "openai";

let _openai: OpenAI | null = null;
function getClient(): OpenAI {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return _openai;
}

const SYSTEM_PROMPT = `You are a tool-request generator for an agent routing system. The system contains agent scenarios, each described by a name, description, list of available tools (with descriptions), and accepted parameters.

Given a user's natural language request, reformulate it into a concise tool request that describes:
- What capability or action is needed
- What kind of tools would be involved
- What parameters or inputs the user would provide
- The domain or category this falls into

Write a single dense paragraph. Do not use bullet points, JSON, or any structured format. Do not mention specific tool or scenario names. Focus on describing the functional need so it aligns with how tools and scenarios are described.`;

export async function refineQuery(rawQuery: string): Promise<string> {
  try {
    const response = await getClient().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: rawQuery },
      ],
      max_tokens: 150,
      temperature: 0,
    });

    const refined = response.choices[0]?.message?.content?.trim();
    if (!refined) return rawQuery;
    return refined;
  } catch (error) {
    console.error("Query refinement failed, falling back to raw query:", error);
    return rawQuery;
  }
}
