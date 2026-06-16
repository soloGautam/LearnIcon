import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { setAuth, clearAuth } from "@/lib/auth-store";
import { setUserName } from "@/lib/store";
import { GraduationCap, Building2, ArrowRight, Sparkles } from "lucide-react";

type Mode = "select" | "learner" | "corporate";

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("select");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLearnerSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Always start a fresh local profile on a new sign-in.
    clearAuth();
    setAuth({ type: "learner", corporate: null });
    setUserName(name.trim() || "Learner");
    navigate("/");
  };

  const handleCorporateSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearAuth();
    setAuth({
      type: "corporate",
      corporate: {
        companyName: "",
        industry: "",
        needs: "",
        email,
        plan: null,
        onboarded: false,
        recentProfileVisits: [],
        hiringCriteria: { minXpLevel: "", wantBuilderBadge: false, buildType: "" },
      },
    });
    navigate("/corporate/onboarding");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[oklch(0.97_0.02_310)] px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-[oklch(0.85_0.1_310)] opacity-30 blur-3xl" />
        <div className="absolute bottom-0 right-0 size-[400px] rounded-full bg-[oklch(0.9_0.09_80)] opacity-25 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-float-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.7_0.18_290)] to-[oklch(0.78_0.14_350)] text-white shadow-[var(--shadow-glow)]">
            <span className="font-display text-2xl leading-none">L</span>
          </div>
          <h1 className="font-display text-3xl text-foreground">Welcome to LearnIcon</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "select" ? "How are you joining today?" : mode === "learner" ? "Sign in as a learner" : "Sign in as a company"}
          </p>
        </div>

        {mode === "select" && (
          <div className="grid gap-4">
            <button
              onClick={() => setMode("learner")}
              className="glass-card flex items-center gap-4 p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] group"
            >
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.78_0.14_290)] to-[oklch(0.82_0.12_350)] text-white shadow-md">
                <GraduationCap className="size-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-lg text-foreground">Learner / Student</div>
                <div className="text-sm text-muted-foreground">Build AI projects, earn XP, get placed.</div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => setMode("corporate")}
              className="glass-card flex items-center gap-4 p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] group"
            >
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.6_0.18_240)] to-[oklch(0.55_0.18_270)] text-white shadow-md">
                <Building2 className="size-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-display text-lg text-foreground">Company / Corporate</div>
                <div className="text-sm text-muted-foreground">Hire verified AI builders from our leaderboard.</div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        )}

        {mode === "learner" && (
          <form onSubmit={handleLearnerSignIn} className="glass-card p-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground/70">Your name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aanya Sharma"
                className="w-full rounded-xl border border-border bg-white/70 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground/70">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-xl border border-border bg-white/70 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[oklch(0.7_0.17_350)] to-[oklch(0.65_0.18_300)] px-4 py-3 text-sm font-medium text-white shadow-[0_8px_28px_oklch(0.7_0.18_350/0.3)] transition-opacity hover:opacity-95 disabled:opacity-60"
            >
              {loading ? "Signing in…" : <><Sparkles className="size-4" /> Continue as Learner</>}
            </button>
            <button type="button" onClick={() => setMode("select")} className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
              ← Back
            </button>
          </form>
        )}

        {mode === "corporate" && (
          <form onSubmit={handleCorporateSignIn} className="glass-card p-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-foreground/70">Work email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hiring@yourcompany.com"
                className="w-full rounded-xl border border-border bg-white/70 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[oklch(0.6_0.18_240)] to-[oklch(0.55_0.18_270)] px-4 py-3 text-sm font-medium text-white shadow-[0_8px_28px_oklch(0.6_0.18_240/0.3)] transition-opacity hover:opacity-95 disabled:opacity-60"
            >
              {loading ? "Signing in…" : <><Building2 className="size-4" /> Continue as Company</>}
            </button>
            <button type="button" onClick={() => setMode("select")} className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
              ← Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
