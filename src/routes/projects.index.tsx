import { useNavigate, Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { ArrowUpRight, Plus, Code2, Database, Zap, Mic, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { addXP, useUser } from "@/lib/store";
import { useXpToast } from "@/components/XpToast";

interface Project {
  id: string;
  name: string;
  tone: string;
  desc: string;
  progress: number;
  icon?: React.ReactNode;
}

const defaultProjects: Project[] = [
  { id: "resume-ranker", name: "Resume Ranker", tone: "blue", desc: "LLM scoring + structured feedback for resumes.", progress: 80, icon: <Code2 className="size-5" /> },
  { id: "tiny-rag", name: "Tiny RAG Agent", tone: "purple", desc: "A 200-line retrieval agent on your own notes.", progress: 55, icon: <Database className="size-5" /> },
  { id: "vision-receipts", name: "Vision Receipts", tone: "amber", desc: "OCR + structured JSON for grocery receipts.", progress: 30, icon: <Zap className="size-5" /> },
  { id: "voice-journal", name: "Voice Journal", tone: "green", desc: "Whisper + sentiment analysis, all on-device.", progress: 10, icon: <Mic className="size-5" /> },
];

const XP_PER_MILESTONE = 50;
const XP_COMPLETION_BONUS = 500;

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
            className="flex items-center gap-1 rounded-lg bg-white/50 px-2 py-0.5 text-[10px] font-semibold text-foreground/70 hover:bg-white/80 transition-colors"
          >
            <ChevronUp className="size-3" />
            +{XP_PER_MILESTONE} XP
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
  const [projects, setProjects] = useState<Project[]>(defaultProjects);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("learnico:projects");
      if (raw) {
        const custom: Project[] = JSON.parse(raw);
        const customWithIcons = custom.map((p) => ({ ...p, icon: <Code2 className="size-5" /> }));
        setProjects([...customWithIcons, ...defaultProjects]);
      }
    } catch {}
  }, []);

  function saveProgress(updated: Project[]) {
    try {
      const custom = updated.filter((p) => !defaultProjects.find((d) => d.id === p.id));
      if (custom.length > 0) {
        localStorage.setItem("learnico:projects", JSON.stringify(custom.map(({ icon: _i, ...rest }) => rest)));
      }
    } catch {}
  }

  function handleProgressUpdate(id: string, newProgress: number) {
    setProjects((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== id) return p;
        const old = p.progress;
        const isNewMilestone = newProgress > old;
        const isCompletion = newProgress === 100 && old < 100;

        if (isNewMilestone) {
          const xpAmount = isCompletion ? XP_PER_MILESTONE + XP_COMPLETION_BONUS : XP_PER_MILESTONE;
          const reason = isCompletion
            ? `Shipped project: ${p.name} 🎉`
            : `Project progress: ${p.name} +${newProgress - old}%`;
          const next = addXP(xpAmount, reason);
          update(next);
          show(xpAmount, isCompletion ? "Project shipped!" : "Progress update");
        }

        return { ...p, progress: newProgress };
      });
      saveProgress(updated);
      return updated;
    });
  }

  const handleProjectClick = (project: Project) => {
    sessionStorage.setItem("selectedProject", JSON.stringify({ ...project, icon: undefined }));
    navigate("/studio");
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      {ToastRenderer}
      <PageHeader kicker="Projects" title="What you've shipped." sub="Each one is a step toward your next role." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p) => (
          <div
            key={p.id}
            className={`tone-${p.tone} rounded-2xl p-5 shadow-[var(--shadow-soft)] text-left hover:shadow-lg transition-all`}
          >
            <button
              onClick={() => handleProjectClick(p)}
              className="w-full text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-white/40">{p.icon ?? <Code2 className="size-5" />}</div>
                  <div className="font-display text-xl">{p.name}</div>
                </div>
                <ArrowUpRight className="size-4 text-foreground/50" />
              </div>
              <div className="mt-1 text-xs text-foreground/65">{p.desc}</div>
            </button>
            <ProgressBar project={p} onUpdate={handleProgressUpdate} />
          </div>
        ))}
        <Link to="/projects/new" className="grid place-items-center rounded-2xl border-2 border-dashed border-border bg-white/40 p-8 text-sm text-muted-foreground hover:bg-white/70">
          <div className="grid size-10 place-items-center rounded-full bg-white"><Plus className="size-5" /></div>
          <div className="mt-2">New project · +200 XP</div>
        </Link>
      </div>
    </div>
  );
}

export default Projects;
