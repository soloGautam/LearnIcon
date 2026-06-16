import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth-store";
import {
  LayoutDashboard,
  Trophy,
  Sparkles,
  User,
  Building2,
  LogOut,
  Briefcase,
} from "lucide-react";

type NavItem = { to: string; icon: ReactNode; label: string };

const items: NavItem[] = [
  { to: "/corporate", icon: <LayoutDashboard className="size-5" />, label: "Dashboard" },
  { to: "/corporate/top-learners", icon: <Trophy className="size-5" />, label: "Top Learners" },
  { to: "/corporate/jobs", icon: <Briefcase className="size-5" />, label: "Job Listings" },
  { to: "/corporate/plans", icon: <Sparkles className="size-5" />, label: "Plans" },
  { to: "/corporate/profile", icon: <User className="size-5" />, label: "Profile" },
];

function NavBtn({ to, icon, label, active }: NavItem & { active: boolean }) {
  return (
    <Link
      to={to}
      className={
        "group relative grid place-items-center size-11 rounded-xl transition-all " +
        (active
          ? "bg-white text-[oklch(0.55_0.18_270)] shadow-[var(--shadow-soft)]"
          : "text-white/60 hover:bg-white/20 hover:text-white")
      }
      aria-label={label}
    >
      {icon}
      <span className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100 z-50">
        {label}
      </span>
      {active && (
        <span className="absolute -left-1 top-1/2 h-6 -translate-y-1/2 w-1 rounded-r-full bg-white" />
      )}
    </Link>
  );
}

export function CorporateShell({ children }: { children: ReactNode }) {
  const pathname = useLocation().pathname;
  const [auth, , logout] = useAuth();
  const companyName = auth.corporate?.companyName ?? "Company";
  const initials = companyName.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen w-full">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-16 flex-col items-center justify-between bg-gradient-to-b from-[oklch(0.45_0.18_270)] to-[oklch(0.38_0.18_250)] py-5 md:flex shadow-[4px_0_24px_oklch(0.4_0.2_270/0.3)]">
        <div className="flex flex-col items-center gap-3">
          <div className="mb-2 grid size-10 place-items-center rounded-2xl bg-white/20 text-white shadow-md">
            <Building2 className="size-5" />
          </div>
          <nav className="flex flex-col items-center gap-1.5">
            {items.map((it) => (
              <NavBtn key={it.to} {...it} active={pathname === it.to} />
            ))}
          </nav>
        </div>
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={logout}
            aria-label="Log out"
            className="group relative grid size-10 place-items-center rounded-full bg-white/20 text-white transition-all hover:bg-white/30"
          >
            <LogOut className="size-4" />
            <span className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100 z-50">
              Log out
            </span>
          </button>
          <div className="grid size-10 place-items-center rounded-full bg-white/25 text-xs font-bold text-white shadow-md">
            {initials}
          </div>
        </div>
      </aside>

      <div className="md:pl-16">
        <header className="sticky top-0 z-30 border-b border-[oklch(0.6_0.18_240/0.15)] bg-[oklch(0.97_0.03_250/0.85)] px-6 py-3 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <Building2 className="size-4 text-[oklch(0.55_0.18_270)]" />
            <span className="font-display text-lg text-foreground">{companyName}</span>
            <span className="rounded-full bg-[oklch(0.93_0.04_240)] px-2 py-0.5 text-[10px] font-semibold text-[oklch(0.5_0.18_270)]">Corporate Portal</span>
          </div>
        </header>
        <main className="px-4 pb-24 pt-6 md:px-8 md:pt-8">{children}</main>
      </div>

      <nav className="fixed bottom-3 left-1/2 z-40 -translate-x-1/2 md:hidden">
        <div className="flex items-center gap-1 rounded-2xl bg-gradient-to-r from-[oklch(0.45_0.18_270)] to-[oklch(0.38_0.18_250)] px-2 py-2 shadow-lg">
          {items.map((it) => {
            const active = pathname === it.to;
            return (
              <Link
                key={it.to}
                to={it.to}
                aria-label={it.label}
                className={
                  "grid size-10 place-items-center rounded-xl transition-colors " +
                  (active ? "bg-white/25 text-white" : "text-white/50 hover:text-white")
                }
              >
                {it.icon}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
