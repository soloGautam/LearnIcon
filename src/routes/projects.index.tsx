import { useNavigate, Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { ArrowUpRight, Plus, Code2, FolderOpen, ChevronUp, MessageSquare, Trash2 } from "lucide-react";
import { addXP, useUser, XP } from "@/lib/store";
import { useXpToast } from "@/components/XpToast";
import { useProjects, updateProject, deleteProject, type Project } from "@/lib/projects-store";

function ProgressBar({ project, onUpdate }: { project: Project; onUpdate: (id: string, progress: number) => void }) {
  const steps = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  return (
    <div className="mt-4 space-y-2">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/60">
        <div
          className="h-full rounded-full bg-foreground/70 transition-all duration-500"
          style={{ width: `${project.progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="text-[10px] text-foreground/55">{project.progress}% complete</div>
        {project.progress < 100 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              const nextStep = steps.find((s) => s > project.progress) ?? 100;
              onUpdate(project.id, nextStep);
            }}
            className="rounded-lg bg-white/50 px-2 py-0.5 text-[10px] font-semibold text-foreground/70 hover:bg-white/80"
          >
            <ChevronUp className="inline size-3" /> next milestone
          </button>
        )}
        {project.progress === 100 && (
          <span className="rounded-full bg-[oklch(0.94_0.06_155)] px-2 py-0.5 text-[10px] font-semibold text-[oklch(0.4_0.1_155)]">✓ Shipped</span>
        )}
      </div>
    </div>
  );
}

function Projects() {
  const navigate = useNavigate();
  const [, update] = useUser();
  const { show, ToastRenderer } = useXpToast();
  const [projects] = useProjects();

  function handleProgressUpdate(id: string, newProgress: number) {
    const existing = projects.find((p) => p.id === id);
    if (!existing) return;
    const wasComplete = existing.progress === 100;
    updateProject(id, { progress: newProgress });
    if (newProgress === 100 && !wasComplete) {
      const next = addXP(XP.PROJECT_COMPLETE, `Shipped project: ${existing.name} 🎉`);
      update(next);
      show(XP.PROJECT_COMPLETE, "Project complete!");
    }
  }

  function handleOpen(project: Project) {
    navigate(`/chat?project=${project.id}`);
  }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (!confirm("Delete this project and its chat history?")) return;
    deleteProject(id);
  }

  return (
    <div className="mx-auto max-w-[1400px]">
      {ToastRenderer}
      <PageHeader kicker="Projects" title="What you're building." sub="Click any project to open its AI chat and files." />

      {projects.length === 0 && (
        <div className="mb-6 rounded-2xl border-2 border-dashed border-border bg-white/40 p-10 text-center">
          <FolderOpen className="mx-auto size-8 text-muted-foreground/50" />
          <div className="mt-3 font-display text-lg text-foreground">No projects yet</div>
          <p className="mt-1 text-sm text-muted-foreground">
            Start a chat — tell the AI your idea and it will create your first project automatically.
          </p>
          <Link
            to="/chat"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-95"
          >
            <MessageSquare className="size-4" /> Open AI Chat
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => (
          <div
            key={p.id}
            className={`tone-${p.tone} group rounded-2xl p-5 shadow-[var(--shadow-soft)] text-left hover:shadow-lg transition-all`}
          >
            <button onClick={() => handleOpen(p)} className="w-full text-left">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-white/40"><Code2 className="size-5" /></div>
                  <div className="font-display text-xl">{p.name}</div>
                </div>
                <ArrowUpRight className="size-4 text-foreground/50" />
              </div>
              <div className="mt-1 text-xs text-foreground/65">{p.desc}</div>
              <div className="mt-2 flex flex-wrap gap-1">
                {p.buildIn === "external" && (
                  <span className="rounded-full bg-white/60 px-2 py-0.5 text-[10px] text-foreground/65">External build</span>
                )}
                <span className="rounded-full bg-white/60 px-2 py-0.5 text-[10px] text-foreground/65">{p.files.length} file{p.files.length === 1 ? "" : "s"}</span>
              </div>
            </button>
            <ProgressBar project={p} onUpdate={handleProgressUpdate} />
            <div className="mt-3 flex justify-between gap-2">
              <button
                onClick={() => navigate(`/studio?project=${p.id}`)}
                className="text-[11px] text-foreground/60 hover:text-foreground hover:underline"
              >
                Open in Studio →
              </button>
              <button
                onClick={(e) => handleDelete(e, p.id)}
                className="rounded-md p-1 text-foreground/40 opacity-0 transition-opacity hover:bg-white/60 hover:text-destructive group-hover:opacity-100"
                title="Delete project"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
        <Link
          to="/projects/new"
          className="grid place-items-center rounded-2xl border-2 border-dashed border-border bg-white/40 p-8 text-sm text-muted-foreground hover:bg-white/70"
        >
          <div className="grid size-10 place-items-center rounded-full bg-white"><Plus className="size-5" /></div>
          <div className="mt-2">New project · +{XP.PROJECT_CREATE} XP</div>
        </Link>
      </div>
    </div>
  );
}

export default Projects;
