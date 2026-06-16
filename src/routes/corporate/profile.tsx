import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth, getAuth } from "@/lib/auth-store";
import { CorporateShell } from "@/components/CorporateShell";
import { Mail, Building2, Briefcase, ShieldCheck, CheckCircle2, Save } from "lucide-react";

const XP_LEVELS = ["Any level", "Level 5+", "Level 8+", "Level 10+", "Level 12+", "Level 15+"];
const BUILD_TYPES = ["Web Apps", "Mobile Apps", "AI Agents", "Data Pipelines", "APIs / Backends", "LLM Applications", "No preference"];

function CorporateProfilePage() {
  const [auth, update, logout] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const a = getAuth();
    if (a.type !== "corporate") navigate("/login");
    else if (!a.corporate?.onboarded) navigate("/corporate/onboarding");
  }, []);

  const corp = auth.corporate;

  const [minXpLevel, setMinXpLevel] = useState(corp?.hiringCriteria.minXpLevel ?? "");
  const [wantBuilderBadge, setWantBuilderBadge] = useState(corp?.hiringCriteria.wantBuilderBadge ?? false);
  const [buildType, setBuildType] = useState(corp?.hiringCriteria.buildType ?? "");
  const [saved, setSaved] = useState(false);

  if (auth.type !== "corporate" || !corp?.onboarded) return null;

  const handleSave = () => {
    update({
      corporate: {
        ...corp,
        hiringCriteria: { minXpLevel, wantBuilderBadge, buildType },
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <CorporateShell>
      <div className="mx-auto max-w-3xl animate-float-up space-y-6">
        <div className="glass-card relative overflow-hidden p-6 md:p-8">
          <div className="absolute -right-10 -top-10 size-64 rounded-full bg-[oklch(0.75_0.12_270)] opacity-20 blur-3xl" />
          <div className="relative flex items-center gap-5">
            <div className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.6_0.18_240)] to-[oklch(0.55_0.18_270)] font-display text-2xl text-white shadow-lg">
              {corp.companyName.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-3xl text-foreground">{corp.companyName}</h1>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4" />
                <span className="truncate">{corp.email}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium text-foreground/75">
                  <Building2 className="size-3" /> {corp.industry}
                </span>
                {corp.plan && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.93_0.04_240)] px-3 py-1 text-xs font-semibold text-[oklch(0.5_0.18_270)]">
                    <ShieldCheck className="size-3" /> {corp.plan} Plan
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 space-y-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Briefcase className="size-4" /> Hiring Preferences
          </div>
          <p className="text-sm text-muted-foreground -mt-2">
            These preferences help us surface the right builders for your company.
          </p>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">What XP level do you seek?</label>
            <div className="grid grid-cols-3 gap-2">
              {XP_LEVELS.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setMinXpLevel(lvl)}
                  className={`rounded-xl border px-3 py-2 text-sm transition-all ${
                    minXpLevel === lvl
                      ? "border-[oklch(0.6_0.18_240)] bg-[oklch(0.93_0.04_240)] font-medium text-foreground"
                      : "border-border bg-white/60 text-foreground/70 hover:bg-white/90"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Do you want students with Builder Badges?
            </label>
            <div className="rounded-xl border border-border bg-white/60 p-4">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => setWantBuilderBadge(!wantBuilderBadge)}
                  className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border-2 transition-all ${
                    wantBuilderBadge ? "border-[oklch(0.6_0.18_240)] bg-[oklch(0.6_0.18_240)]" : "border-border bg-white"
                  }`}
                >
                  {wantBuilderBadge && <CheckCircle2 className="size-3 text-white" />}
                </button>
                <div>
                  <div className="text-sm font-medium text-foreground">Require Builder Badge</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    The <span className="font-semibold text-foreground/70">Builder Badge</span> is awarded to learners on <span className="font-medium">Builder, Pro, or Titan</span> plans who have shipped 5 working AI projects. It is a verified signal of hands-on, real-world capability.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">What kind of build requirements do you have?</label>
            <div className="grid grid-cols-2 gap-2">
              {BUILD_TYPES.map((bt) => (
                <button
                  key={bt}
                  onClick={() => setBuildType(bt)}
                  className={`rounded-xl border px-3 py-2.5 text-left text-sm transition-all ${
                    buildType === bt
                      ? "border-[oklch(0.6_0.18_240)] bg-[oklch(0.93_0.04_240)] font-medium text-foreground"
                      : "border-border bg-white/60 text-foreground/70 hover:bg-white/90"
                  }`}
                >
                  {bt}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all ${
              saved
                ? "bg-[oklch(0.6_0.15_155)] text-white"
                : "bg-gradient-to-r from-[oklch(0.6_0.18_240)] to-[oklch(0.55_0.18_270)] text-white shadow-md hover:opacity-95"
            }`}
          >
            {saved ? <><CheckCircle2 className="size-4" /> Saved!</> : <><Save className="size-4" /> Save Preferences</>}
          </button>
        </div>

        <div className="glass-card p-5 space-y-3">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Company Needs</div>
          <p className="text-sm text-foreground/70 whitespace-pre-wrap">{corp.needs || "No needs statement set."}</p>
        </div>

        <div className="glass-card flex items-center justify-between p-5">
          <div>
            <div className="font-display text-lg text-foreground">Sign out</div>
            <div className="text-xs text-muted-foreground">You can sign back in anytime with {corp.email}.</div>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.65_0.2_25)] px-4 py-2 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition-opacity hover:opacity-90"
          >
            Log out
          </button>
        </div>
      </div>
    </CorporateShell>
  );
}

export default CorporateProfilePage;
