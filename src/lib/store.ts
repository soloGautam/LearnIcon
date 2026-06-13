import { useState } from "react";

export type Plan = "Explorer" | "Builder" | "Pro" | "Titan";

export interface Achievement {
  id: string;
  title: string;
  tone: string;
  emoji: string;
  unlockedAt?: string;
}

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
  achievements: Achievement[];
  inbox: InboxItem[];
  xpHistory: XpEvent[];
  streak: number;
  lastActiveDate: string;
  contact?: ContactInfo;
}

const ALL_ACHIEVEMENTS: Omit<Achievement, "unlockedAt">[] = [
  { id: "first_message", title: "First AI message", tone: "purple", emoji: "🧠" },
  { id: "deep_thinker", title: "10 AI sessions", tone: "blue", emoji: "💬" },
  { id: "first_project", title: "Project creator", tone: "green", emoji: "🚀" },
  { id: "shipped_it", title: "Shipped a project", tone: "amber", emoji: "✅" },
  { id: "level_5", title: "Reached Level 5", tone: "pink", emoji: "⭐" },
  { id: "level_10", title: "Reached Level 10", tone: "purple", emoji: "🏆" },
  { id: "streak_3", title: "3-day streak", tone: "amber", emoji: "🔥" },
  { id: "streak_7", title: "7-day streak", tone: "amber", emoji: "🔥" },
  { id: "xp_5000", title: "5,000 XP earned", tone: "blue", emoji: "💫" },
];

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
  if (lastActiveDate === today) return { streak: currentStreak, lastActiveDate };
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (lastActiveDate === yesterday) return { streak: currentStreak + 1, lastActiveDate: today };
  return { streak: 1, lastActiveDate: today };
}

const DEFAULT: UserState = {
  name: "Gautam",
  level: 13,
  rank: "Stellar Builder",
  xpTotal: 13420,
  xpToday: 0,
  xpToNext: 580,
  aiSessions: 0,
  filesInStudio: 0,
  plan: "Pro",
  streak: 7,
  lastActiveDate: todayStr(),
  achievements: [],
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

function checkAchievements(state: UserState): Achievement[] {
  const unlockedIds = new Set(state.achievements.map((a) => a.id));
  const newOnes: Achievement[] = [];

  const check = (id: string, condition: boolean) => {
    if (condition && !unlockedIds.has(id)) {
      const def = ALL_ACHIEVEMENTS.find((a) => a.id === id);
      if (def) newOnes.push({ ...def, unlockedAt: new Date().toISOString() });
    }
  };

  check("first_message", state.aiSessions >= 1);
  check("deep_thinker", state.aiSessions >= 10);
  check("level_5", state.level >= 5);
  check("level_10", state.level >= 10);
  check("streak_3", state.streak >= 3);
  check("streak_7", state.streak >= 7);
  check("xp_5000", state.xpTotal >= 5000);

  return [...state.achievements, ...newOnes];
}

export function addXP(amount: number, reason: string, extra?: Partial<UserState>): UserState {
  const state = read();
  const { streak, lastActiveDate } = computeStreak(state.lastActiveDate, state.streak);
  const today = todayStr();
  const xpToday = lastActiveDate === state.lastActiveDate && state.lastActiveDate === today
    ? state.xpToday + amount
    : amount;

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

  updated.achievements = checkAchievements(updated);
  save(updated);
  return updated;
}

export function getUser(): UserState {
  return read();
}

export function useUser(): [UserState, (patch: Partial<UserState>) => void] {
  const [state, setState] = useState<UserState>(() => read());

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
