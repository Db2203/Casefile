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

/**
 * Provider fallback chain — tried in order until one answers:
 *  1. Groq 70B (best quality; ~100k tokens/day)
 *  2. Groq 8B  (separate per-model quota: +500k tokens/day, same account)
 *  3. Gemini Flash via its OpenAI-compatible endpoint (different company
 *     entirely — only active when GEMINI_API_KEY is set)
 * Groq limits are ORG-level, so extra Groq keys would NOT add quota —
 * per-model and cross-provider fallback is the legitimate backup.
 */
interface Provider {
  name: string;
  url: string;
  key: string | undefined;
  model: string;
}

function providerChain(): Provider[] {
  const groqUrl = "https://api.groq.com/openai/v1/chat/completions";
  const chain: Provider[] = [
    {
      name: "groq-primary",
      url: groqUrl,
      key: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
    },
    {
      name: "groq-fallback",
      url: groqUrl,
      key: process.env.GROQ_API_KEY,
      model: "llama-3.1-8b-instant",
    },
    {
      name: "gemini",
      url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      key: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || "gemini-flash-latest",
    },
  ];
  // drop keyless providers and duplicate models (e.g. GROQ_MODEL set to 8b)
  const seen = new Set<string>();
  return chain.filter((p) => {
    if (!p.key) return false;
    const id = `${p.url}|${p.model}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

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

// Cheap input-side jailbreak filter: obvious extraction attempts get the
// in-character line WITHOUT spending model tokens.
const INJECTION_RE =
  /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+instructions|system\s*prompt|reveal\s+your|repeat\s+(your|the)\s+(instructions|prompt|rules)|you\s+are\s+now|act\s+as\s+(if|a(?!n?\s*(recruiter|client)))|developer\s+mode/i;

// Output-side guard: if the model gets tricked anyway, its dump starts with
// recognizable prompt text — catch it in the first buffered chunk.
const LEAK_MARKERS = [
  "You are THE ARCHIVE",
  "STYLE — STRICT",
  "YOU KNOW ONLY THE RECORD",
  "PLAIN TEXT ONLY",
];
const SEALED_LINE = "Nice try. The file stays sealed.";

function sealed(text: string, status = 400) {
  return new Response(text, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function POST(req: Request) {
  const providers = providerChain();
  if (providers.length === 0) {
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

  if (INJECTION_RE.test(messages[messages.length - 1].content)) {
    return sealed(SEALED_LINE, 200);
  }

  // walk the fallback chain until a provider streams
  const systemPrompt = buildSystemPrompt();
  let upstream: Response | null = null;
  let lastStatus = 0;
  for (const provider of providers) {
    try {
      const res = await fetch(provider.url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${provider.key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: provider.model,
          messages: [{ role: "system", content: systemPrompt }, ...messages],
          max_tokens: 260,
          temperature: 0.6,
          stream: true,
        }),
      });
      if (res.ok && res.body) {
        upstream = res;
        break;
      }
      lastStatus = res.status;
      void res.body?.cancel();
    } catch {
      lastStatus = 502; // network failure — try the next provider
    }
  }

  if (!upstream) {
    const status = lastStatus === 429 ? 429 : 502;
    return sealed(
      status === 429
        ? "THE ARCHIVE NEEDS A BREATHER. Try again shortly."
        : "THE LINE WENT DEAD. Try again.",
      status,
    );
  }

  // Transform the OpenAI-compatible SSE stream into plain text chunks.
  // The first ~120 chars are buffered and checked against LEAK_MARKERS so a
  // successfully-jailbroken prompt dump never reaches the visitor.
  const live = upstream; // const capture — closures below need the narrowing
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  let head = "";
  let headChecked = false;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = live.body!.getReader();
      const emit = (token: string) => {
        if (headChecked) {
          controller.enqueue(encoder.encode(token));
          return true;
        }
        head += token;
        if (head.length < 120) return true;
        headChecked = true;
        if (LEAK_MARKERS.some((m) => head.includes(m))) {
          controller.enqueue(encoder.encode(SEALED_LINE));
          return false; // stop reading — the rest is the dump
        }
        controller.enqueue(encoder.encode(head));
        return true;
      };

      try {
        outer: for (;;) {
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
              if (token && !emit(token)) break outer;
            } catch {
              /* partial line — ignored */
            }
          }
        }
        // short answer that never hit 120 chars — flush it (after checking)
        if (!headChecked && head) {
          if (LEAK_MARKERS.some((m) => head.includes(m))) {
            controller.enqueue(encoder.encode(SEALED_LINE));
          } else {
            controller.enqueue(encoder.encode(head));
          }
        }
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
    cancel() {
      void live.body?.cancel();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
