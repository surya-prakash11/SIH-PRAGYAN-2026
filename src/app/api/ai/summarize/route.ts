import { geminiPrompt, GeminiError } from "@/server/ai/gemini";
import { getActiveUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";

/**
 * POST /api/ai/summarize — summarize a community note or a chapter.
 *
 * Body:
 *   {
 *     text: string,
 *     kind?: "note" | "chapter" | "explanation",
 *     maxWords?: number
 *   }
 */
export async function POST(req: Request) {
  await getActiveUser();

  let body: {
    text?: string;
    kind?: "note" | "chapter" | "explanation";
    maxWords?: number;
  };

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text = (body.text ?? "").trim();
  if (!text) {
    return Response.json({ error: "No text provided." }, { status: 400 });
  }
  if (text.length > 8000) {
    return Response.json(
      { error: "Text is too long to summarize (max 8000 chars)." },
      { status: 400 },
    );
  }

  const kind = body.kind ?? "note";
  const maxWords = Math.max(40, Math.min(body.maxWords ?? 180, 400));

  const system =
    kind === "chapter"
      ? "You are an NCERT study assistant. Produce a tight, student-friendly summary of the given chapter content. Use bullet points and bold key terms. Do not invent facts."
      : kind === "explanation"
        ? "You are an NCERT study assistant. Re-explain the given text for a 12–14 year old student using plain language, an example, and 3–5 bullet points. Do not invent facts."
        : "You are an NCERT study assistant. Summarize a student's community note into the requested format. Do not invent facts.";

  const prompt =
    kind === "chapter"
      ? `Summarize the following NCERT chapter content in at most ${maxWords} words for a Class 7/8 student. Use bullet points and bold the most important terms.\n\n---\n${text}`
      : kind === "explanation"
        ? `Re-explain the following text for a 12–14 year old student in at most ${maxWords} words. Start with a one-line gist, then 3–5 bullet points, then one small example.\n\n---\n${text}`
        : `Summarize the following student note in at most ${maxWords} words. Use bullet points, keep the original meaning, and correct only obvious typos.\n\n---\n${text}`;

  try {
    const summary = await geminiPrompt(prompt, system, {
      temperature: 0.4,
      maxOutputTokens: 600,
    });
    return Response.json({ summary });
  } catch (err) {
    if (err instanceof GeminiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    return Response.json(
      { error: "Could not summarize right now. Please try again." },
      { status: 500 },
    );
  }
}
