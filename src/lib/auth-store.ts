import { useState } from "react";

export type AuthType = "learner" | "corporate" | null;

export type CorporatePlan = "Pilot" | "Growth" | "Scale" | null;

export interface CorporateState {
  companyName: string;
  industry: string;
  needs: string;
  email: string;
  plan: CorporatePlan;
  onboarded: boolean;
  recentProfileVisits: {
    id: string;
    name: string;
    role: string;
    xp: number;
    level: number;
    hasBuilderBadge: boolean;
    time: string;
  }[];
  hiringCriteria: {
    minXpLevel: string;
    wantBuilderBadge: boolean;
    buildType: string;
  };
}

export interface AuthState {
  type: AuthType;
  corporate: CorporateState | null;
}

const DEFAULT_AUTH: AuthState = {
  type: null,
  corporate: null,
};

const KEY = "learnico:auth";

function readFromStorage(): AuthState {
  if (typeof window === "undefined") return DEFAULT_AUTH;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_AUTH;
    return { ...DEFAULT_AUTH, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_AUTH;
  }
}

function writeToStorage(state: AuthState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}

export function setAuth(patch: Partial<AuthState>): AuthState {
  const current = readFromStorage();
  const next = { ...current, ...patch };
  writeToStorage(next);
  return next;
}

export function getAuth(): AuthState {
  return readFromStorage();
}

const APP_LOCAL_KEYS = [
  "learnico:auth",
  "learnico:user",
  "learnico:projects",
  "learnico:jobs",
  "learnico:active-project",
  "selectedProject",
];

export function clearAuth(): void {
  if (typeof window === "undefined") return;
  try {
    // Clear all app-level local data so the next sign-in is a fresh profile.
    for (const k of APP_LOCAL_KEYS) {
      localStorage.removeItem(k);
    }
    // Per-project chat threads
    Object.keys(localStorage)
      .filter((k) => k.startsWith("learnico:chat:"))
      .forEach((k) => localStorage.removeItem(k));
    // Intro replay flags, etc.
    sessionStorage.clear();
  } catch {}
}

export function useAuth(): [AuthState, (patch: Partial<AuthState>) => void, () => void] {
  const [state, setState] = useState<AuthState>(() => readFromStorage());

  const update = (patch: Partial<AuthState>) => {
    const next = setAuth(patch);
    setState(next);
  };

  const logout = () => {
    clearAuth();
    setState(DEFAULT_AUTH);
    if (typeof window !== "undefined") window.location.href = "/login";
  };

  return [state, update, logout];
}
