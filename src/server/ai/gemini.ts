/**
 * Server-only Gemini client.
 *
 * The API key is read from `process.env.GEMINI_API_KEY` and is NEVER exposed
 * to the browser — every AI feature in the app calls into a server route
 * (e.g. /api/ai/chat) that imports this module.
 *
 * We call the public REST endpoint directly so we don't add a new dependency.
 * Docs: https://ai.google.dev/api/generate-content
 */

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";
export const GEMINI_MODEL =
  process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

export type GeminiMessage = {
  role: "user" | "model";
  parts: { text: string }[];
};

export type GeminiChatRequest = {
  system?: string;
  messages: GeminiMessage[];
  temperature?: number;
  maxOutputTokens?: number;
};

export type GeminiChatResponse = {
  text: string;
  model: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
};

export class GeminiError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = "GeminiError";
    this.status = status;
  }
}

export function isAiConfigured(): boolean {
  return Boolean(GEMINI_API_KEY && GEMINI_API_KEY.trim().length > 0);
}

/**
 * Calls Gemini's generateContent endpoint with a chat-style payload.
 * Throws GeminiError on any non-2xx response.
 */
export async function geminiChat(
  req: GeminiChatRequest,
): Promise<GeminiChatResponse> {
  if (!isAiConfigured()) {
    throw new GeminiError(
      "AI features are not configured on the server. Set GEMINI_API_KEY in your .env to enable them.",
      503,
    );
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    GEMINI_MODEL,
  )}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;

  const body = {
    systemInstruction: req.system
      ? { role: "system", parts: [{ text: req.system }] }
      : undefined,
    contents: req.messages,
    generationConfig: {
      temperature: req.temperature ?? 0.6,
      maxOutputTokens: req.maxOutputTokens ?? 1024,
    },
  };

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    throw new GeminiError(
      `Could not reach the Gemini API: ${err instanceof Error ? err.message : String(err)}`,
      502,
    );
  }

  if (!res.ok) {
    let detail = "";
    try {
      const j = (await res.json()) as { error?: { message?: string } };
      detail = j?.error?.message ?? "";
    } catch {
      // ignore — we'll just use the status text
    }
    throw new GeminiError(
      detail || `Gemini API returned HTTP ${res.status}`,
      res.status,
    );
  }

  const data = (await res.json()) as {
    candidates?: {
      content?: { parts?: { text?: string }[] };
    }[];
    modelVersion?: string;
    usageMetadata?: {
      promptTokenCount?: number;
      candidatesTokenCount?: number;
      totalTokenCount?: number;
    };
  };

  const text =
    data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("")
      .trim() ?? "";

  if (!text) {
    throw new GeminiError("Gemini returned an empty response.", 502);
  }

  return {
    text,
    model: data.modelVersion ?? GEMINI_MODEL,
    usage: data.usageMetadata
      ? {
          promptTokens: data.usageMetadata.promptTokenCount,
          completionTokens: data.usageMetadata.candidatesTokenCount,
          totalTokens: data.usageMetadata.totalTokenCount,
        }
      : undefined,
  };
}

/**
 * Quick single-turn prompt (no chat history). Used by one-shot AI helpers
 * like "summarize this note" or "explain this concept".
 */
export async function geminiPrompt(
  prompt: string,
  system?: string,
  opts: { temperature?: number; maxOutputTokens?: number } = {},
): Promise<string> {
  const res = await geminiChat({
    system,
    messages: [{ role: "user", parts: [{ text: prompt }] }],
    temperature: opts.temperature,
    maxOutputTokens: opts.maxOutputTokens,
  });
  return res.text;
}
