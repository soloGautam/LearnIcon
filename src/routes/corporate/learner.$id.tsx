import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAuth, getAuth, setAuth } from "@/lib/auth-store";
import { CorporateShell } from "@/components/CorporateShell";
import { ALL_LEARNERS } from "@/lib/learners-data";
import {
  ArrowLeft, CheckCircle2, Star, Mail, Phone, Linkedin, Github,
  MapPin, Briefcase, Trophy, ExternalLink,
} from "lucide-react";

function LearnerProfilePage() {
  const { id } = useParams();
  const [auth] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const a = getAuth();
    if (a.type !== "corporate") { navigate("/login"); return; }
    if (!a.corporate?.onboarded) { navigate("/corporate/onboarding"); return; }
  }, []);

  const learner = ALL_LEARNERS.find((l) => l.id === id);

  useEffect(() => {
    if (!learner) return;
    const a = getAuth();
    if (a.type !== "corporate" || !a.corporate) return;

    const existing = a.corporate.recentProfileVisits ?? [];
    const alreadyLogged = existing.some((v) => v.id === learner.id);
    if (!alreadyLogged) {
      setAuth({
        corporate: {
          ...a.corporate,
          recentProfileVisits: [
            {
              id: learner.id,
              name: learner.name,
              role: learner.role,
              xp: learner.xp,
              level: learner.level,
              hasBuilderBadge: learner.hasBuilderBadge,
              time: "just now",
            },
            ...existing,
          ].slice(0, 20),
        },
      });
    }
  }, [learner]);

  if (auth.type !== "corporate" || !auth.corporate?.onboarded) return null;

  if (!learner) {
    return (
      <CorporateShell>
        <div className="mx-auto max-w-2xl text-center py-20">
          <div className="text-2xl font-display text-foreground">Learner not found</div>
          <button onClick={() => navigate("/corporate/top-learners")} className="mt-4 text-sm text-primary hover:underline">
            ← Back to leaderboard
          </button>
        </div>
      </CorporateShell>
    );
  }

  const hasPlan = !!auth.corporate.plan;
  const xpPct = Math.round((learner.xp % 1000) / 10);

  return (
    <CorporateShell>
      <div className="mx-auto max-w-[900px] animate-float-up space-y-5">
        {/* Back */}
        <button
          onClick={() => navigate("/corporate/top-learners")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to Top Learners
        </button>

        {/* Hero card */}
        <div className="glass-card relative overflow-hidden p-6 md:p-8">
          <div className="absolute -right-10 -top-10 size-64 rounded-full bg-[oklch(0.75_0.12_270)] opacity-15 blur-3xl" />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-start">
            <div className="grid size-20 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.78_0.14_290)] to-[oklch(0.82_0.12_350)] font-display text-3xl text-white shadow-lg">
              {learner.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl text-foreground">{learner.name}</h1>
                {learner.hasBuilderBadge && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.94_0.06_75)] px-2.5 py-1 text-xs font-semibold text-[oklch(0.5_0.15_75)]">
                    <CheckCircle2 className="size-3" /> Builder Badge
                  </span>
                )}
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  learner.plan === "Titan" ? "bg-[oklch(0.93_0.04_240)] text-[oklch(0.5_0.18_270)]" :
                  learner.plan === "Pro"   ? "bg-[oklch(0.95_0.04_310)] text-primary" :
                                            "bg-[oklch(0.95_0.04_155)] text-[oklch(0.45_0.1_155)]"
                }`}>{learner.plan}</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Briefcase className="size-3.5" /> {learner.role}</span>
                <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {learner.location}</span>
                <span className="flex items-center gap-1"><Trophy className="size-3.5" /> Rank #{learner.rank}</span>
              </div>
              <p className="mt-3 max-w-lg text-sm text-foreground/70">{learner.bio}</p>
            </div>
          </div>

          {/* XP bar */}
          <div className="mt-6 rounded-2xl border border-[oklch(0.7_0.1_240/0.2)] bg-[oklch(0.96_0.03_240/0.5)] p-4">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Level {learner.level} · {learner.xp.toLocaleString()} XP</span>
              <span className="font-semibold text-[oklch(0.55_0.18_270)]">{xpPct}% to Level {learner.level + 1}</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[oklch(0.88_0.04_240)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[oklch(0.6_0.18_240)] to-[oklch(0.55_0.18_270)]"
                style={{ width: `${xpPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_300px]">
          {/* Left */}
          <div className="space-y-5">
            {/* Skills */}
            <div className="glass-card p-5">
              <h3 className="mb-3 font-display text-lg text-foreground">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {learner.skills.map((s) => (
                  <span key={s} className="rounded-xl border border-[oklch(0.7_0.1_240/0.3)] bg-[oklch(0.96_0.03_240/0.6)] px-3 py-1.5 text-sm font-medium text-[oklch(0.45_0.18_270)]">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="glass-card p-5">
              <h3 className="mb-3 font-display text-lg text-foreground">Projects</h3>
              <div className="space-y-3">
                {learner.projects.map((p) => (
                  <div key={p.name} className="flex items-start gap-3 rounded-xl border border-border/60 bg-white/60 p-4">
                    <div className="mt-0.5 size-2 shrink-0 rounded-full bg-[oklch(0.6_0.18_240)]" />
                    <div>
                      <div className="text-sm font-semibold text-foreground">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Contact */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-[oklch(0.7_0.1_240/0.3)] bg-[oklch(0.96_0.03_240/0.5)] p-5">
              <h3 className="mb-4 font-display text-lg text-foreground">Contact</h3>

              {hasPlan ? (
                <div className="space-y-3">
                  <a
                    href={`mailto:${learner.email}`}
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-white/80 px-4 py-3 text-sm text-foreground transition-all hover:bg-white hover:shadow-sm"
                  >
                    <Mail className="size-4 shrink-0 text-[oklch(0.55_0.18_270)]" />
                    <span className="truncate">{learner.email}</span>
                    <ExternalLink className="ml-auto size-3 shrink-0 text-muted-foreground" />
                  </a>
                  <a
                    href={`tel:${learner.phone}`}
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-white/80 px-4 py-3 text-sm text-foreground transition-all hover:bg-white hover:shadow-sm"
                  >
                    <Phone className="size-4 shrink-0 text-[oklch(0.55_0.18_270)]" />
                    <span>{learner.phone}</span>
                    <ExternalLink className="ml-auto size-3 shrink-0 text-muted-foreground" />
                  </a>
                  <a
                    href={`https://${learner.linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-white/80 px-4 py-3 text-sm text-foreground transition-all hover:bg-white hover:shadow-sm"
                  >
                    <Linkedin className="size-4 shrink-0 text-[oklch(0.55_0.18_270)]" />
                    <span className="truncate">{learner.linkedin}</span>
                    <ExternalLink className="ml-auto size-3 shrink-0 text-muted-foreground" />
                  </a>
                  <a
                    href={`https://${learner.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border/60 bg-white/80 px-4 py-3 text-sm text-foreground transition-all hover:bg-white hover:shadow-sm"
                  >
                    <Github className="size-4 shrink-0 text-[oklch(0.55_0.18_270)]" />
                    <span className="truncate">{learner.github}</span>
                    <ExternalLink className="ml-auto size-3 shrink-0 text-muted-foreground" />
                  </a>

                  <a
                    href={`mailto:${learner.email}?subject=Opportunity via LearnIcon`}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[oklch(0.6_0.18_240)] to-[oklch(0.55_0.18_270)] py-3 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
                  >
                    <Mail className="size-4" /> Send opportunity email
                  </a>
                </div>
              ) : (
                <div className="space-y-3 text-center">
                  <div className="rounded-xl border border-dashed border-[oklch(0.7_0.1_240)] bg-white/50 p-4">
                    <div className="text-sm font-medium text-foreground">Contact info locked</div>
                    <div className="mt-1 text-xs text-muted-foreground">Subscribe to Pilot, Growth or Scale to see email, phone, and social links.</div>
                  </div>
                  <a
                    href="/corporate/plans"
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[oklch(0.6_0.18_240)] to-[oklch(0.55_0.18_270)] py-3 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
                  >
                    <Star className="size-4" /> Unlock contact access
                  </a>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border/60 bg-white/60 p-4 text-xs text-muted-foreground">
              <div className="font-medium text-foreground">Profile visit logged</div>
              <div className="mt-0.5">This profile visit has been saved to your dashboard under Recent Profile Visits.</div>
            </div>
          </div>
        </div>
      </div>
    </CorporateShell>
  );
}

export default LearnerProfilePage;
