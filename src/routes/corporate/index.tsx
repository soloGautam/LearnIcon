import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { useAuth, getAuth, setAuth } from "@/lib/auth-store";
import { CorporateShell } from "@/components/CorporateShell";
import {
  Users, Briefcase, Eye, ShieldCheck, Sparkles, ArrowUpRight,
  Building2, Trophy, CheckCircle2,
} from "lucide-react";

function CorporateDashboardPage() {
  const [auth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const a = getAuth();
    if (a.type !== "corporate") { navigate("/login"); return; }
    if (!a.corporate?.onboarded) { navigate("/corporate/onboarding"); }
  }, []);

  if (auth.type !== "corporate" || !auth.corporate?.onboarded) return null;

  const corp = auth.corporate;

  const stats = [
    { tone: "blue", icon: <Eye className="size-4" />, label: "Profile Views", value: String(corp.recentProfileVisits.length || 0), sub: "students browsed" },
    { tone: "purple", icon: <Trophy className="size-4" />, label: "Top Learners", value: "1,240+", sub: "on leaderboard" },
    { tone: "green", icon: <Briefcase className="size-4" />, label: "Active Listings", value: corp.plan ? "2" : "0", sub: corp.plan ?? "no plan yet" },
    { tone: "amber", icon: <Users className="size-4" />, label: "Messages Sent", value: "0", sub: "this month" },
  ];

  const sampleVisits = corp.recentProfileVisits.length > 0 ? corp.recentProfileVisits : [
    { id: "v1", name: "Aanya R.", role: "ML Engineer", xp: 12860, level: 14, hasBuilderBadge: true, time: "2h" },
    { id: "v2", name: "Karthik S.", role: "AI Product Manager", xp: 9400, level: 11, hasBuilderBadge: true, time: "1d" },
    { id: "v3", name: "Mia T.", role: "Applied AI", xp: 7200, level: 9, hasBuilderBadge: false, time: "2d" },
  ];

  return (
    <CorporateShell>
      <div className="mx-auto max-w-[1400px] animate-float-up space-y-6">
        <div className="glass-card relative overflow-hidden p-6 md:p-8">
          <div className="absolute -right-10 -top-10 size-64 rounded-full bg-[oklch(0.75_0.12_270)] opacity-20 blur-3xl" />
          <div className="relative">
            <div className="text-sm text-muted-foreground">Welcome back</div>
            <h1 className="font-display text-4xl text-foreground">{corp.companyName}</h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              You're looking for <span className="text-foreground font-medium">{corp.industry}</span> talent. Browse verified AI builders below.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/corporate/top-learners"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[oklch(0.6_0.18_240)] to-[oklch(0.55_0.18_270)] px-4 py-2 text-sm font-medium text-white shadow-md hover:opacity-95"
              >
                <Trophy className="size-4" /> Browse Top Learners
              </Link>
              <Link
                to="/corporate/plans"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-medium text-foreground hover:bg-white"
              >
                <Sparkles className="size-4" /> View Plans
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className={`tone-${s.tone} rounded-2xl p-5 shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5`}>
              <div className="mb-3 flex items-center justify-between">
                <div className="grid size-9 place-items-center rounded-xl bg-white/70 text-foreground/80">{s.icon}</div>
                <ArrowUpRight className="size-4 text-foreground/40" />
              </div>
              <div className="text-xs font-medium uppercase tracking-wider text-foreground/60">{s.label}</div>
              <div className="mt-1 font-display text-3xl text-foreground">{s.value}</div>
              <div className="mt-1 text-xs text-foreground/55">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <div className="glass-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-lg text-foreground">Recent Student Profile Visits</h3>
                <Link to="/corporate/top-learners" className="text-xs font-medium text-primary hover:underline">View all →</Link>
              </div>
              <div className="space-y-3">
                {sampleVisits.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => navigate(`/corporate/learner/${v.id}`)}
                    className="flex w-full items-center gap-4 rounded-2xl border border-border/60 bg-white/60 p-4 text-left transition-all hover:bg-white/90 hover:shadow-sm group"
                  >
                    <div className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.78_0.14_290)] to-[oklch(0.82_0.12_350)] font-semibold text-white">
                      {v.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-foreground group-hover:text-[oklch(0.5_0.18_270)] transition-colors">{v.name}</div>
                        {v.hasBuilderBadge && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.94_0.06_75)] px-2 py-0.5 text-[10px] font-semibold text-[oklch(0.5_0.15_75)]">
                            <CheckCircle2 className="size-2.5" /> Builder
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{v.role} · Level {v.level} · {v.xp.toLocaleString()} XP</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">{v.time} ago</span>
                      <ArrowUpRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {corp.plan ? (
              <div className="tone-blue rounded-2xl p-5">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground/70">
                  <ShieldCheck className="size-4" /> Active Plan
                </div>
                <div className="mt-2 font-display text-2xl text-foreground">{corp.plan}</div>
                <Link to="/corporate/plans" className="mt-2 inline-flex text-xs font-medium text-primary hover:underline">Manage plan →</Link>
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-[oklch(0.7_0.1_240)] bg-[oklch(0.96_0.03_240)] p-5">
                <div className="text-xs font-medium uppercase tracking-wider text-[oklch(0.55_0.18_270)]">No Plan Active</div>
                <div className="mt-1 text-sm text-foreground/70">Subscribe to start hiring from LearnIcon's leaderboard.</div>
                <Link to="/corporate/plans" className="mt-3 inline-flex items-center gap-1 rounded-lg bg-[oklch(0.6_0.18_240)] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90">
                  <Sparkles className="size-3" /> View Plans
                </Link>
              </div>
            )}

            <div className="glass-card p-5">
              <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Hiring Preferences</div>
              <div className="space-y-3">
                {[
                  { label: "Min XP Level", q: "What XP level do you seek?", key: "minXpLevel" },
                  { label: "Builder Badge", q: "Do you require Builder badge?", key: "wantBuilderBadge" },
                  { label: "Build Type", q: "What kind of builds? (web, app, etc.)", key: "buildType" },
                ].map((item) => (
                  <div key={item.key} className="rounded-xl border border-border/60 bg-white/60 p-3">
                    <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{item.label}</div>
                    <div className="mt-0.5 text-sm text-foreground/70">
                      {item.key === "wantBuilderBadge"
                        ? (corp.hiringCriteria.wantBuilderBadge ? "Yes" : "Not set")
                        : (corp.hiringCriteria[item.key as "minXpLevel" | "buildType"] || "Not set")}
                    </div>
                  </div>
                ))}
                <Link to="/corporate/profile" className="block text-center text-xs font-medium text-primary hover:underline">
                  Update preferences →
                </Link>
              </div>
            </div>

            <div className="glass-card p-5">
              <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Company Info</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-foreground/70">
                  <Building2 className="size-3.5 shrink-0 text-[oklch(0.55_0.18_270)]" />
                  <span>{corp.companyName}</span>
                </div>
                <div className="text-xs text-muted-foreground pl-5">{corp.industry}</div>
                <div className="text-xs text-muted-foreground pl-5 line-clamp-3">{corp.needs}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CorporateShell>
  );
}

export default CorporateDashboardPage;
