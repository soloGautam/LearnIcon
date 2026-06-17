import { useEffect, useState } from "react";

export type PlanTier = "Explorer" | "Builder" | "Pro" | "Titan";

export const PLAN_ALLOWANCE: Record<PlanTier, number> = {
  Explorer: 100,   // free
  Builder: 1500,   // $6 / month
  Pro: 3000,       // $12 / month
  Titan: 2000,     // per year (effectively monthly bucket of 2000 spread over a year)
};

export const CREDIT_COST = {
  AI_RESPONSE: 2,
  AI_RESPONSE_LONG: 5,
  CODE_GENERATION: 7,
} as const;

type CreditState = {
  plan: PlanTier;
  used: number;          // credits used this period
  periodStart: string;   // ISO date marking start of current month
  history: { at: string; amount: number; reason: string }[];
};

const KEY = "learnico:credits";

function startOfMonthISO(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString();
}

function defaults(): CreditState {
  return { plan: "Explorer", used: 0, periodStart: startOfMonthISO(), history: [] };
}

function read(): CreditState {
  if (typeof window === "undefined") return defaults();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    const s = JSON.parse(raw) as CreditState;
    // Reset on new month
    if (new Date(s.periodStart).getMonth() !== new Date().getMonth() ||
        new Date(s.periodStart).getFullYear() !== new Date().getFullYear()) {
      return { ...s, used: 0, periodStart: startOfMonthISO(), history: [] };
    }
    return s;
  } catch {
    return defaults();
  }
}

function write(s: CreditState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event("learnico:credits:update"));
}

export function getCredits(): CreditState {
  return read();
}

export function getAllowance(state = read()): number {
  return PLAN_ALLOWANCE[state.plan];
}

export function getRemaining(state = read()): number {
  return Math.max(0, getAllowance(state) - state.used);
}

export function canSpend(amount: number): boolean {
  return getRemaining() >= amount;
}

export function spendCredits(amount: number, reason: string): CreditState {
  const s = read();
  const next: CreditState = {
    ...s,
    used: s.used + amount,
    history: [{ at: new Date().toISOString(), amount, reason }, ...s.history].slice(0, 50),
  };
  write(next);
  return next;
}

export function setPlan(plan: PlanTier): CreditState {
  const s = read();
  const next = { ...s, plan };
  write(next);
  return next;
}

export function useCredits(): {
  state: CreditState;
  remaining: number;
  allowance: number;
  setPlan: (p: PlanTier) => void;
} {
  const [state, setState] = useState<CreditState>(() => read());
  useEffect(() => {
    const sync = () => setState(read());
    window.addEventListener("learnico:credits:update", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("learnico:credits:update", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return {
    state,
    remaining: getRemaining(state),
    allowance: getAllowance(state),
    setPlan: (p: PlanTier) => setState(setPlan(p)),
  };
}
