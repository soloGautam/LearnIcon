
import { PageHeader } from "@/components/PageHeader";
import { FileCode2, Download, Copy, Play } from "lucide-react";
import { useEffect, useState } from "react";

interface ProjectFile {
  name: string;
  content: string;
  language: string;
}

interface Project {
  id: string;
  name: string;
  files: ProjectFile[];
}

function Studio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeFile, setActiveFile] = useState<ProjectFile | null>(null);
  const [files, setFiles] = useState<ProjectFile[]>([
    { 
      name: "example.py", 
      content: `# Example Project
# Click a project card from Projects page to load it here

from anthropic import Anthropic

client = Anthropic()

def build_something():
    response = client.messages.create(
        model='claude-3-5-sonnet-20241022',
        max_tokens=1024,
        messages=[{
            'role': 'user',
            'content': 'Help me build an AI project'
        }]
    )
    return response.content[0].text

if __name__ == '__main__':
    print(build_something())
`, 
      language: "python" 
    },
  ]);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedProject");
    if (stored) {
      const project = JSON.parse(stored);
      setSelectedProject(project);
      setFiles(project.files || []);
      if (project.files?.length > 0) {
        setActiveFile(project.files[0]);
      }
    }
  }, []);

  const currentFile = activeFile || files[0];
  const projectName = selectedProject?.name || "Code Studio";

  const handleDownload = () => {
    if (!currentFile) return;
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(currentFile.content));
    element.setAttribute("download", currentFile.name);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = () => {
    if (!currentFile) return;
    navigator.clipboard.writeText(currentFile.content);
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader kicker="Code Studio" title={projectName} sub="A focused workspace for your AI projects. Files, runs, and AI assistance." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[260px_1fr]">
        {/* Sidebar */}
        <div className="glass-card p-4 h-fit">
          <div className="mb-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Files ({files.length})</div>
          <ul className="space-y-1">
            {files.map((f) => (
              <button
                key={f.name}
                onClick={() => setActiveFile(f)}
                className={`w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-left transition-colors ${
                  activeFile?.name === f.name 
                    ? "bg-white/70 text-foreground" 
                    : "text-foreground/80 hover:bg-white/50"
                }`}
              >
                <FileCode2 className="size-4 text-primary flex-shrink-0" /> 
                <span className="truncate">{f.name}</span>
              </button>
            ))}
          </ul>
        </div>

        {/* Code Editor */}
        <div className="glass-card p-0 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="border-b border-border/60 bg-white/40 px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-muted-foreground font-medium">{currentFile?.name || "Select a file"}</div>
            <div className="flex gap-2">
              <button 
                onClick={handleCopy}
                className="p-1.5 rounded hover:bg-white/60 transition-colors text-foreground/70 hover:text-foreground"
                title="Copy"
              >
                <Copy className="size-4" />
              </button>
              <button 
                onClick={handleDownload}
                className="p-1.5 rounded hover:bg-white/60 transition-colors text-foreground/70 hover:text-foreground"
                title="Download"
              >
                <Download className="size-4" />
              </button>
              <button 
                className="p-1.5 rounded hover:bg-white/60 transition-colors text-foreground/70 hover:text-foreground"
                title="Run"
              >
                <Play className="size-4" />
              </button>
            </div>
          </div>

          {/* Code Content */}
          <pre className="overflow-auto flex-1 p-5 text-sm leading-relaxed text-foreground/80 font-mono bg-white/20">
            {currentFile?.content || "No file selected"}
          </pre>

          {/* Language Badge */}
          <div className="border-t border-border/60 bg-white/20 px-4 py-2 text-xs text-muted-foreground">
            Language: <span className="font-medium capitalize">{currentFile?.language || "plaintext"}</span>
          </div>
        </div>
      </div>

      {/* AI Chat Sidebar (placeholder for future integration) */}
      <div className="mt-4 glass-card p-4">
        <div className="text-sm text-muted-foreground">
          💡 Tip: Ask the AI Tutor for help with your code. It can see what you're working on.
        </div>
      </div>
    </div>
  );
}

export default Studio;
