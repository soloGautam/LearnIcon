
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Send, Sparkles } from "lucide-react";
import { addXP, getUser, useUser } from "@/lib/store";
import { useXpToast } from "@/components/XpToast";

type Msg = { role: "user" | "ai"; text: string };

const AI_REPLIES = [
  "Great direction. Let's break it down into three small milestones — I'll scaffold the first one in Code Studio when you're ready.",
  "That's a solid approach. RAG with a small embedding model would keep latency low. Want me to sketch the retrieval pipeline?",
  "Nice. I'd start with a thin Python wrapper around the API, then layer in streaming. Should take about 30 lines.",
  "Good instinct. The tricky part is usually the prompt format — let me show you a template that works well for structured output.",
  "That's a real problem worth solving. Most devs over-engineer the storage layer early. Start with a JSON file, iterate fast.",
  "This can be surprisingly simple with the right framing. Let me draft a system prompt for that use case.",
];

let replyIdx = 0;

function Chat() {
  const [, update] = useUser();
  const { show, ToastRenderer } = useXpToast();
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hi! What are we building today? A recommender, a small LLM agent, a vision project?" },
  ]);
  const [input, setInput] = useState("");
  const [msgsThisSession, setMsgsThisSession] = useState(0);

  const XP_PER_MESSAGE = 15;
  const MAX_XP_MESSAGES = 5;

  const send = () => {
    if (!input.trim()) return;
    const u = input.trim();
    const reply = AI_REPLIES[replyIdx % AI_REPLIES.length];
    replyIdx++;

    setMsgs((m) => [...m, { role: "user", text: u }, { role: "ai", text: reply }]);
    setInput("");

    if (msgsThisSession < MAX_XP_MESSAGES) {
      const isFirstEver = msgsThisSession === 0;
      const currentUser = getUser();
      const next = addXP(XP_PER_MESSAGE, "AI Chat session", { aiSessions: currentUser.aiSessions + 1 });
      update(next);
      show(XP_PER_MESSAGE, "AI Chat");
      setMsgsThisSession((n) => n + 1);

      if (isFirstEver && next.achievements.find((a) => a.id === "first_message" && a.unlockedAt)) {
        setTimeout(() => show(0, "Achievement: First AI message 🧠"), 2000);
      }
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {ToastRenderer}
      <PageHeader kicker="AI Chat" title="Your AI companion." sub="Calm, focused conversations that help you ship — not just talk." />

      {msgsThisSession > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-full border border-border/50 bg-white/60 px-4 py-2 text-xs text-muted-foreground w-fit">
          <Sparkles className="size-3 text-primary" />
          <span>+{Math.min(msgsThisSession, MAX_XP_MESSAGES) * XP_PER_MESSAGE} XP earned this session</span>
          {msgsThisSession >= MAX_XP_MESSAGES && (
            <span className="text-[10px] text-muted-foreground/60">· daily cap reached</span>
          )}
        </div>
      )}

      <div className="glass-card flex h-[60vh] flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-primary text-primary-foreground" : "tone-purple text-foreground"}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-border/60 p-3">
          <Sparkles className="ml-2 size-4 text-primary" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask anything — quietly."
            className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button onClick={send} className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground hover:opacity-95">
            <Send className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 text-center text-xs text-muted-foreground">
        Earn +{XP_PER_MESSAGE} XP per message · up to {MAX_XP_MESSAGES} messages/day
      </div>
    </div>
  );
}

export default Chat;
