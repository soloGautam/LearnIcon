
import { Check, Crown, Sparkles, Rocket, Star } from "lucide-react";
import { CrystalParticles } from "@/components/CrystalParticles";

type Plan = {
  name: string;
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
    features: ["10 AI questions daily", "Basic editor", "Community leaderboard", "Ads shown"],
    cta: "Start free",
    tone: "blue",
    icon: <Sparkles className="size-5" />,
  },
  {
    name: "Builder",
    price: "$6",
    cadence: "per month",
    tagline: "For students shipping their first real projects.",
    features: ["100 AI questions daily", "Full editor", "Concept quizzes", "XP leaderboard", "Priority support", "Fewer ads"],
    cta: "Become a Builder",
    tone: "green",
    icon: <Rocket className="size-5" />,
  },
  {
    name: "Pro",
    price: "$12",
    cadence: "per month",
    tagline: "For builders preparing to get hired.",
    features: ["Unlimited AI questions", "Advanced editor", "Quiz analytics", "Placement profile", "Verified builder badge", "No ads"],
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
    features: ["Everything in Pro", "Team workspace (up to 10)", "White-glove onboarding", "Custom AI persona", "API access", "Admin dashboard", "No ads"],
    cta: "Become a Titan",
    badge: "Best Value",
    tone: "blue",
    icon: <Crown className="size-5" />,
    glow: "blue",
  },
];

function PlanCard({ p }: { p: Plan }) {
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
          className={
            "mt-6 w-full rounded-xl px-4 py-3 text-sm font-medium transition-all " +
            (isPro
              ? "bg-gradient-to-r from-[oklch(0.7_0.17_350)] to-[oklch(0.65_0.18_300)] text-white shadow-[0_8px_28px_oklch(0.7_0.18_350/0.4)] hover:opacity-95"
              : isTitan
                ? "bg-gradient-to-r from-[oklch(0.6_0.18_240)] to-[oklch(0.55_0.18_270)] text-white shadow-[0_8px_28px_oklch(0.6_0.18_240/0.4)] hover:opacity-95"
                : "bg-white text-foreground border border-border hover:bg-white/90")
          }
        >
          {p.cta}
        </button>
      </div>
    </div>
  );
}

function PlansPage() {
  return (
    <div className="mx-auto max-w-[1400px] animate-float-up">
      <div className="mb-10 text-center">
        <div className="text-xs font-medium uppercase tracking-wider text-primary">Pricing</div>
        <h1 className="mt-2 font-display text-4xl md:text-5xl text-foreground">Choose your launchpad.</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          One quiet, beautiful interface. Four tiers — from your first AI question to your first paid AI role.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 mt-10">
        {plans.map((p) => (
          <PlanCard key={p.name} p={p} />
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Prices in USD. Cancel anytime. Student verification unlocks 20% off Pro & Titan.
      </p>
    </div>
  );
}

export default PlansPage;
