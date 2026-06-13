
import { PageHeader } from "@/components/PageHeader";
import { useUser, computeLevel } from "@/lib/store";
import { Trophy, Flame, Star, Sparkles, Clock, Lock } from "lucide-react";

const RANK_LADDER = [
  { name: "AI Newcomer",       minLevel: 1,  tone: "blue" },
  { name: "Code Apprentice",   minLevel: 3,  tone: "green" },
  { name: "Builder",           minLevel: 6,  tone: "amber" },
  { name: "Stellar Builder",   minLevel: 10, tone: "purple" },
  { name: "AI Architect",      minLevel: 15, tone: "pink" },
  { name: "Elite AI Engineer", minLevel: 20, tone: "purple" },
];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function Rewards() {
  const [user] = useUser();
  const { pct } = computeLevel(user.xpTotal);

  const unlockedIds = new Set(user.achievements.map((a) => a.id));

  const ALL_ACHIEVEMENTS = [
    { id: "first_message", title: "First AI message", tone: "purple", emoji: "🧠", hint: "Send your first chat message" },
    { id: "deep_thinker", title: "10 AI sessions", tone: "blue", emoji: "💬", hint: "Have 10 AI chat sessions" },
    { id: "first_project", title: "Project creator", tone: "green", emoji: "🚀", hint: "Create your first project" },
    { id: "shipped_it", title: "Shipped a project", tone: "amber", emoji: "✅", hint: "Complete a project to 100%" },
    { id: "level_5", title: "Reached Level 5", tone: "pink", emoji: "⭐", hint: "Earn enough XP to hit Level 5" },
    { id: "level_10", title: "Reached Level 10", tone: "purple", emoji: "🏆", hint: "Earn enough XP to hit Level 10" },
    { id: "streak_3", title: "3-day streak", tone: "amber", emoji: "🔥", hint: "Be active 3 days in a row" },
    { id: "streak_7", title: "7-day streak", tone: "amber", emoji: "🔥", hint: "Be active 7 days in a row" },
    { id: "xp_5000", title: "5,000 XP earned", tone: "blue", emoji: "💫", hint: "Accumulate 5,000 total XP" },
  ];

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader kicker="XP & Rewards" title="XP that actually means something." sub="No streak guilt. You earn for shipping — not for showing up." />

      {/* Top stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="tone-amber rounded-2xl p-5">
          <Flame className="size-5 text-foreground/80" />
          <div className="mt-3 font-display text-3xl">+{user.xpToday.toLocaleString()}</div>
          <div className="text-xs text-foreground/60">XP today</div>
        </div>
        <div className="tone-purple rounded-2xl p-5">
          <Trophy className="size-5 text-foreground/80" />
          <div className="mt-3 font-display text-2xl">{user.rank}</div>
          <div className="text-xs text-foreground/60">Current rank</div>
        </div>
        <div className="tone-blue rounded-2xl p-5">
          <Star className="size-5 text-foreground/80" />
          <div className="mt-3 font-display text-3xl">Lv {user.level}</div>
          <div className="text-xs text-foreground/60">{user.xpToNext.toLocaleString()} XP to next</div>
        </div>
        <div className="tone-green rounded-2xl p-5">
          <Sparkles className="size-5 text-foreground/80" />
          <div className="mt-3 font-display text-3xl">{user.streak}</div>
          <div className="text-xs text-foreground/60">day streak 🔥</div>
        </div>
      </div>

      {/* Level progress bar */}
      <div className="glass-card mt-6 p-6">
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          <span>Level {user.level} progress</span>
          <span>{user.xpTotal.toLocaleString()} XP total · {user.xpToNext.toLocaleString()} to Level {user.level + 1}</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-[oklch(0.92_0.03_290)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[oklch(0.7_0.15_290)] via-[oklch(0.78_0.14_350)] to-[oklch(0.82_0.13_75)] transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-1 text-right text-[11px] text-muted-foreground">{pct}%</div>

        {/* XP Sources guide */}
        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {[
            { label: "AI Chat message", xp: "+15 XP", limit: "up to 5/day" },
            { label: "Create a project", xp: "+200 XP", limit: "per project" },
            { label: "Progress milestone", xp: "+50 XP", limit: "per 10% step" },
            { label: "Complete project", xp: "+500 XP", limit: "bonus" },
            { label: "Daily streak", xp: "+streak", limit: "stay consistent" },
            { label: "Achievements", xp: "bonus XP", limit: "hit milestones" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-border/50 bg-white/60 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-foreground">{s.label}</div>
                <span className="text-xs font-semibold text-primary">{s.xp}</span>
              </div>
              <div className="text-[10px] text-muted-foreground">{s.limit}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rank ladder */}
      <div className="glass-card mt-4 p-6">
        <h3 className="mb-4 font-display text-lg text-foreground">Rank ladder</h3>
        <div className="flex flex-wrap gap-2">
          {RANK_LADDER.map((r) => {
            const reached = user.level >= r.minLevel;
            return (
              <div
                key={r.name}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  reached ? `tone-${r.tone}` : "bg-white/40 text-muted-foreground opacity-50"
                }`}
              >
                {reached ? "✓" : <Lock className="size-3" />}
                {r.name}
                <span className="font-normal opacity-60">Lv {r.minLevel}+</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="glass-card mt-4 p-6">
        <h3 className="mb-4 font-display text-lg text-foreground">Achievements</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {ALL_ACHIEVEMENTS.map((a) => {
            const unlocked = unlockedIds.has(a.id);
            const data = user.achievements.find((u) => u.id === a.id);
            return (
              <div
                key={a.id}
                title={unlocked ? `Unlocked` : a.hint}
                className={`rounded-xl p-4 transition-all ${
                  unlocked ? `tone-${a.tone} shadow-[var(--shadow-soft)]` : "bg-white/30 opacity-40 grayscale"
                }`}
              >
                <div className="text-2xl">{unlocked ? a.emoji : "🔒"}</div>
                <div className="mt-2 text-xs font-semibold text-foreground">{a.title}</div>
                {unlocked && data?.unlockedAt && (
                  <div className="mt-0.5 text-[10px] text-foreground/50">{timeAgo(data.unlockedAt)}</div>
                )}
                {!unlocked && (
                  <div className="mt-0.5 text-[10px] text-foreground/50">{a.hint}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* XP History */}
      {user.xpHistory.length > 0 && (
        <div className="glass-card mt-4 p-6">
          <h3 className="mb-4 font-display text-lg text-foreground">Recent XP</h3>
          <ul className="space-y-2">
            {user.xpHistory.slice(0, 10).map((ev) => (
              <li key={ev.id} className="flex items-center justify-between rounded-xl border border-border/40 bg-white/60 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-[oklch(0.9_0.06_290)] to-[oklch(0.85_0.08_350)] text-xs font-bold text-primary">
                    +{ev.amount}
                  </div>
                  <div className="text-sm text-foreground">{ev.reason}</div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  {timeAgo(ev.at)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Rewards;
