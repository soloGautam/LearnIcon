import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { PageHeader } from "@/components/PageHeader";
import { FileCode2, Download, Copy, Play, Upload, Save, MessageSquare } from "lucide-react";
import { addFilesToProject, getProject, type ProjectFile } from "@/lib/projects-store";
import { addXP, useUser, XP } from "@/lib/store";
import { useXpToast } from "@/components/XpToast";

function detectLanguage(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    py: "python", js: "javascript", jsx: "javascript", ts: "typescript", tsx: "typescript",
    json: "json", md: "markdown", html: "html", css: "css", txt: "plaintext", yaml: "yaml", yml: "yaml",
  };
  return map[ext] || "plaintext";
}

const DEFAULT_FILE: ProjectFile = {
  name: "scratch.py",
  language: "python",
  content: `# Scratch space
# Open a project from the Projects page to load its files here.

print("hello from learnico")
`,
};

function Studio() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("project");
  const project = useMemo(() => (projectId ? getProject(projectId) : undefined), [projectId]);

  const [, update] = useUser();
  const { show, ToastRenderer } = useXpToast();

  const [files, setFiles] = useState<ProjectFile[]>(() =>
    project?.files?.length ? project.files : [DEFAULT_FILE],
  );
  const [activeName, setActiveName] = useState<string>(() => (project?.files?.[0]?.name ?? DEFAULT_FILE.name));
  const [draft, setDraft] = useState<string>("");
  const lastXpAtRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeFile = files.find((f) => f.name === activeName) ?? files[0];

  useEffect(() => {
    setDraft(activeFile?.content ?? "");
  }, [activeName, activeFile?.content]);

  const projectName = project?.name || "Code Studio";

  function persistFiles(next: ProjectFile[]) {
    setFiles(next);
    if (project) addFilesToProject(project.id, next);
  }

  function handleSave() {
    if (!activeFile) return;
    const next = files.map((f) => (f.name === activeFile.name ? { ...f, content: draft } : f));
    persistFiles(next);
    const now = Date.now();
    // Throttle code-edit XP to once per 30s per editor session
    if (now - lastXpAtRef.current > 30_000) {
      lastXpAtRef.current = now;
      const result = addXP(XP.CODE_EDIT, `Code edit: ${activeFile.name}`);
      update(result);
      show(XP.CODE_EDIT, "Code edit");
    }
  }

  function handleDownload() {
    if (!activeFile) return;
    const blob = new Blob([draft], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFile.name;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleCopy() {
    navigator.clipboard.writeText(draft);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    if (!list || list.length === 0) return;
    const incoming: ProjectFile[] = [];
    for (const f of Array.from(list)) {
      const content = await f.text();
      incoming.push({ name: f.name, content, language: detectLanguage(f.name) });
    }
    const merged = [...files];
    for (const f of incoming) {
      const idx = merged.findIndex((m) => m.name === f.name);
      if (idx >= 0) merged[idx] = f;
      else merged.push(f);
    }
    persistFiles(merged);
    setActiveName(incoming[0].name);
    if (project) {
      const result = addXP(XP.CODE_EDIT, `Imported ${incoming.length} file(s) into ${project.name}`);
      update(result);
      show(XP.CODE_EDIT, "Files imported");
    }
    e.target.value = "";
  }

  return (
    <div className="mx-auto max-w-[1400px]">
      {ToastRenderer}
      <PageHeader kicker="Code Studio" title={projectName} sub="Edit, import files, and ship. Saved edits earn XP." />

      {!project && (
        <div className="mb-4 rounded-xl border border-dashed border-border bg-white/40 px-4 py-3 text-xs text-muted-foreground">
          You're in scratch mode. <Link to="/projects" className="font-medium text-primary hover:underline">Open a project</Link> to save and import files.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
        <div className="glass-card p-4 h-fit">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Files ({files.length})</div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary hover:bg-primary/15"
              title="Upload files"
            >
              <Upload className="size-3" /> Upload
            </button>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleUpload} />
          </div>
          <ul className="space-y-1">
            {files.map((f) => (
              <li key={f.name}>
                <button
                  onClick={() => setActiveName(f.name)}
                  className={`w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-left transition-colors ${
                    activeFile?.name === f.name ? "bg-white/70 text-foreground" : "text-foreground/80 hover:bg-white/50"
                  }`}
                >
                  <FileCode2 className="size-4 text-primary flex-shrink-0" />
                  <span className="truncate">{f.name}</span>
                </button>
              </li>
            ))}
          </ul>
          {project && (
            <Link
              to={`/chat?project=${project.id}`}
              className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-white/60 px-3 py-2 text-xs font-medium text-foreground/80 hover:bg-white/90"
            >
              <MessageSquare className="size-3.5" /> Open project chat
            </Link>
          )}
        </div>

        <div className="glass-card p-0 overflow-hidden flex flex-col">
          <div className="border-b border-border/60 bg-white/40 px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-muted-foreground font-medium">{activeFile?.name || "Select a file"}</div>
            <div className="flex gap-2">
              <button onClick={handleSave} className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-[11px] font-semibold text-primary-foreground hover:opacity-90" title="Save">
                <Save className="size-3.5" /> Save
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded hover:bg-white/60 text-foreground/70 hover:text-foreground" title="Upload files">
                <Upload className="size-4" />
              </button>
              <button onClick={handleCopy} className="p-1.5 rounded hover:bg-white/60 text-foreground/70 hover:text-foreground" title="Copy">
                <Copy className="size-4" />
              </button>
              <button onClick={handleDownload} className="p-1.5 rounded hover:bg-white/60 text-foreground/70 hover:text-foreground" title="Download">
                <Download className="size-4" />
              </button>
              <button className="p-1.5 rounded hover:bg-white/60 text-foreground/70 hover:text-foreground" title="Run">
                <Play className="size-4" />
              </button>
            </div>
          </div>

          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            spellCheck={false}
            className="min-h-[60vh] flex-1 resize-none bg-white/20 p-5 font-mono text-sm leading-relaxed text-foreground/80 outline-none"
          />

          <div className="border-t border-border/60 bg-white/20 px-4 py-2 text-xs text-muted-foreground flex items-center justify-between">
            <span>Language: <span className="font-medium capitalize">{activeFile?.language || "plaintext"}</span></span>
            <span>+{XP.CODE_EDIT} XP per save · once per 30s</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Studio;
