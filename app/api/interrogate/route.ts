import { buildSystemPrompt } from "@/lib/interrogation";

/**
 * The Interrogation Room's backend: streams grounded answers from Groq's
 * free tier (fast Llama inference, OpenAI-compatible API). Zero dependencies —
 * raw fetch + SSE parsing. The GROQ_API_KEY never leaves the server.
 *
 * Abuse guards (portfolio-scale, no external infra):
 *  - per-IP throttle (in-memory sliding window)
 *  - conversation ≤ 8 user turns, each ≤ 280 chars
 *  - replies capped at 350 tokens
 *  - Groq's own free-tier limits as the final backstop
 */

const MODEL = process.env.GROQ_MODEL ?? "llama-3.1-8b-instant";
const MAX_TURNS = 8;
const MAX_CHARS = 280;
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 10;

const hits = new Map<string, number[]>();

function throttled(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) return true;
  list.push(now);
  hits.set(ip, list);
  // keep the map from growing unbounded
  if (hits.size > 5000) hits.clear();
  return false;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function sealed(text: string, status = 400) {
  return new Response(text, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return sealed("THE ARCHIVE IS SEALED — interrogation offline.", 503);
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (throttled(ip)) {
    return sealed("EASY, DETECTIVE. Too many questions — give it a minute.", 429);
  }

  let messages: ChatMessage[];
  try {
    const body = (await req.json()) as { messages?: unknown };
    if (!Array.isArray(body.messages)) throw new Error("bad shape");
    messages = body.messages
      .filter(
        (m): m is ChatMessage =>
          !!m &&
          typeof m === "object" &&
          ((m as ChatMessage).role === "user" ||
            (m as ChatMessage).role === "assistant") &&
          typeof (m as ChatMessage).content === "string",
      )
      .slice(-MAX_TURNS * 2)
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
    if (
      messages.length === 0 ||
      messages[messages.length - 1].role !== "user"
    ) {
      throw new Error("no question");
    }
  } catch {
    return sealed("THE ARCHIVE DIDN'T CATCH THAT.");
  }

  const upstream = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          ...messages,
        ],
        max_tokens: 350,
        temperature: 0.6,
        stream: true,
      }),
    },
  );

  if (!upstream.ok || !upstream.body) {
    const status = upstream.status === 429 ? 429 : 502;
    return sealed(
      status === 429
        ? "THE ARCHIVE NEEDS A BREATHER. Try again shortly."
        : "THE LINE WENT DEAD. Try again.",
      status,
    );
  }

  // Transform Groq's SSE stream into plain text chunks for the client.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const data = line.trim();
            if (!data.startsWith("data:")) continue;
            const payload = data.slice(5).trim();
            if (payload === "[DONE]") continue;
            try {
              const json = JSON.parse(payload) as {
                choices?: { delta?: { content?: string } }[];
              };
              const token = json.choices?.[0]?.delta?.content;
              if (token) controller.enqueue(encoder.encode(token));
            } catch {
              /* partial line — ignored */
            }
          }
        }
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
    cancel() {
      void upstream.body?.cancel();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
