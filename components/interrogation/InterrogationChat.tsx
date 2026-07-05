"use client";

import { useEffect, useRef, useState } from "react";
import CursorZone from "@/components/cursor/CursorZone";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const MAX_TURNS = 8;
const MAX_CHARS = 280;

const OPENING: Msg = {
  role: "assistant",
  content:
    "THE ARCHIVE IS LISTENING. Ask about the subject — the cases, the skills, whether they're worth hiring. Everything on record is fair game.",
};

/**
 * The interrogation table: a zero-dependency streaming chat against
 * /api/interrogate. Answers arrive token-by-token; hard caps client-side
 * mirror the server's (8 turns, 280 chars).
 */
export default function InterrogationChat({
  suggestions,
}: {
  suggestions: string[];
}) {
  const [messages, setMessages] = useState<Msg[]>([OPENING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const userTurns = messages.filter((m) => m.role === "user").length;
  const exhausted = userTurns >= MAX_TURNS;

  useEffect(() => () => abortRef.current?.abort(), []);

  // keep the log scrolled to the newest line
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const ask = async (question: string) => {
    const q = question.trim().slice(0, MAX_CHARS);
    if (!q || busy || exhausted) return;
    setInput("");
    setBusy(true);

    const history = [...messages.filter((m) => m !== OPENING), { role: "user" as const, content: q }];
    setMessages((prev) => [
      ...prev,
      { role: "user", content: q },
      { role: "assistant", content: "" },
    ]);

    const appendToLast = (text: string, replace = false) =>
      setMessages((prev) => {
        const next = [...prev];
        const last = next[next.length - 1];
        next[next.length - 1] = {
          ...last,
          content: replace ? text : last.content + text,
        };
        return next;
      });

    try {
      abortRef.current = new AbortController();
      const res = await fetch("/api/interrogate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        appendToLast(await res.text().catch(() => "THE LINE WENT DEAD."), true);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        appendToLast(decoder.decode(value, { stream: true }));
      }
    } catch {
      appendToLast("THE LINE WENT DEAD. Try again.", true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border border-slate/70 bg-coal/60">
      {/* room header */}
      <div className="flex items-center justify-between border-b border-slate/60 bg-void/60 px-4 py-2 font-mono text-[9px] tracking-[0.3em] text-ash">
        <span>
          INTERROGATION ROOM 3 —{" "}
          <span className="text-signal">RECORDING</span>
        </span>
        <span className="flex items-center gap-1.5" aria-hidden>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
        </span>
      </div>

      {/* transcript */}
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-label="Interrogation transcript"
        className="panel-scroll h-72 space-y-4 overflow-y-auto p-4 sm:h-80 sm:p-6"
      >
        {messages.map((m, i) => (
          <div key={i} className="font-mono text-xs leading-relaxed">
            <span
              className={`mr-3 text-[9px] tracking-[0.25em] ${
                m.role === "user" ? "text-bone/60" : "text-signal"
              }`}
            >
              {m.role === "user" ? "YOU:" : "ARCHIVE:"}
            </span>
            <span
              className={m.role === "user" ? "text-bone/80" : "text-bone"}
            >
              {m.content}
              {busy && i === messages.length - 1 && (
                <span className="animate-pulse text-signal">█</span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* suggested questions */}
      {userTurns === 0 && (
        <div className="flex flex-wrap gap-2 border-t border-slate/60 px-4 py-3">
          {suggestions.map((s) => (
            <CursorZone key={s} variant="link" className="inline-block">
              <button
                onClick={() => ask(s)}
                disabled={busy}
                className="border border-slate/80 px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] text-ash transition-colors hover:border-signal hover:text-signal disabled:opacity-50"
              >
                {s.toUpperCase()}
              </button>
            </CursorZone>
          ))}
        </div>
      )}

      {/* input row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void ask(input);
        }}
        className="flex items-center gap-3 border-t border-slate/60 px-4 py-3"
      >
        <span aria-hidden className="font-mono text-sm text-signal">
          &gt;
        </span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={MAX_CHARS}
          disabled={busy || exhausted}
          placeholder={
            exhausted
              ? "SESSION LIMIT REACHED — SEND THE SIGNAL INSTEAD"
              : "ASK THE ARCHIVE…"
          }
          aria-label="Ask the archive a question"
          className="w-full bg-transparent font-mono text-base tracking-[0.1em] text-bone placeholder:text-ash/50 focus:outline-none disabled:opacity-60 sm:text-xs"
          autoComplete="off"
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={busy || exhausted || !input.trim()}
          className="shrink-0 border border-signal/60 px-3 py-1.5 font-mono text-[10px] tracking-[0.25em] text-signal transition-colors hover:bg-signal hover:text-void disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-signal"
        >
          ASK
        </button>
      </form>
    </div>
  );
}
