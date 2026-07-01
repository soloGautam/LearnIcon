import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getUser } from "@/lib/store";
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
async function getProfileId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}
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

export async function createProject(input: {
  name: string;
  desc?: string;
  buildIn?: "app" | "external";
  recommendedTools?: string[];
}) {
  const profileId = await getProfileId();
  console.log("createProject() profileId =", profileId);
console.log("Supabase auth user:", profileId);

  if (!profileId) {
    const project = {
      id: crypto.randomUUID(),
      name: input.name,
      desc: input.desc ?? "",
      tone: TONES[Math.floor(Math.random() * TONES.length)],
      progress: 0,
      files: [],
      buildIn: input.buildIn,
      recommendedTools: input.recommendedTools ?? [],
      createdAt: new Date().toISOString(),
    };

    const list = read();
    list.unshift(project);
    write(list);

    return project;
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      profile_id: profileId,
      name: input.name,
      description: input.desc,
      tone: TONES[Math.floor(Math.random() * TONES.length)],
      progress: 0,
      build_in: input.buildIn,
      recommended_tools: input.recommendedTools ?? [],
    })
    .select()
    .single();

  if (error) throw error;

  window.dispatchEvent(
    new CustomEvent("learnico:projects-updated")
  );

  return data;
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
  const [list, setList] = useState<Project[]>([]);

  const refresh = async () => {
    const profileId = await getProfileId();
  console.log("createProject() profileId =", profileId);
    if (!profileId) return;

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setList(
      (data ?? []).map((p: any) => ({
        id: p.id,
        name: p.name,
        desc: p.description ?? "",
        tone: p.tone,
        progress: p.progress ?? 0,
        files: [],
        buildIn: p.build_in,
        recommendedTools: p.recommended_tools ?? [],
        createdAt: p.created_at,
      }))
    );
  };

  useEffect(() => {
    refresh();

    window.addEventListener("learnico:projects-updated", refresh);

    return () => {
      window.removeEventListener("learnico:projects-updated", refresh);
    };
  }, []);

  return [list, refresh];
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

export async function getChat(projectId?: string | null): Promise<ChatMessage[]> {
  if (!projectId) return [];

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return data.map((m: any) => ({
    id: m.id,
    role: m.role,
    text: m.text,
    cards: m.cards ?? undefined,
    at: m.created_at,
  }));
}
export async function saveChat(
  projectId: string | null | undefined,
  msgs: ChatMessage[]
): Promise<void> {
  if (!projectId) return;

  const profileId = await getProfileId();

  // Guest mode → save locally
  if (!profileId) {
    localStorage.setItem(
      `learnico:chat:${projectId}`,
      JSON.stringify(msgs)
    );
    return;
  }

  await supabase.from("messages").delete().eq("project_id", projectId);

  if (msgs.length === 0) return;

  const rows = msgs.map((m) => ({
    project_id: projectId,
    role: m.role,
    text: m.text ?? "",
    cards: m.cards ?? null,
    created_at: m.at,
  }));

  const { error } = await supabase
    .from("messages")
    .insert(rows);

  if (error) throw error;
}

export function clearDefaultChat(): void {
  // no-op (default thread removed after DB migration)
}