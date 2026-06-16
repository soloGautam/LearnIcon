import { Link } from "react-router-dom";
import { useUser, computeLevel } from "@/lib/store";
import {
  Sparkles, Flame, Trophy, MessageSquare, FolderOpen, Award,
  Building2, Bell, ShieldCheck, ArrowUpRight, Tag, Inbox, Briefcase,
} from "lucide-react";

function StatCard({ tone, icon, label, value, sub }: { tone: "blue" | "green" | "purple" | "amber" | "pink"; icon: React.ReactNode; label: string; value: string; sub?: string }) {
  const toneClass = { blue: "tone-blue", green: "tone-green", purple: "tone-purple", amber: "tone-amber", pink: "tone-pink" }[tone];
  return (
    <div className={`${toneClass} rounded-2xl p-5 shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="grid size-9 place-items-center rounded-xl bg-white/70 text-foreground/80">{icon}</div>
        <ArrowUpRight className="size-4 text-foreground/40" />
      </div>
      <div className="text-xs font-medium uppercase tracking-wider text-foreground/60">{label}</div>
      <div className="mt-1 font-display text-3xl text-foreground">{value}</div>
      {sub && <div className="mt-1 text-xs text-foreground/55">{sub}</div>}
    </div>
  );
}

function SectionCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg text-foreground">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function Dashboard() {
  const [user] = useUser();
  const { pct: xpPct } = computeLevel(user.xpTotal);

  const placements: { name: string; role: string; company: string; tone: string }[] = [];
  const updates: { title: string; body: string; tag: string }[] = [];
  const qualities = [
    { title: "Calm by design", body: "No streak guilt. No dopamine traps." },
    { title: "Project-first", body: "You ship — not just watch lessons." },
    { title: "Hire-ready", body: "Verified profile shared with partner companies." },
  ];

  return (
    <div className="mx-auto max-w-[1400px] animate-float-up">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        {/* MAIN */}
        <div className="space-y-6">
          {/* Welcome */}
          <div className="glass-card relative overflow-hidden p-6 md:p-8">
            <div className="absolute -right-10 -top-10 size-64 rounded-full bg-[oklch(0.85_0.1_310)] opacity-40 blur-3xl" />
            <div className="absolute -bottom-20 left-1/3 size-72 rounded-full bg-[oklch(0.9_0.09_80)] opacity-40 blur-3xl" />
            <div className="relative">
              <div className="text-sm text-muted-foreground">Welcome back</div>
              <h1 className="font-display text-4xl md:text-5xl text-foreground">Hi, {user.name}.</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium text-foreground/75">
                  Rank · <span className="font-semibold text-primary">{user.rank}</span>
                </span>
                <span className="rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium text-foreground/75">Level {user.level}</span>
                <span className="rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium text-foreground/75">Streak {user.streak} days 🔥</span>
              </div>
              <p className="mt-4 max-w-xl text-sm text-muted-foreground">
                You're 2 projects away from your next placement-ready badge. Keep going — calmly.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link to="/chat" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-95">
                  <Sparkles className="size-4" /> Open AI Chat
                </Link>
                <Link to="/projects" className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-medium text-foreground hover:bg-white">
                  View projects
                </Link>
              </div>
            </div>
          </div>

          {/* Stat grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            <StatCard tone="amber" icon={<Flame className="size-4" />} label="XP Today" value={`+${user.xpToday}`} sub="Best this week" />
            <StatCard tone="purple" icon={<Trophy className="size-4" />} label="Current Rank" value={user.rank.split(" ")[0]} sub={`#${42}`} />
            <StatCard tone="blue" icon={<MessageSquare className="size-4" />} label="AI Sessions" value={String(user.aiSessions)} sub="this month" />
            <StatCard tone="green" icon={<FolderOpen className="size-4" />} label="Files in Studio" value={String(user.filesInStudio)} sub="across 4 projects" />
            <StatCard tone="pink" icon={<Award className="size-4" />} label="XP Total" value={user.xpTotal.toLocaleString()} sub="all-time" />
          </div>

          {/* Three section cards */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <SectionCard title="Recent Top Placements">
              {placements.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/60 bg-white/40 px-4 py-6 text-center text-xs text-muted-foreground">
                  No placements yet. Ship a project to be featured here.
                </div>
              ) : (
                <ul className="space-y-3">
                  {placements.map((p) => (
                    <li key={p.name} className="flex items-center gap-3">
                      <div className={`grid size-9 place-items-center rounded-xl tone-${p.tone} text-foreground/80`}>
                        <Building2 className="size-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-sm font-medium text-foreground">{p.name}</div>
                        <div className="truncate text-xs text-muted-foreground">{p.role} · {p.company}</div>
                      </div>
                      <span className="rounded-full bg-[oklch(0.94_0.06_155)] px-2 py-0.5 text-[10px] font-semibold text-[oklch(0.4_0.1_155)]">Hired</span>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>

            <SectionCard title="New Updates" action={<Bell className="size-4 text-muted-foreground" />}>
              {updates.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border/60 bg-white/40 px-4 py-6 text-center text-xs text-muted-foreground">
                  No updates yet.
                </div>
              ) : (
                <ul className="space-y-3">
                  {updates.map((u) => (
                    <li key={u.title} className="rounded-xl border border-border/60 bg-white/50 p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-foreground">{u.title}</div>
                        <span className="rounded-full bg-[oklch(0.94_0.05_290)] px-2 py-0.5 text-[10px] font-semibold text-primary">{u.tag}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{u.body}</div>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>


            <SectionCard title="App Qualities">
              <ul className="space-y-3">
                {qualities.map((q) => (
                  <li key={q.title} className="flex gap-3">
                    <div className="mt-0.5 size-2 shrink-0 rounded-full bg-primary" />
                    <div>
                      <div className="text-sm font-medium text-foreground">{q.title}</div>
                      <div className="text-xs text-muted-foreground">{q.body}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-4">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Account</div>
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[oklch(0.78_0.14_350)] to-[oklch(0.7_0.15_300)] px-2.5 py-1 text-[10px] font-semibold text-white">
                <Sparkles className="size-3" /> {user.plan}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.78_0.14_75)] to-[oklch(0.7_0.15_300)] text-base font-semibold text-white">
                {user.name[0]}
              </div>
              <div className="min-w-0">
                <div className="truncate font-display text-lg text-foreground">{user.name}</div>
                <div className="truncate text-xs text-muted-foreground">{user.rank} · Lv {user.level}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>XP progress</span>
                <span>{user.xpTotal.toLocaleString()} / {(user.xpTotal + user.xpToNext).toLocaleString()}</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[oklch(0.92_0.03_290)]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[oklch(0.7_0.15_290)] via-[oklch(0.78_0.14_350)] to-[oklch(0.82_0.13_75)]"
                  style={{ width: `${xpPct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-5">
            <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Settings shortcuts</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {["Profile", "Notifications", "Privacy", "Appearance", "Billing", "Integrations"].map((s) => (
                <button key={s} className="rounded-xl border border-border/60 bg-white/60 px-3 py-2 text-left text-foreground/80 hover:bg-white">
                  {s}
                </button>
              ))}
            </div>
          </div>

          <Link
            to="/opportunities"
            className="glass-card flex items-center gap-3 p-5 transition-shadow hover:shadow-[var(--shadow-glow)]"
          >
            <div className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.85_0.08_270)] to-[oklch(0.78_0.12_240)] text-[oklch(0.4_0.18_270)]">
              <Briefcase className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display text-base text-foreground">Opportunities</div>
              <div className="text-xs text-muted-foreground">Jobs from partner companies</div>
            </div>
            <ArrowUpRight className="size-4 text-muted-foreground" />
          </Link>

          <div className="tone-purple rounded-2xl p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground/70">
              <ShieldCheck className="size-4" /> Equipped plan
            </div>
            <div className="mt-2 font-display text-2xl text-foreground">{user.plan} tier</div>
            <div className="text-xs text-foreground/60">Unlimited AI · Verified builder badge</div>
            <Link to="/plans" className="mt-3 inline-flex text-xs font-medium text-primary hover:underline">Manage plan →</Link>
          </div>

          <a href="#" className="block px-1 text-xs text-muted-foreground underline-offset-4 hover:underline">Privacy Policy</a>

          <div className="glass-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Inbox className="size-3.5" /> Inbox
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{user.inbox.length}</span>
            </div>
            {user.inbox.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/50 bg-white/40 px-3 py-5 text-center text-[11px] text-muted-foreground">
                No messages yet. Companies will reach out as you build.
              </div>
            ) : (
              <ul className="space-y-2">
                {user.inbox.map((m) => (
                  <li key={m.id} className="rounded-xl border border-border/50 bg-white/60 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                        {m.kind === "company" ? <Building2 className="size-3.5 text-[oklch(0.6_0.15_240)]" /> : <Tag className="size-3.5 text-[oklch(0.7_0.14_350)]" />}
                        {m.from}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{m.time}</span>
                    </div>
                    <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{m.subject}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;
