
import { Check, Crown, Sparkles, Rocket, Star, Zap } from "lucide-react";
import { CrystalParticles } from "@/components/CrystalParticles";
import { useCredits, type PlanTier, PLAN_ALLOWANCE, CREDIT_COST } from "@/lib/credits-store";

type Plan = {
  name: PlanTier;
  price: string;
  cadence: string;
  tagline: string;
  features: string[];
  cta: string;
  badge?: string;
  tone: "blue" | "green" | "purple" | "amber" | "pink";
  icon: React.ReactNode;
  glow?: "pink" | "blue";
};

const plans: Plan[] = [
  {
    name: "Explorer",
    price: "$0",
    cadence: "free forever",
    tagline: "Start your AI journey, no card needed.",
    features: [
      `${PLAN_ALLOWANCE.Explorer} AI credits / month`,
      "Code Studio - Edit & ship projects",
      "Community leaderboard",
      "Powered by Claude Haiku 4.5",
    ],
    cta: "Start free",
    tone: "blue",
    icon: <Sparkles className="size-5" />,
  },
  {
    name: "Builder",
    price: "$6",
    cadence: "per month",
    tagline: "For students shipping their first real projects.",
    features: [
      `${PLAN_ALLOWANCE.Builder.toLocaleString()} AI credits / month`,
      "Code Studio - Edit & ship projects",
      "XP leaderboard ranking",
      "Priority support",
    ],
    cta: "Become a Builder",
    tone: "green",
    icon: <Rocket className="size-5" />,
  },
  {
    name: "Pro",
    price: "$12",
    cadence: "per month",
    tagline: "For builders ready to be discovered.",
    features: [
      `${PLAN_ALLOWANCE.Pro.toLocaleString()} AI credits / month`,
      "Everything in Builder +",
      "Earn builder badge by reaching Level 10",
      "Featured on verified builders list",
    ],
    cta: "Go Pro",
    badge: "Most Popular",
    tone: "pink",
    icon: <Star className="size-5" />,
    glow: "pink",
  },
  {
    name: "Titan",
    price: "$99",
    cadence: "per year",
    tagline: "For teams, founders & power users.",
    features: [
      `${PLAN_ALLOWANCE.Titan.toLocaleString()} AI credits / month for a year`,
      "Everything in Pro +",
      "Access to corporate hiring features",
      "Premium support & priority queue",
    ],
    cta: "Become a Titan",
    badge: "Best Value",
    tone: "blue",
    icon: <Crown className="size-5" />,
    glow: "blue",
  },
];

function PlanCard({ p, current, onSelect }: { p: Plan; current: boolean; onSelect: () => void }) {
  const toneClass = { blue: "tone-blue", green: "tone-green", purple: "tone-purple", amber: "tone-amber", pink: "tone-pink" }[p.tone];
  const isPro = p.name === "Pro";
  const isTitan = p.name === "Titan";
  return (
    <div className={`relative ${toneClass} flex flex-col rounded-3xl p-6 shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-1 ${isPro || isTitan ? "lg:scale-[1.02]" : ""}`}>
      {p.glow === "pink" && <CrystalParticles color="#ff7ab8" count={32} />}
      {p.glow === "blue" && <CrystalParticles color="#7ad0ff" count={32} />}

      <div className="relative">
        {p.badge && (
          <div className="absolute -top-9 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-background shadow-md">
            {p.badge}
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-2xl bg-white/80 text-foreground/80">{p.icon}</div>
          <div className="font-display text-2xl text-foreground">{p.name}</div>
          {current && <span className="ml-auto rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold text-background">Current</span>}
        </div>
        <p className="mt-2 text-sm text-foreground/70">{p.tagline}</p>

        <div className="mt-5 flex items-baseline gap-1">
          <span className="font-display text-5xl text-foreground">{p.price}</span>
          <span className="text-sm text-foreground/60">/ {p.cadence}</span>
        </div>

        <ul className="mt-5 space-y-2.5">
          {p.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
              <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-white/80">
                <Check className="size-3 text-foreground/70" />
              </span>
              {f}
            </li>
          ))}
        </ul>

        <button
          onClick={onSelect}
          disabled={current}
          className={
            "mt-6 w-full rounded-xl px-4 py-3 text-sm font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed " +
            (isPro
              ? "bg-gradient-to-r from-[oklch(0.7_0.17_350)] to-[oklch(0.65_0.18_300)] text-white shadow-[0_8px_28px_oklch(0.7_0.18_350/0.4)] hover:opacity-95"
              : isTitan
                ? "bg-gradient-to-r from-[oklch(0.6_0.18_240)] to-[oklch(0.55_0.18_270)] text-white shadow-[0_8px_28px_oklch(0.6_0.18_240/0.4)] hover:opacity-95"
                : "bg-white text-foreground border border-border hover:bg-white/90")
          }
        >
          {current ? "Your current plan" : p.cta}
        </button>
      </div>
    </div>
  );
}

function PlansPage() {
  const { state, remaining, allowance, setPlan } = useCredits();
  return (
    <div className="mx-auto max-w-[1400px] animate-float-up">
      <div className="mb-10 text-center">
        <div className="text-xs font-medium uppercase tracking-wider text-primary">Pricing · Powered by Claude Haiku 4.5</div>
        <h1 className="mt-2 font-display text-4xl md:text-5xl text-foreground">Choose your launchpad.</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          One quiet, beautiful interface. Four tiers — credits power every AI response, long answer, and code generation.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs text-foreground/80 shadow-sm">
          <Zap className="size-3 text-primary" />
          <strong>{remaining}</strong> / {allowance} credits left · {state.plan} plan
        </div>
        <div className="mt-3 text-[11px] text-muted-foreground">
          AI response = {CREDIT_COST.AI_RESPONSE} credits · Long response = {CREDIT_COST.AI_RESPONSE_LONG} credits · Code generation = {CREDIT_COST.CODE_GENERATION} credits
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 mt-10">
        {plans.map((p) => (
          <PlanCard
            key={p.name}
            p={p}
            current={state.plan === p.name}
            onSelect={async () => {
  const plan = p.name.toLowerCase();

  if (plan === "explorer") {
    setPlan("Explorer");
    return;
  }

  const res = await fetch("/api/create-checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ plan }),
  });

  const data = await res.json();

  window.location.href = data.url;
}}
          />
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Prices in USD. Cancel anytime. Student verification unlocks 20% off Pro & Titan.
      </p>
    </div>
  );
}

export default PlansPage;
