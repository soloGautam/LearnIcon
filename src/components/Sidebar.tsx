import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  Code2,
  Sparkles,
  Trophy,
  Info,
  HelpCircle,
  FolderKanban,
  BarChart2,
} from "lucide-react";
import type { ReactNode } from "react";

type Item = { to: string; icon: ReactNode; label: string };

const items: Item[] = [
  { to: "/", icon: <LayoutDashboard className="size-5" />, label: "Dashboard" },
  { to: "/chat", icon: <MessageSquare className="size-5" />, label: "AI Chat" },
  { to: "/studio", icon: <Code2 className="size-5" />, label: "Code Studio" },
  { to: "/projects", icon: <FolderKanban className="size-5" />, label: "Projects" },
  { to: "/rewards", icon: <Trophy className="size-5" />, label: "XP & Rewards" },
  { to: "/leaderboard", icon: <BarChart2 className="size-5" />, label: "Leaderboard" },
  { to: "/plans", icon: <Sparkles className="size-5" />, label: "Plans" },
  { to: "/about", icon: <Info className="size-5" />, label: "About" },
  { to: "/faq", icon: <HelpCircle className="size-5" />, label: "FAQ" },
];

function NavBtn({ to, icon, label, active }: Item & { active: boolean }) {
  return (
    <Link
      to={to}
      className={
        "group relative grid place-items-center size-11 rounded-xl transition-all " +
        (active
          ? "bg-white text-primary shadow-[var(--shadow-soft)]"
          : "text-muted-foreground hover:bg-white/70 hover:text-foreground")
      }
      aria-label={label}
    >
      {icon}
      <span className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100 z-50">
        {label}
      </span>
      {active && (
        <span className="absolute -left-1 top-1/2 h-6 -translate-y-1/2 w-1 rounded-r-full bg-primary" />
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = useLocation().pathname;
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-16 flex-col items-center justify-between border-r border-border/60 bg-[oklch(0.96_0.02_310/0.7)] py-5 backdrop-blur-xl md:flex">
      <div className="flex flex-col items-center gap-3">
        <div className="mb-2 grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.7_0.18_290)] to-[oklch(0.78_0.14_350)] text-white shadow-[var(--shadow-glow)]">
          <span className="font-display text-xl leading-none">L</span>
        </div>
        <nav className="flex flex-col items-center gap-1.5">
          {items.map((it) => (
            <NavBtn key={it.to} {...it} active={pathname === it.to} />
          ))}
        </nav>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Link
          to="/profile"
          aria-label="Profile"
          className="group relative grid size-10 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.78_0.14_75)] to-[oklch(0.7_0.15_300)] text-sm font-semibold text-white shadow-md transition-transform hover:scale-105"
        >
          G
          <span className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100 z-50">
            Profile
          </span>
        </Link>
      </div>
    </aside>
  );
}

export function MobileTabBar() {
  const pathname = useLocation().pathname;
  return (
    <nav className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2 md:hidden">
      <div className="glass-card flex items-center gap-1 px-2 py-2">
        {items.slice(0, 6).map((it) => {
          const active = pathname === it.to;
          return (
            <Link
              key={it.to}
              to={it.to}
              aria-label={it.label}
              className={
                "grid size-10 place-items-center rounded-xl transition-colors " +
                (active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-white/70")
              }
            >
              {it.icon}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
