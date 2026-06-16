import { useEffect, useState } from "react";

export interface ProjectFile {
  name: string;
  content: string;
  language: string;
}

export interface Project {
  id: string;
  name: string;
  desc: string;
  tone: string;
  progress: number;
  files: ProjectFile[];
  buildIn?: "app" | "external";
  recommendedTools?: string[];
  createdAt: string;
}

const KEY = "learnico:projects";
const TONES = ["blue", "purple", "amber", "green", "pink"];

function read(): Project[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as Partial<Project>[];
    return arr.map((p) => ({
      tone: TONES[Math.floor(Math.random() * TONES.length)],
      progress: 0,
      files: [] as ProjectFile[],
      createdAt: new Date().toISOString(),
      desc: "",
      name: "",
      id: crypto.randomUUID(),
      ...p,
    }));
  } catch {
    return [];
  }
}

function write(list: Project[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("learnico:projects-updated"));
  } catch {}
}

export function getProjects(): Project[] {
  return read();
}

export function getProject(id: string): Project | undefined {
  return read().find((p) => p.id === id);
}

export function createProject(input: { name: string; desc?: string; buildIn?: "app" | "external"; recommendedTools?: string[] }): Project {
  const all = read();
  const project: Project = {
    id: crypto.randomUUID(),
    name: input.name,
    desc: input.desc || "No description yet.",
    tone: TONES[Math.floor(Math.random() * TONES.length)],
    progress: 0,
    files: [],
    buildIn: input.buildIn,
    recommendedTools: input.recommendedTools,
    createdAt: new Date().toISOString(),
  };
  write([project, ...all]);
  return project;
}

export function updateProject(id: string, patch: Partial<Project>): Project | undefined {
  const all = read();
  let updated: Project | undefined;
  const next = all.map((p) => {
    if (p.id !== id) return p;
    updated = { ...p, ...patch };
    return updated;
  });
  if (updated) write(next);
  return updated;
}

export function addFilesToProject(id: string, files: ProjectFile[]): Project | undefined {
  const project = getProject(id);
  if (!project) return undefined;
  const existing = project.files ?? [];
  const merged = [...existing];
  for (const f of files) {
    const idx = merged.findIndex((m) => m.name === f.name);
    if (idx >= 0) merged[idx] = f;
    else merged.push(f);
  }
  return updateProject(id, { files: merged });
}

export function deleteProject(id: string): void {
  const all = read().filter((p) => p.id !== id);
  write(all);
  if (typeof window !== "undefined") {
    localStorage.removeItem(`learnico:chat:${id}`);
  }
}

export function useProjects(): [Project[], () => void] {
  const [list, setList] = useState<Project[]>(() => read());
  useEffect(() => {
    const refresh = () => setList(read());
    window.addEventListener("learnico:projects-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("learnico:projects-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return [list, () => setList(read())];
}

// Chat thread storage (per project + a default unassigned thread)
export interface ChatCard {
  kind: "intro" | "step";
  title: string;
  body: string;
  encouragement?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text?: string;
  cards?: ChatCard[];
  at: string;
}

const CHAT_PREFIX = "learnico:chat:";
const DEFAULT_THREAD = "default";

export function getChat(projectId?: string | null): ChatMessage[] {
  if (typeof window === "undefined") return [];
  const key = CHAT_PREFIX + (projectId || DEFAULT_THREAD);
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

export function saveChat(projectId: string | null | undefined, msgs: ChatMessage[]): void {
  if (typeof window === "undefined") return;
  const key = CHAT_PREFIX + (projectId || DEFAULT_THREAD);
  try {
    localStorage.setItem(key, JSON.stringify(msgs));
  } catch {}
}

export function clearDefaultChat(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHAT_PREFIX + DEFAULT_THREAD);
}
