
import { PageHeader } from "@/components/PageHeader";
import { useUser } from "@/lib/store";
import { ALL_LEARNERS } from "@/lib/learners-data";
import { Trophy, CheckCircle2, Star } from "lucide-react";

const RANK_GRADIENT = [
  "from-[oklch(0.82_0.18_75)] to-[oklch(0.75_0.16_60)]",
  "from-[oklch(0.75_0.05_240)] to-[oklch(0.7_0.06_240)]",
  "from-[oklch(0.7_0.12_50)] to-[oklch(0.65_0.1_40)]",
];

function LeaderboardPage() {
  const [user] = useUser();

  const meEntry = {
    id: "me",
    rank: 0,
    name: user.name,
    role: "You",
    xp: user.xpTotal,
    level: user.level,
    hasBuilderBadge: user.level >= 10,
    plan: user.plan,
    skills: [],
    isMe: true,
  };

  const combined = [
    ...ALL_LEARNERS.map((l) => ({ ...l, isMe: false })),
    meEntry,
  ]
    .sort((a, b) => b.xp - a.xp)
    .map((l, i) => ({ ...l, rank: i + 1 }));

  const myRank = combined.find((l) => l.id === "me")?.rank ?? combined.length;

  return (
    <div className="mx-auto max-w-[900px]">
      <PageHeader
        kicker="Leaderboard"
        title="Top AI Builders."
        sub="Ranked by total XP earned. You earn your way up by building, not by showing up."
      />

      {/* My position callout */}
      <div className="mb-5 flex items-center gap-4 rounded-2xl border border-primary/20 bg-gradient-to-r from-[oklch(0.97_0.03_290)] to-[oklch(0.97_0.03_350)] px-5 py-4 shadow-sm">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.7_0.15_290)] to-[oklch(0.78_0.14_350)] font-bold text-white shadow-md">
          {myRank <= 3 ? <Trophy className="size-5" /> : `#${myRank}`}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground">You are ranked <span className="text-primary">#{myRank}</span> of {combined.length} learners</div>
          <div className="text-xs text-muted-foreground">{user.xpTotal.toLocaleString()} XP · Level {user.level} · {user.rank}</div>
        </div>
        {myRank > 1 && (
          <div className="shrink-0 text-right text-xs text-muted-foreground">
            <div className="font-medium text-foreground">{(combined[myRank - 2].xp - user.xpTotal).toLocaleString()} XP</div>
            <div>to #{myRank - 1}</div>
          </div>
        )}
      </div>

      <div className="glass-card overflow-hidden p-1">
        <div className="divide-y divide-border/60">
          {combined.map((l) => {
            const isMe = l.id === "me";
            return (
              <div
                key={l.id}
                className={`flex items-center gap-4 px-5 py-4 transition-colors ${
                  isMe
                    ? "bg-gradient-to-r from-[oklch(0.96_0.04_290)] to-[oklch(0.97_0.03_350)] ring-1 ring-inset ring-primary/20"
                    : "hover:bg-white/60"
                }`}
              >
                {/* Rank badge */}
                <div
                  className={`grid size-9 shrink-0 place-items-center rounded-full text-xs font-bold shadow-sm ${
                    l.rank <= 3
                      ? `bg-gradient-to-br ${RANK_GRADIENT[l.rank - 1]} text-white`
                      : isMe
                      ? "bg-gradient-to-br from-[oklch(0.7_0.15_290)] to-[oklch(0.78_0.14_350)] text-white"
                      : "bg-[oklch(0.92_0.02_290)] text-foreground/60"
                  }`}
                >
                  {l.rank <= 3 ? <Trophy className="size-4" /> : `#${l.rank}`}
                </div>

                {/* Avatar */}
                <div
                  className={`grid size-11 shrink-0 place-items-center rounded-full font-semibold text-white shadow-sm ${
                    isMe
                      ? "bg-gradient-to-br from-[oklch(0.78_0.14_75)] to-[oklch(0.7_0.15_300)]"
                      : "bg-gradient-to-br from-[oklch(0.78_0.14_290)] to-[oklch(0.82_0.12_350)]"
                  }`}
                >
                  {l.name[0]}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-medium ${isMe ? "text-primary" : "text-foreground"}`}>
                      {l.name} {isMe && <span className="text-xs font-normal text-muted-foreground">(you)</span>}
                    </span>
                    {l.hasBuilderBadge && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.94_0.06_75)] px-2 py-0.5 text-[10px] font-semibold text-[oklch(0.5_0.15_75)]">
                        <CheckCircle2 className="size-2.5" /> Builder
                      </span>
                    )}
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      l.plan === "Titan" ? "bg-[oklch(0.93_0.04_240)] text-[oklch(0.5_0.18_270)]" :
                      l.plan === "Pro"   ? "bg-[oklch(0.95_0.04_310)] text-primary" :
                                          "bg-[oklch(0.95_0.04_155)] text-[oklch(0.45_0.1_155)]"
                    }`}>
                      {l.plan}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">{l.role}</div>
                </div>

                {/* XP */}
                <div className="shrink-0 text-right">
                  <div className="font-display text-lg text-foreground">{l.xp.toLocaleString()}</div>
                  <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                    <Star className="size-3" /> Lv {l.level}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Earn XP by chatting, creating projects, and updating progress. Rankings update live.
      </p>
    </div>
  );
}

export default LeaderboardPage;
