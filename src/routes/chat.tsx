import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Send, Sparkles, Loader2, FolderPlus, Paperclip, Zap } from "lucide-react";
import { addXP, getUser, useUser, XP } from "@/lib/store";
import { useXpToast } from "@/components/XpToast";
import { getProject, createProject, getChat, saveChat, type ChatMessage, type ChatCard } from "@/lib/projects-store";
import { useCredits, canSpend, spendCredits, CREDIT_COST } from "@/lib/credits-store";


const STEP_TONES = ["tone-blue", "tone-green", "tone-amber", "tone-pink", "tone-purple"];

function CardView({ card, index }: { card: ChatCard; index: number }) {
  if (card.kind === "intro") {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-[oklch(0.92_0.08_300)] to-[oklch(0.94_0.07_350)] p-5 shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[oklch(0.45_0.18_300)]">
          <Sparkles className="size-3" /> Plan overview
        </div>
        <div className="mt-2 font-display text-xl text-foreground">{card.title}</div>
        <p className="mt-2 whitespace-pre-line text-sm text-foreground/80">{card.body}</p>
        {card.encouragement && (
          <div className="mt-3 rounded-xl bg-white/60 px-3 py-2 text-xs italic text-foreground/70">
            “{card.encouragement}”
          </div>
        )}
      </div>
    );
  }
  const tone = STEP_TONES[(index - 1) % STEP_TONES.length];
  return (
    <div className={`${tone} rounded-2xl p-5 shadow-[var(--shadow-soft)]`}>
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-foreground/60">
        <span>Step {index}</span>
        <span className="grid size-6 place-items-center rounded-full bg-white/70 font-bold text-foreground/80">{index}</span>
      </div>
      <div className="mt-2 font-display text-lg text-foreground">{card.title}</div>
      <p className="mt-1.5 whitespace-pre-line text-sm text-foreground/75">{card.body}</p>
    </div>
  );
}

function Chat() {
  const navigate = useNavigate();
  const [, update] = useUser();
  const { show, ToastRenderer } = useXpToast();
  const { state: credits, remaining, allowance } = useCredits();
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const project = useMemo(() => (projectId ? getProject(projectId) : undefined), [projectId]);

  const [msgs, setMsgs] = useState<ChatMessage[]>(() => getChat(projectId));
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    setMsgs(getChat(projectId));
  }, [projectId]);

  useEffect(() => {
    saveChat(projectId, msgs);
  }, [projectId, msgs]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  const greeting: ChatMessage = useMemo(
    () => ({
      id: "greet",
      role: "ai",
      text: project
        ? `Welcome back to "${project.name}". Tell me where you are and I'll give you the next 5 steps.`
        : "Hi! What are we building today? Describe your idea — I'll create a project for you and lay out 5 steps.",
      at: new Date().toISOString(),
    }),
    [project],
  );

  const visibleMsgs = msgs.length === 0 ? [greeting] : msgs;

  async function send() {
    if (!input.trim() || loading) return;
    // Reserve credits up-front using the minimum cost (2). Refunded/topped-up after the response based on actual cost.
    if (!canSpend(CREDIT_COST.AI_RESPONSE)) {
      setError(`You're out of credits this month (${allowance} included on the ${credits.plan} plan). Upgrade your plan to keep building.`);
      return;
    }
    const userText = input.trim();
    setInput("");
    setError(null);

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: userText,
      at: new Date().toISOString(),
    };
    const nextMsgs = [...msgs.length === 0 ? [greeting] : msgs, userMsg];
    setMsgs(nextMsgs);

    // XP: every message = +10
    const u = getUser();
    const xpState = addXP(XP.AI_MESSAGE, "AI Chat message", { aiSessions: u.aiSessions + 1 });
    update(xpState);
    show(XP.AI_MESSAGE, "AI Chat");

    setLoading(true);
    try {
      const history = nextMsgs
        .filter((m) => m.text)
        .map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text! }));

let uploadedFile = null;

if (selectedFile) {
  uploadedFile = {
    name: selectedFile.name,
    content: await selectedFile.text(),
  };
}

let uploadedFile = null;

if (selectedFile) {
  uploadedFile = {
    name: selectedFile.name,
    content: await selectedFile.text(),
  };
}
      const resp = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: userMsg.text,
    uploadedFile,
    history,
    hasProject: !!project,
    project: project
      ? {
          name: project.name,
          desc: project.desc,
          buildIn: project.buildIn,
        }
      : null,
  }),
});

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: `Request failed (${resp.status})` }));
        throw new Error(err.error ?? `Request failed (${resp.status})`);
      }
      const data = await resp.json();
if (!data) throw new Error("Empty response");

const aiData = data;
      let activeProjectId = projectId;
      if (!project && data.projectSuggestion?.name) {
        const created = createProject({
          name: data.projectSuggestion.name,
          desc: data.projectSuggestion.desc,
          buildIn: data.projectSuggestion.buildIn,
          recommendedTools: data.projectSuggestion.recommendedTools,
        });
        activeProjectId = created.id;
        // Move conversation under the new project, then route there.
        saveChat(created.id, nextMsgs);
        setSearchParams({ project: created.id }, { replace: true });
      }

      let cards: ChatCard[] = [];

if (aiData.type === "project") {
  cards = [
    {
      kind: "intro",
      title: aiData.overview?.title || "Project Overview",
      body: aiData.overview?.content || "",
    },

    ...(aiData.steps || []).slice(0, 5).map((s: any) => ({
      kind: "step",
      title: s.title,
      body: s.content,
    })),
  ];
}

if (aiData.type === "greeting") {
  cards = [
    {
      kind: "intro",
      title: "Welcome",
      body: aiData.message,
    },
  ];
}

if (aiData.type === "chat") {
  cards = [
    {
      kind: "intro",
      title: "LearnIcon AI",
      body: aiData.message,
    },
  ];
}

if (aiData.type === "completed") {
  cards = [
    {
      kind: "intro",
      title: "🎉 Project Completed",
      body: aiData.message,
    },
  ];

  // quiz UI will be added next
}

      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "ai",
        cards,
        at: new Date().toISOString(),
      };

      const finalMsgs = [...nextMsgs, aiMsg];
      setMsgs(finalMsgs);
      if (activeProjectId) saveChat(activeProjectId, finalMsgs);

      // Deduct credits based on actual server-reported cost
      const cost = typeof data.creditCost === "number" ? data.creditCost : CREDIT_COST.AI_RESPONSE;
      spendCredits(cost, cost >= CREDIT_COST.CODE_GENERATION ? "Code generation" : cost >= CREDIT_COST.AI_RESPONSE_LONG ? "Long AI response" : "AI response");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      {ToastRenderer}
      <PageHeader
        kicker={project ? `Project · ${project.name}` : "AI Chat"}
        title={project ? project.name : "Your AI companion."}
        sub={project ? project.desc : "Tell me your idea — I'll scaffold a project and give you 5 calm steps."}
      />

      {project && (
        <div className="mb-3 flex items-center justify-between rounded-xl border border-border/60 bg-white/60 px-4 py-2 text-xs text-muted-foreground">
          <span>Chatting inside <strong className="text-foreground">{project.name}</strong></span>
          <button
            onClick={() => navigate("/projects")}
            className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-foreground/70 hover:bg-white/90"
          >
            <FolderPlus className="size-3" /> All projects
          </button>
        </div>
      )}

      <div className="glass-card flex h-[68vh] flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {visibleMsgs.map((m) => (
            <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "user" ? (
                <div className="max-w-[80%] rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                  {m.text}
                </div>
              ) : m.cards ? (
                <div className="w-full max-w-full space-y-3">
                  {m.cards.map((c, i) => (
                    <CardView key={i} card={c} index={i} />
                  ))}
                </div>
              ) : (
                <div className="max-w-[80%] rounded-2xl bg-[oklch(0.96_0.03_290)] px-4 py-2.5 text-sm text-foreground">
                  {m.text}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" /> Thinking through your plan…
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </div>
          )}
          <div ref={endRef} />
        </div>
        
       <div className="flex items-center gap-2 border-t border-border/60 p-3">
       <Sparkles className="ml-2 size-4 text-primary" />

       <input
       ref={fileInputRef}
       type="file"
       className="hidden"
       onChange={(e) => {
       const file = e.target.files?.[0];
      if (file) setSelectedFile(file);
    }}
  />
            <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
            placeholder={project ? "Ask a question about your project…" : "Describe what you want to build…"}
            className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
            disabled={loading}
          />

<button
  type="button"
  onClick={() => fileInputRef.current?.click()}
  disabled={loading}
  className="grid size-9 place-items-center rounded-xl border border-border hover:bg-muted disabled:opacity-40"
>
  <Paperclip className="size-4" />
</button>

          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground hover:opacity-95 disabled:opacity-40"
          >
            <Send className="size-4" />
          </button>
        </div>
      </div>
{selectedFile && (
  <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs">
    <Paperclip className="size-3" />
    <span>{selectedFile.name}</span>
  </div>
)}

      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-center text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2.5 py-1">
          <Zap className="size-3 text-primary" />
          <strong className="text-foreground">{remaining}</strong> / {allowance} credits · {credits.plan}
        </span>
        <span>AI response = {CREDIT_COST.AI_RESPONSE} cr · Long = {CREDIT_COST.AI_RESPONSE_LONG} cr · Code gen = {CREDIT_COST.CODE_GENERATION} cr</span>
      </div>
    </div>
  );
}

export default Chat;
