import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth } from "@/lib/auth-store";
import { getJobs, type JobListing, type RoleType } from "@/lib/jobs-store";
import { Briefcase, MapPin, Clock, ShieldCheck, Building2, SlidersHorizontal } from "lucide-react";

const ALL_TYPES: RoleType[] = ["Full-time", "Part-time", "Contract", "Internship"];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

// Seeded demo jobs removed. Only real listings from corporate users via getJobs() show.


function JobCard({ job }: { job: JobListing }) {
  const [applied, setApplied] = useState(false);
  return (
    <div className="glass-card p-5 transition-shadow hover:shadow-[var(--shadow-glow)]">
      <div className="flex items-start gap-4">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[oklch(0.85_0.08_270)] to-[oklch(0.78_0.12_240)] text-[oklch(0.4_0.18_270)] shadow-sm">
          <Building2 className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-display text-lg text-foreground">{job.title}</div>
              <div className="text-xs font-medium text-muted-foreground">{job.companyName}</div>
            </div>
            <button
              onClick={() => setApplied(true)}
              disabled={applied}
              className={
                "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all " +
                (applied
                  ? "bg-[oklch(0.94_0.06_155)] text-[oklch(0.4_0.1_155)] cursor-default"
                  : "bg-primary text-primary-foreground shadow-[var(--shadow-glow)] hover:opacity-90")
              }
            >
              {applied ? "✓ Applied" : "Apply"}
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-[oklch(0.95_0.04_270)] px-2.5 py-0.5 text-[11px] font-semibold text-[oklch(0.48_0.18_270)]">{job.roleType}</span>
            {job.requiresBuilderBadge && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.94_0.06_155)] px-2.5 py-0.5 text-[11px] font-semibold text-[oklch(0.4_0.1_155)]">
                <ShieldCheck className="size-3" /> Builder Badge required
              </span>
            )}
            <span className="rounded-full bg-[oklch(0.95_0.04_75)] px-2.5 py-0.5 text-[11px] font-semibold text-[oklch(0.45_0.1_75)]">Lv {job.minXpLevel}+ XP</span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="size-3" />{job.location}</span>
            <span className="flex items-center gap-1"><Clock className="size-3" />{timeAgo(job.postedAt)}</span>
          </div>

          {job.description && (
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{job.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function OpportunitiesPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [filterBadge, setFilterBadge] = useState(false);
  const [filterType, setFilterType] = useState<RoleType | "All">("All");

  useEffect(() => {
    const a = getAuth();
    if (!a.type) { navigate("/login"); return; }
    if (a.type === "corporate") { navigate("/corporate"); return; }
    const live = getJobs();
    setJobs(live);
  }, []);

  const filtered = jobs.filter((j) => {
    if (filterBadge && !j.requiresBuilderBadge) return false;
    if (filterType !== "All" && j.roleType !== filterType) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-2xl animate-float-up">
      <div className="mb-6">
        <h1 className="font-display text-4xl text-foreground">Opportunities</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Companies on LearnIcon looking for verified AI builders like you.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <SlidersHorizontal className="size-3.5" /> Filter:
        </div>
        {(["All", ...ALL_TYPES] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t as RoleType | "All")}
            className={
              "rounded-full px-3 py-1 text-xs font-medium transition-colors " +
              (filterType === t
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-white/70 text-foreground/70 hover:bg-white")
            }
          >
            {t}
          </button>
        ))}
        <label className="ml-auto flex cursor-pointer items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium text-foreground/70 hover:bg-white">
          <input
            type="checkbox"
            checked={filterBadge}
            onChange={(e) => setFilterBadge(e.target.checked)}
            className="size-3.5 accent-[oklch(0.55_0.18_270)]"
          />
          Builder Badge only
        </label>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <Briefcase className="size-10 text-muted-foreground/40" />
          <div className="mt-3 text-sm font-medium text-foreground">No listings match your filters</div>
          <div className="mt-1 text-xs text-muted-foreground">Try adjusting the filters above</div>
        </div>
      ) : (
        <ul className="space-y-4">
          {filtered.map((job) => (
            <li key={job.id}><JobCard job={job} /></li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OpportunitiesPage;
