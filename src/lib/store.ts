import { useState, useEffect } from "react";

export type Plan = "Explorer" | "Builder" | "Pro" | "Titan";

export interface XpEvent {
  id: string;
  amount: number;
  reason: string;
  at: string;
}

export interface InboxItem {
  id: string;
  from: string;
  subject: string;
  kind: "company" | "promo";
  time: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  bio: string;
}

export interface UserState {
  name: string;
  level: number;
  rank: string;
  xpTotal: number;
  xpToday: number;
  xpToNext: number;
  aiSessions: number;
  filesInStudio: number;
  plan: Plan;
  inbox: InboxItem[];
  xpHistory: XpEvent[];
  streak: number;
  lastActiveDate: string;
  contact?: ContactInfo;
}

export const XP = {
  AI_MESSAGE: 10,
  CODE_EDIT: 50,
  PROJECT_CREATE: 200,
  PROJECT_COMPLETE: 2000,
};

export function computeLevel(xpTotal: number): { level: number; rank: string; xpToNext: number; pct: number } {
  const level = Math.floor(xpTotal / 1000) + 1;
  const xpToNext = level * 1000 - xpTotal;
  const pct = Math.round((xpTotal % 1000) / 10);
  const rank =
    level >= 20 ? "Elite AI Engineer" :
    level >= 15 ? "AI Architect" :
    level >= 10 ? "Stellar Builder" :
    level >= 6  ? "Builder" :
    level >= 3  ? "Code Apprentice" :
                  "AI Newcomer";
  return { level, rank, xpToNext, pct };
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function computeStreak(lastActiveDate: string, currentStreak: number): { streak: number; lastActiveDate: string } {
  const today = todayStr();
  if (lastActiveDate === today) return { streak: Math.max(currentStreak, 1), lastActiveDate };
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (lastActiveDate === yesterday) return { streak: currentStreak + 1, lastActiveDate: today };
  return { streak: 1, lastActiveDate: today };
}

const DEFAULT: UserState = {
  name: "",
  level: 1,
  rank: "AI Newcomer",
  xpTotal: 0,
  xpToday: 0,
  xpToNext: 1000,
  aiSessions: 0,
  filesInStudio: 0,
  plan: "Explorer",
  streak: 0,
  lastActiveDate: "",
  inbox: [],
  xpHistory: [],
};

const KEY = "learnico:user";

function read(): UserState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw);
    const merged = { ...DEFAULT, ...parsed };
    const { level, rank, xpToNext } = computeLevel(merged.xpTotal);
    return { ...merged, level, rank, xpToNext };
  } catch {
    return DEFAULT;
  }
}

function save(state: UserState): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

export function addXP(amount: number, reason: string, extra?: Partial<UserState>): UserState {
  const state = read();
  const { streak, lastActiveDate } = computeStreak(state.lastActiveDate || todayStr(), state.streak);
  const today = todayStr();
  const xpToday = state.lastActiveDate === today ? state.xpToday + amount : amount;

  const xpTotal = state.xpTotal + amount;
  const { level, rank, xpToNext } = computeLevel(xpTotal);

  const event: XpEvent = {
    id: crypto.randomUUID(),
    amount,
    reason,
    at: new Date().toISOString(),
  };

  const updated: UserState = {
    ...state,
    ...extra,
    xpTotal,
    xpToday,
    level,
    rank,
    xpToNext,
    streak,
    lastActiveDate,
    xpHistory: [event, ...state.xpHistory].slice(0, 50),
  };

  save(updated);
  // notify other hook instances
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("learnico:user-updated"));
  }
  return updated;
}

export function getUser(): UserState {
  return read();
}

export function setUserName(name: string): UserState {
  const state = read();
  const next = { ...state, name };
  save(next);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("learnico:user-updated"));
  }
  return next;
}

export function useUser(): [UserState, (patch: Partial<UserState>) => void] {
  const [state, setState] = useState<UserState>(() => read());

  useEffect(() => {
    const onUpdate = () => setState(read());
    window.addEventListener("learnico:user-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("learnico:user-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const update = (patch: Partial<UserState>) => {
    setState((s) => {
      const next = { ...s, ...patch };
      save(next);
      return next;
    });
  };

  return [state, update];
}

export function useXP(): (amount: number, reason: string) => UserState {
  const [, setState] = useState<UserState>(() => read());
  return (amount: number, reason: string) => {
    const next = addXP(amount, reason);
    setState(next);
    return next;
  };
}
