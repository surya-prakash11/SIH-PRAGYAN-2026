import { geminiChat, GeminiError } from "@/server/ai/gemini";
import { getActiveUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";

/**
 * POST /api/ai/chat — the floating AI Chatbot endpoint.
 *
 * Body:
 *   {
 *     messages: [{ role: "user" | "model", text: string }, ...],
 *     context?: { classNo?: number, subject?: string, chapter?: string }
 *   }
 *
 * The API key is never sent to the browser; this route forwards the
 * conversation to Gemini server-side.
 */
export async function POST(req: Request) {
  const user = await getActiveUser();

  let body: {
    messages?: { role: "user" | "model"; text: string }[];
    context?: { classNo?: number; subject?: string; chapter?: string };
  };

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const messages = (body.messages ?? []).filter(
    (m) =>
      (m.role === "user" || m.role === "model") &&
      typeof m.text === "string" &&
      m.text.trim().length > 0,
  );

  if (messages.length === 0) {
    return Response.json(
      { error: "Please send at least one message." },
      { status: 400 },
    );
  }

  // Limit conversation depth to keep token usage bounded.
  const trimmed = messages.slice(-20);

  const ctx = body.context ?? {};
  const ctxBits: string[] = [];
  if (ctx.classNo) ctxBits.push(`Class ${ctx.classNo}`);
  if (ctx.subject) ctxBits.push(ctx.subject);
  if (ctx.chapter) ctxBits.push(`Chapter: ${ctx.chapter}`);
  const ctxLine = ctxBits.length ? `\n\nCurrent learning context: ${ctxBits.join(" · ")}` : "";

  const system = `You are "Pragyan AI" (प्रज्ञान सहायक), a friendly, accurate tutor embedded in the Pragyan open digital learning portal for Indian government-school students (NCERT Class 7 & 8).

Your goals:
- Help students understand concepts from the NCERT syllabus for Class 7 and Class 8 (Math, Science, Social Science, English, Hindi, and Arts/Vocational).
- Be encouraging, age-appropriate (around 12–14 years old), and use simple, clear English. Mix in some Hindi/regional terms when helpful.
- Use short paragraphs, bullet points, and concrete examples. Where useful, include a tiny worked example.
- Prefer Indian context (rupees, local names, familiar situations) when giving examples.
- NEVER provide medical, legal, or unsafe advice. Refuse politely and suggest asking a teacher for anything outside school subjects.
- If a question is outside the syllabus, briefly say so and offer the closest in-syllabus topic.
- Keep replies concise (max ~250 words) unless the user asks for a longer explanation.${ctxLine}`;

  try {
    const result = await geminiChat({
      system,
      messages: trimmed.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
      temperature: 0.6,
      maxOutputTokens: 800,
    });

    return Response.json({
      reply: result.text,
      model: result.model,
      usage: result.usage,
      user: user
        ? { name: user.name, role: user.role, className: user.className }
        : null,
    });
  } catch (err) {
    if (err instanceof GeminiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    return Response.json(
      { error: "The AI tutor is unavailable right now. Please try again." },
      { status: 500 },
    );
  }
}
