import { geminiPrompt, GeminiError } from "@/server/ai/gemini";
import { getActiveUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";

/**
 * POST /api/ai/quiz — generate practice MCQs for a chapter from text or a topic.
 *
 * Body:
 *   {
 *     chapter: { classNo, subject, num, title, summary? },
 *     topic?: string,           // optional: "Acids and Bases" etc.
 *     sourceText?: string,      // optional: notes/content to base the quiz on
 *     count?: number            // default 5, max 10
 *   }
 *
 * Returns: { questions: [{ question, options: [a,b,c,d], answerIndex, explanation }] }
 */
export async function POST(req: Request) {
  await getActiveUser();

  let body: {
    chapter?: {
      classNo?: number;
      subject?: string;
      num?: number;
      title?: string;
      summary?: string;
    };
    topic?: string;
    sourceText?: string;
    count?: number;
  };

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const chapter = body.chapter ?? {};
  if (!chapter.title) {
    return Response.json(
      { error: "Chapter context is required." },
      { status: 400 },
    );
  }

  const count = Math.max(3, Math.min(body.count ?? 5, 10));
  const topic = (body.topic ?? "").trim();
  const sourceText = (body.sourceText ?? "").trim().slice(0, 6000);

  const system = `You are an NCERT question setter for Indian Class 7 and Class 8 students.
Generate high-quality, syllabus-aligned multiple-choice questions (MCQs) in STRICT JSON.

Hard rules:
- Stay strictly within NCERT Class ${chapter.classNo ?? 7}/8 syllabus for ${chapter.subject ?? "the subject"}.
- Each question must have exactly 4 options (A–D) with one unambiguously correct answer.
- Avoid trick wording. The correct answer must be clearly correct to a student who studied the chapter.
- Provide a one-sentence explanation referencing the concept.
- Do NOT include any text outside the JSON object.
- Output language: English (with occasional Hindi/regional terms only if the chapter is a language subject).`;

  const prompt = `Generate ${count} MCQs for the following chapter.

Chapter context:
- Class: ${chapter.classNo ?? 7}
- Subject: ${chapter.subject ?? "the subject"}
- Chapter ${chapter.num ?? "?"}: "${chapter.title}"
${chapter.summary ? `- Summary: ${chapter.summary}` : ""}
${topic ? `- Sub-topic: ${topic}` : ""}
${sourceText ? `\nSource material (use this as the basis):\n"""${sourceText}"""` : ""}

Return ONLY this JSON shape, no markdown fences, no extra prose:
{
  "questions": [
    {
      "question": "...",
      "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
      "answerIndex": 0,
      "explanation": "..."
    }
  ]
}`;

  try {
    const raw = await geminiPrompt(prompt, system, {
      temperature: 0.7,
      maxOutputTokens: 1500,
    });

    const parsed = extractJson(raw);
    if (!parsed || !Array.isArray(parsed.questions)) {
      return Response.json(
        { error: "The AI returned an unexpected response. Please try again." },
        { status: 502 },
      );
    }

    // Light validation + cleaning
    const questions = parsed.questions
      .filter(
        (q: unknown): q is {
          question: string;
          options: string[];
          answerIndex: number;
          explanation: string;
        } =>
          typeof q === "object" &&
          q !== null &&
          typeof (q as Record<string, unknown>).question === "string" &&
          Array.isArray((q as Record<string, unknown>).options) &&
          ((q as Record<string, unknown>).options as unknown[]).length === 4 &&
          typeof (q as Record<string, unknown>).answerIndex === "number" &&
          typeof (q as Record<string, unknown>).explanation === "string",
      )
      .slice(0, count)
      .map((q) => ({
        question: q.question,
        options: q.options.map((o) => String(o)),
        answerIndex: Math.max(0, Math.min(3, q.answerIndex | 0)),
        explanation: q.explanation,
      }));

    if (questions.length === 0) {
      return Response.json(
        { error: "Could not generate questions. Please try again." },
        { status: 502 },
      );
    }

    return Response.json({ questions });
  } catch (err) {
    if (err instanceof GeminiError) {
      return Response.json({ error: err.message }, { status: err.status });
    }
    return Response.json(
      { error: "Quiz generation failed. Please try again." },
      { status: 500 },
    );
  }
}

function extractJson(text: string): { questions?: unknown[] } | null {
  // Try to find the first {...} JSON object in the model output
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return null;
  }
  const candidate = text.slice(firstBrace, lastBrace + 1);
  try {
    return JSON.parse(candidate);
  } catch {
    // Try to clean common issues like trailing commas
    const cleaned = candidate
      .replace(/,(\s*[}\]])/g, "$1")
      .replace(/[\u201c\u201d]/g, '"')
      .replace(/[\u2018\u2019]/g, "'");
    try {
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  }
}
