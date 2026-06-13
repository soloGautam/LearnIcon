import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth, getAuth, setAuth } from "@/lib/auth-store";
import { CorporateShell } from "@/components/CorporateShell";
import { Trophy, CheckCircle2, Filter, Sparkles, ChevronRight } from "lucide-react";
import { ALL_LEARNERS, type Learner } from "@/lib/learners-data";
import { useState } from "react";

const RANK_COLORS = [
  "from-[oklch(0.82_0.18_75)] to-[oklch(0.75_0.16_60)]",
  "from-[oklch(0.75_0.05_240)] to-[oklch(0.7_0.06_240)]",
  "from-[oklch(0.7_0.12_50)] to-[oklch(0.65_0.1_40)]",
];

function LearnerRow({ l, onClick }: { l: Learner; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[oklch(0.96_0.03_240/0.6)] group"
    >
      <div className={`grid size-9 shrink-0 place-items-center rounded-full bg-gradient-to-br text-xs font-bold shadow-sm ${
        l.rank <= 3 ? `${RANK_COLORS[l.rank - 1]} text-white` : "from-[oklch(0.88_0.02_290)] to-[oklch(0.85_0.02_290)] text-foreground/70"
      }`}>
        {l.rank <= 3 ? <Trophy className="size-4" /> : `#${l.rank}`}
      </div>

      <div className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.78_0.14_290)] to-[oklch(0.82_0.12_350)] font-semibold text-white">
        {l.name[0]}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-foreground group-hover:text-[oklch(0.5_0.18_270)] transition-colors">{l.name}</span>
          {l.hasBuilderBadge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.94_0.06_75)] px-2 py-0.5 text-[10px] font-semibold text-[oklch(0.5_0.15_75)]">
              <CheckCircle2 className="size-2.5" /> Builder
            </span>
          )}
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
            l.plan === "Titan" ? "bg-[oklch(0.93_0.04_240)] text-[oklch(0.5_0.18_270)]" :
            l.plan === "Pro"   ? "bg-[oklch(0.95_0.04_310)] text-primary" :
                                 "bg-[oklch(0.95_0.04_155)] text-[oklch(0.45_0.1_155)]"
          }`}>{l.plan}</span>
        </div>
        <div className="text-xs text-muted-foreground">{l.role}</div>
        <div className="mt-1 flex flex-wrap gap-1">
          {l.skills.slice(0, 3).map((s) => (
            <span key={s} className="rounded-md border border-border/60 bg-white/80 px-1.5 py-0.5 text-[10px] text-foreground/60">{s}</span>
          ))}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="font-display text-lg text-foreground">{l.xp.toLocaleString()}</div>
        <div className="text-xs text-muted-foreground">XP · Lv {l.level}</div>
      </div>

      <ChevronRight className="size-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

function TopLearnersPage() {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [filterBadge, setFilterBadge] = useState(false);

  useEffect(() => {
    const a = getAuth();
    if (a.type !== "corporate") navigate("/login");
    else if (!a.corporate?.onboarded) navigate("/corporate/onboarding");
  }, []);

  if (auth.type !== "corporate" || !auth.corporate?.onboarded) return null;

  const plan = auth.corporate.plan;
  const visibleCount = plan === "Scale" ? ALL_LEARNERS.length : plan === "Growth" ? 5 : 3;
  const learners = (filterBadge ? ALL_LEARNERS.filter((l) => l.hasBuilderBadge) : ALL_LEARNERS).slice(0, visibleCount);

  function handleRowClick(l: Learner) {
    const a = getAuth();
    if (a.type !== "corporate" || !a.corporate) return;
    const existing = a.corporate.recentProfileVisits ?? [];
    const alreadyLogged = existing.some((v) => v.id === l.id);
    if (!alreadyLogged) {
      setAuth({
        corporate: {
          ...a.corporate,
          recentProfileVisits: [
            { id: l.id, name: l.name, role: l.role, xp: l.xp, level: l.level, hasBuilderBadge: l.hasBuilderBadge, time: "just now" },
            ...existing,
          ].slice(0, 20),
        },
      });
    }
    navigate(`/corporate/learner/${l.id}`);
  }

  return (
    <CorporateShell>
      <div className="mx-auto max-w-[1200px] animate-float-up space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-[oklch(0.55_0.18_270)]">Leaderboard</div>
            <h1 className="font-display text-4xl text-foreground">Top Learners</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Click any row to open their full profile with contact info.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterBadge(!filterBadge)}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all border ${
                filterBadge
                  ? "bg-[oklch(0.94_0.06_75)] border-[oklch(0.8_0.1_75)] text-[oklch(0.5_0.15_75)]"
                  : "bg-white/70 border-border text-foreground/70 hover:bg-white"
              }`}
            >
              <Filter className="size-3" /> Builder Badge only
            </button>
          </div>
        </div>

        <div className="glass-card overflow-hidden p-1">
          <div className="divide-y divide-border/60">
            {learners.map((l) => (
              <LearnerRow key={l.id} l={l} onClick={() => handleRowClick(l)} />
            ))}
          </div>
        </div>

        {!plan && (
          <div className="rounded-2xl border-2 border-dashed border-[oklch(0.7_0.1_240)] bg-[oklch(0.96_0.03_240)] p-6 text-center">
            <Sparkles className="mx-auto mb-2 size-6 text-[oklch(0.55_0.18_270)]" />
            <div className="font-display text-lg text-foreground">Unlock the full leaderboard</div>
            <div className="mt-1 text-sm text-muted-foreground">Subscribe to Growth or Scale to see more learners and access full contact info.</div>
            <a href="/corporate/plans" className="mt-3 inline-flex items-center gap-1 rounded-full bg-[oklch(0.6_0.18_240)] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
              View Plans →
            </a>
          </div>
        )}

        {plan && visibleCount < ALL_LEARNERS.length && (
          <div className="rounded-2xl border-2 border-dashed border-[oklch(0.7_0.1_240)] bg-[oklch(0.96_0.03_240)] p-5 text-center">
            <div className="text-sm text-muted-foreground">Upgrade to <strong>Scale</strong> to see all learners.</div>
            <a href="/corporate/plans" className="mt-2 inline-flex items-center gap-1 rounded-full bg-[oklch(0.6_0.18_240)] px-4 py-1.5 text-xs font-medium text-white hover:opacity-90">
              Upgrade Plan →
            </a>
          </div>
        )}
      </div>
    </CorporateShell>
  );
}

export default TopLearnersPage;
