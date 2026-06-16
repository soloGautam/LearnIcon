import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth, setAuth } from "@/lib/auth-store";
import { Building2, ChevronRight, Check } from "lucide-react";

const INDUSTRIES = [
  "Technology / SaaS", "Fintech", "Healthcare / MedTech", "E-commerce", "Media / Entertainment",
  "Education", "AI / ML", "Consulting", "Gaming", "Other",
];

function CorporateOnboarding() {
  const [auth, update] = useAuth();
  const navigate = useNavigate();
  const corp = auth.corporate;

  const [step, setStep] = useState(0);
  const [companyName, setCompanyName] = useState(corp?.companyName ?? "");
  const [industry, setIndustry] = useState(corp?.industry ?? "");
  const [needs, setNeeds] = useState(corp?.needs ?? "");

  const steps = [
    { label: "Company name" },
    { label: "Industry" },
    { label: "Hiring needs" },
  ];

  const canNext = [
    companyName.trim().length > 0,
    industry.length > 0,
    needs.trim().length > 0,
  ];

  const handleFinish = () => {
    setAuth({
      corporate: {
        ...(corp ?? {
          email: "",
          plan: null,
          recentProfileVisits: [],
          hiringCriteria: { minXpLevel: "", wantBuilderBadge: false, buildType: "" },
        }),
        companyName,
        industry,
        needs,
        onboarded: true,
      },
    });
    navigate("/corporate");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[oklch(0.97_0.02_310)] px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[500px] rounded-full bg-[oklch(0.85_0.08_240)] opacity-30 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg animate-float-up">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.6_0.18_240)] to-[oklch(0.55_0.18_270)] text-white shadow-md">
              <Building2 className="size-5" />
            </div>
            <div>
              <div className="font-display text-xl text-foreground">Company Setup</div>
              <div className="text-xs text-muted-foreground">Just 3 quick questions</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`flex items-center justify-center size-6 rounded-full text-[10px] font-semibold transition-all ${
                  i < step ? "bg-[oklch(0.6_0.18_240)] text-white" :
                  i === step ? "bg-[oklch(0.6_0.18_240)] text-white ring-4 ring-[oklch(0.6_0.18_240/0.2)]" :
                  "bg-[oklch(0.92_0.03_240)] text-muted-foreground"
                }`}>
                  {i < step ? <Check className="size-3" /> : i + 1}
                </div>
                <span className={`text-xs ${i === step ? "font-medium text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                {i < steps.length - 1 && <div className={`h-px w-6 ${i < step ? "bg-[oklch(0.6_0.18_240)]" : "bg-border"}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-7">
          {step === 0 && (
            <div className="space-y-3">
              <label className="font-display text-xl text-foreground">What is the name of your company?</label>
              <p className="text-sm text-muted-foreground">This will appear on your company profile on LearnIcon.</p>
              <input
                autoFocus
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Corp, Stripe, OpenAI"
                className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[oklch(0.6_0.18_240)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.6_0.18_240/0.2)]"
                onKeyDown={(e) => e.key === "Enter" && canNext[0] && setStep(1)}
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <label className="font-display text-xl text-foreground">What industry is your company in?</label>
              <p className="text-sm text-muted-foreground">We'll use this to surface the most relevant builders for you.</p>
              <div className="grid grid-cols-2 gap-2">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setIndustry(ind)}
                    className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-all ${
                      industry === ind
                        ? "border-[oklch(0.6_0.18_240)] bg-[oklch(0.93_0.04_240)] text-foreground font-medium"
                        : "border-border bg-white/60 text-foreground/70 hover:bg-white/90"
                    }`}
                  >
                    {ind}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <label className="font-display text-xl text-foreground">What are your hiring needs?</label>
              <p className="text-sm text-muted-foreground">Tell us what kind of AI talent you're looking for.</p>
              <textarea
                autoFocus
                rows={5}
                value={needs}
                onChange={(e) => setNeeds(e.target.value)}
                placeholder="e.g. We're looking for ML engineers who can build RAG pipelines, deploy models to production, and work with our existing Python stack…"
                className="w-full resize-none rounded-xl border border-border bg-white/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[oklch(0.6_0.18_240)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.6_0.18_240/0.2)]"
              />
            </div>
          )}

          <div className="mt-6 flex justify-end">
            {step < 2 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canNext[step]}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[oklch(0.6_0.18_240)] to-[oklch(0.55_0.18_270)] px-5 py-2.5 text-sm font-medium text-white shadow-md transition-opacity hover:opacity-95 disabled:opacity-40"
              >
                Next <ChevronRight className="size-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!canNext[2]}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[oklch(0.6_0.18_240)] to-[oklch(0.55_0.18_270)] px-6 py-2.5 text-sm font-medium text-white shadow-md transition-opacity hover:opacity-95 disabled:opacity-40"
              >
                <Check className="size-4" /> Enter portal
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CorporateOnboarding;
