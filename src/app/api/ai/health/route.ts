import { isAiConfigured, GEMINI_MODEL } from "@/server/ai/gemini";

export const dynamic = "force-dynamic";

/**
 * GET /api/ai/health — frontend uses this to know whether to show the
 * "AI features enabled" badge or to fall back to offline UI.
 */
export async function GET() {
  return Response.json({
    enabled: isAiConfigured(),
    model: GEMINI_MODEL,
  });
}
