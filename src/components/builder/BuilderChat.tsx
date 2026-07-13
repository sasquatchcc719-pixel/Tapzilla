"use client";

import { useEffect, useRef, useState } from "react";
import type { PageConfig } from "@/lib/page-config/schema";
import { safeParsePageConfig } from "@/lib/page-config/schema";

type ChatMsg = { role: "user" | "assistant"; content: string };

function getSessionKey(): string {
  try {
    const k = localStorage.getItem("tz_ai_session") ?? crypto.randomUUID();
    localStorage.setItem("tz_ai_session", k);
    return k;
  } catch {
    return "anon";
  }
}

const SUGGESTIONS = [
  "I own a carpet cleaning company in Colorado Springs",
  "Build my page from my website: ",
  "Make it feel more premium",
  "Add a $25-off coupon",
];

export function BuilderChat({
  config,
  onConfig,
}: {
  config: PageConfig;
  onConfig: (c: PageConfig) => void;
}) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;
    setBusy(true);
    setInput("");
    const history = [...messages, { role: "user" as const, content }];
    setMessages([...history, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/builder-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.slice(-30),
          config: configRef.current,
          sessionKey: getSessionKey(),
        }),
      });
      if (!res.ok || !res.body) throw new Error("request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const appendAssistant = (delta: string) =>
        setMessages((ms) => {
          const next = ms.slice();
          next[next.length - 1] = {
            role: "assistant",
            content: next[next.length - 1].content + delta,
          };
          return next;
        });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          let evt: Record<string, unknown>;
          try {
            evt = JSON.parse(line);
          } catch {
            continue;
          }
          if (evt.type === "text") {
            setStatus(null);
            appendAssistant(String(evt.delta ?? ""));
          } else if (evt.type === "config") {
            const parsed = safeParsePageConfig(evt.config);
            if (parsed.success) onConfig(parsed.data);
          } else if (evt.type === "status") {
            setStatus(String(evt.message ?? ""));
          } else if (evt.type === "error") {
            appendAssistant(String(evt.message ?? "Something went wrong."));
          }
        }
      }
    } catch {
      setMessages((ms) => {
        const next = ms.slice();
        next[next.length - 1] = {
          role: "assistant",
          content: "I hit a connection problem — try that again.",
        };
        return next;
      });
    } finally {
      setStatus(null);
      setBusy(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-white/70">
              Tell me about your business and I&apos;ll build your page while you watch —
              or paste your website and I&apos;ll do the homework myself.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => (s.endsWith(": ") ? setInput(s) : send(s))}
                  className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60 hover:border-white/40 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm ${
              m.role === "user"
                ? "ml-auto bg-primary-500/20 text-white"
                : "bg-white/5 text-white/90"
            }`}
          >
            {m.content || (busy && i === messages.length - 1 ? "…" : m.content)}
          </div>
        ))}
        {status ? <p className="text-xs italic text-white/40">{status}</p> : null}
        <div ref={bottomRef} />
      </div>

      <form
        className="flex gap-2 border-t border-white/10 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your business, or ask for a change…"
          disabled={busy}
          className="flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-white/40 disabled:opacity-60"
        />
        <button
          disabled={busy || !input.trim()}
          className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-bold text-black disabled:opacity-50"
        >
          {busy ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
