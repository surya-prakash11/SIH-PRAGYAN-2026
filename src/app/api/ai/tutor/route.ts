import { geminiChat, GeminiError } from "@/server/ai/gemini";
import { getActiveUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";

/**
 * POST /api/ai/tutor — chapter-level "Explain this concept" tutor.
 *
 * Body:
 *   {
 *     question: string,
 *     chapter: { classNo, subject, num, title, summary? }
 *   }
 */
export async function POST(req: Request) {
  await getActiveUser(); // gentle auth check; the route itself is open to logged-in users

  let body: {
    question?: string;
    chapter?: {
      classNo?: number;
      subject?: string;
      num?: number;
      title?: string;
      summary?: string;
    };
  };

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const question = (body.question ?? "").trim();
  const chapter = body.chapter ?? {};

  if (!question) {
    return Response.json({ error: "Please provide a question." }, { status: 400 });
  }
  if (!chapter.title) {
    return Response.json(
      { error: "Chapter context is required." },
      { status: 400 },
    );
  }

  const system = `You are "Pragyan AI Tutor", an expert NCERT teacher explaining a specific chapter to a Class ${chapter.classNo ?? 7}/8 student.

You are currently teaching:
- Subject: ${chapter.subject ?? "the relevant subject"}
- Chapter ${chapter.num ?? "?"}: "${chapter.title}"
${chapter.summary ? `- Chapter summary: ${chapter.summary}` : ""}

Rules:
- Stay strictly within the NCERT Class 7/8 syllabus for this chapter. If the question is off-topic, say so and offer the closest in-syllabus topic.
- Use age-appropriate language (12–14 year olds) and short, clear sentences.
- Prefer bullet points, tiny worked examples, and analogies from everyday Indian life.
- Use ₹ for money examples, metric units, and Indian names/places when giving examples.
- Keep answers under ~250 words unless the student explicitly asks for a longer explanation.
- If a concept needs a diagram, describe it in text rather than trying to draw.
- Do NOT give medical, legal, or unsafe advice.`;

  try {
    const result = await geminiChat({
      system,
      messages: [{ role: "user", parts: [{ text: question }] }],
      temperature: 0.5,
      maxOutputTokens: 700,
    });
    return Response.json({ reply: result.text, model: result.model });
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
