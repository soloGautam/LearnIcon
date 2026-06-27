import { useNavigate, Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { Rocket, ArrowLeft, Sparkles } from "lucide-react";
import { useState } from "react";
import { addXP, useUser, XP } from "@/lib/store";
import { createProject } from "@/lib/projects-store";

function NewProject() {
  const navigate = useNavigate();
  const [, update] = useUser();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const [earned, setEarned] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Give your project a name."); return; }

   const project = await createProject({
  name: name.trim(),
  desc: desc.trim(),
});
    const next = addXP(XP.PROJECT_CREATE, `Created project: ${project.name}`);
    update(next);
    setEarned(true);

    setTimeout(() => navigate(`/chat?project=${project.id}`), 800);
  };

  return (
    <div className="mx-auto max-w-2xl animate-float-up">
      <Link to="/projects" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to projects
      </Link>
      <PageHeader kicker="New project" title="Start something new." sub="Name it, describe it — the AI will help you plan it." />

      <form onSubmit={handleSubmit} className="glass-card space-y-5 p-6 md:p-8">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Name of project</label>
          <input
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            placeholder="e.g. Tiny RAG Agent"
            className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-shadow focus:shadow-[var(--shadow-glow)]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            placeholder="What will this project do? Who is it for?"
            className="w-full resize-none rounded-xl border border-border bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-shadow focus:shadow-[var(--shadow-glow)]"
          />
        </div>
        {error && <div className="text-xs text-[oklch(0.55_0.2_25)]">{error}</div>}

        {earned ? (
          <div className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[oklch(0.7_0.15_290)] to-[oklch(0.78_0.14_350)] py-3 text-sm font-semibold text-white">
            <Sparkles className="size-4" /> +{XP.PROJECT_CREATE} XP earned! Opening AI chat…
          </div>
        ) : (
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition-opacity hover:opacity-95"
          >
            <Rocket className="size-4" /> Create project · +{XP.PROJECT_CREATE} XP
          </button>
        )}
      </form>
    </div>
  );
}

export default NewProject;
