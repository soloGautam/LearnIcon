import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth, getAuth, type CorporatePlan } from "@/lib/auth-store";
import { CorporateShell } from "@/components/CorporateShell";
import { Check, Zap, TrendingUp, Globe } from "lucide-react";

const PLANS = [
  {
    name: "Pilot" as CorporatePlan,
    price: "$0",
    cadence: "Free",
    tagline: "Test if hiring from LearnIcon works for you.",
    icon: <Zap className="size-5" />,
    features: [
      "View top 50 students",
      "Post 2 job listings",
      "Shortlist 5 students",
      "Goal: Test if hiring works",
    ],
    cta: "Start Free",
    tone: "blue",
  },
  {
    name: "Growth" as CorporatePlan,
    price: "$49",
    cadence: "per month",
    tagline: "Scale your sourcing with analytics and more reach.",
    icon: <TrendingUp className="size-5" />,
    features: [
      "View top 200 students",
      "Post 10 job listings",
      "Shortlist 50 students/month",
      "Basic analytics",
    ],
    cta: "Get Growth",
    tone: "purple",
    badge: "Popular",
  },
  {
    name: "Scale" as CorporatePlan,
    price: "$149",
    cadence: "per month",
    tagline: "Full access to every builder on LearnIcon.",
    icon: <Globe className="size-5" />,
    features: [
      "View all students",
      "Unlimited job postings",
      "Unlimited candidate shortlists",
      "Full analytics + recruiter tools",
    ],
    cta: "Go Scale",
    tone: "amber",
    badge: "Best Value",
  },
];

function CorporatePlansPage() {
  const [auth, update] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const a = getAuth();
    if (a.type !== "corporate") navigate("/login");
    else if (!a.corporate?.onboarded) navigate("/corporate/onboarding");
  }, []);

  if (auth.type !== "corporate" || !auth.corporate?.onboarded) return null;

  const currentPlan = auth.corporate.plan;

  const selectPlan = (planName: CorporatePlan) => {
    update({
      corporate: {
        ...auth.corporate!,
        plan: planName,
      },
    });
  };

  return (
    <CorporateShell>
      <div className="mx-auto max-w-[1100px] animate-float-up">
        <div className="mb-10 text-center">
          <div className="text-xs font-medium uppercase tracking-wider text-[oklch(0.55_0.18_270)]">Corporate Pricing</div>
          <h1 className="mt-2 font-display text-4xl md:text-5xl text-foreground">Hire from the best builders.</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Every plan gives you access to LearnIcon's verified AI builder community. Start free, scale when ready.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PLANS.map((p) => {
            const isActive = currentPlan === p.name;
            const toneClass = `tone-${p.tone}`;
            return (
              <div key={p.name} className={`relative ${toneClass} flex flex-col rounded-3xl p-6 shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-1 ${isActive ? "ring-2 ring-[oklch(0.55_0.18_270)]" : ""}`}>
                {p.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-background shadow-md">
                    {p.badge}
                  </div>
                )}
                {isActive && (
                  <div className="absolute -top-3.5 right-4 rounded-full bg-[oklch(0.55_0.18_270)] px-3 py-1 text-[10px] font-semibold text-white shadow-md">
                    Active
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

                <ul className="mt-5 flex-1 space-y-2.5">
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
                  onClick={() => selectPlan(p.name)}
                  className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[oklch(0.55_0.18_270)] text-white cursor-default opacity-80"
                      : "bg-gradient-to-r from-[oklch(0.6_0.18_240)] to-[oklch(0.55_0.18_270)] text-white shadow-[0_8px_28px_oklch(0.6_0.18_240/0.35)] hover:opacity-95"
                  }`}
                >
                  {isActive ? "Current Plan" : p.cta}
                </button>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Prices in USD. Cancel anytime. Enterprise custom pricing available — contact us.
        </p>
      </div>
    </CorporateShell>
  );
}

export default CorporatePlansPage;
