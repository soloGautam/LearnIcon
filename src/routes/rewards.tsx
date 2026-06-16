import { PageHeader } from "@/components/PageHeader";
import { useUser, computeLevel, XP } from "@/lib/store";
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

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader kicker="XP & Rewards" title="XP that actually means something." sub="No streak guilt. You earn for building — not for showing up." />

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

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {[
            { label: "AI Chat message", xp: `+${XP.AI_MESSAGE} XP`, limit: "per message" },
            { label: "Create a project", xp: `+${XP.PROJECT_CREATE} XP`, limit: "per project" },
            { label: "Code edit / save", xp: `+${XP.CODE_EDIT} XP`, limit: "once / 30s" },
            { label: "Complete project", xp: `+${XP.PROJECT_COMPLETE} XP`, limit: "ship it" },
            { label: "Daily streak", xp: "+streak", limit: "stay consistent" },
            { label: "Import files", xp: `+${XP.CODE_EDIT} XP`, limit: "per upload" },
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

      <div className="glass-card mt-4 p-6">
        <h3 className="mb-4 font-display text-lg text-foreground">Rank ladder</h3>
        <div className="flex flex-wrap gap-2">
          {RANK_LADDER.map((r) => {
            const reached = user.level >= r.minLevel;
            return (
              <div
                key={r.name}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
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
