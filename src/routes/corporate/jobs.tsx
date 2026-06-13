import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth, getAuth } from "@/lib/auth-store";
import { getJobs, saveJob, deleteJob, type JobListing, type RoleType } from "@/lib/jobs-store";
import { CorporateShell } from "@/components/CorporateShell";
import { Briefcase, Plus, Trash2, MapPin, Clock, ShieldCheck, X } from "lucide-react";

const ROLE_TYPES: RoleType[] = ["Full-time", "Part-time", "Contract", "Internship"];

const EMPTY_FORM = {
  title: "",
  roleType: "Full-time" as RoleType,
  location: "Remote",
  minXpLevel: 1,
  requiresBuilderBadge: false,
  description: "",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function CorporateJobsPage() {
  const [auth] = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const a = getAuth();
    if (a.type !== "corporate") { navigate("/login"); return; }
    if (!a.corporate?.onboarded) { navigate("/corporate/onboarding"); return; }
    refresh();
  }, []);

  function refresh() {
    const a = getAuth();
    if (!a.corporate?.email) return;
    setJobs(getJobs().filter((j) => j.companyEmail === a.corporate!.email));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const a = getAuth();
    if (!a.corporate) return;
    saveJob({
      ...form,
      companyName: a.corporate.companyName,
      companyEmail: a.corporate.email ?? a.corporate.companyName,
    });
    setForm(EMPTY_FORM);
    setShowForm(false);
    setSaving(false);
    refresh();
  }

  function handleDelete(id: string) {
    deleteJob(id);
    refresh();
  }

  if (auth.type !== "corporate" || !auth.corporate?.onboarded) return null;

  return (
    <CorporateShell>
      <div className="mx-auto max-w-3xl animate-float-up">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-foreground">Job Listings</h1>
            <p className="mt-1 text-sm text-muted-foreground">Post open roles — visible to matching LearnIcon learners.</p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.48_0.18_270)] px-4 py-2 text-sm font-medium text-white shadow-md hover:bg-[oklch(0.42_0.18_270)] transition-colors"
          >
            {showForm ? <X className="size-4" /> : <Plus className="size-4" />}
            {showForm ? "Cancel" : "Post a Job"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 rounded-2xl border border-[oklch(0.88_0.04_270)] bg-white/80 p-6 shadow-[var(--shadow-soft)] backdrop-blur space-y-4">
            <h2 className="font-display text-lg text-foreground">New listing</h2>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Job title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. ML Engineer, AI Product Manager"
                className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground outline-none focus:border-[oklch(0.6_0.18_270)] focus:ring-2 focus:ring-[oklch(0.7_0.18_270/0.2)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Role type</label>
                <select
                  value={form.roleType}
                  onChange={(e) => setForm((f) => ({ ...f, roleType: e.target.value as RoleType }))}
                  className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground outline-none focus:border-[oklch(0.6_0.18_270)]"
                >
                  {ROLE_TYPES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="Remote / Hybrid / City"
                  className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground outline-none focus:border-[oklch(0.6_0.18_270)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Min XP Level required</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={form.minXpLevel}
                  onChange={(e) => setForm((f) => ({ ...f, minXpLevel: Number(e.target.value) }))}
                  className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground outline-none focus:border-[oklch(0.6_0.18_270)]"
                />
              </div>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-white px-4 py-2.5">
                <input
                  type="checkbox"
                  checked={form.requiresBuilderBadge}
                  onChange={(e) => setForm((f) => ({ ...f, requiresBuilderBadge: e.target.checked }))}
                  className="size-4 accent-[oklch(0.55_0.18_270)]"
                />
                <span className="text-sm text-foreground">Requires Builder Badge</span>
              </label>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description *</label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="What will this person build? What makes your team special?"
                className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground outline-none focus:border-[oklch(0.6_0.18_270)] focus:ring-2 focus:ring-[oklch(0.7_0.18_270/0.2)] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-[oklch(0.48_0.18_270)] py-2.5 text-sm font-semibold text-white hover:bg-[oklch(0.42_0.18_270)] transition-colors disabled:opacity-60"
            >
              {saving ? "Posting…" : "Post listing"}
            </button>
          </form>
        )}

        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[oklch(0.82_0.06_270)] bg-white/50 py-16 text-center">
            <Briefcase className="size-10 text-[oklch(0.7_0.12_270)]" />
            <div className="mt-3 font-display text-lg text-foreground">No listings yet</div>
            <div className="mt-1 text-sm text-muted-foreground">Post your first role — learners will see it in their Opportunities feed.</div>
          </div>
        ) : (
          <ul className="space-y-3">
            {jobs.map((job) => (
              <li key={job.id} className="group rounded-2xl border border-[oklch(0.9_0.04_270)] bg-white/80 p-5 shadow-[var(--shadow-soft)] backdrop-blur transition-shadow hover:shadow-[var(--shadow-glow)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-lg text-foreground">{job.title}</span>
                      <span className="rounded-full bg-[oklch(0.94_0.05_270)] px-2.5 py-0.5 text-[11px] font-semibold text-[oklch(0.48_0.18_270)]">{job.roleType}</span>
                      {job.requiresBuilderBadge && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.94_0.06_155)] px-2.5 py-0.5 text-[11px] font-semibold text-[oklch(0.4_0.1_155)]">
                          <ShieldCheck className="size-3" /> Builder Badge
                        </span>
                      )}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="size-3" />{job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="size-3" />{timeAgo(job.postedAt)}</span>
                      <span>Min XP Lv {job.minXpLevel}</span>
                    </div>
                    {job.description && (
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{job.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="shrink-0 rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                    aria-label="Delete listing"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </CorporateShell>
  );
}

export default CorporateJobsPage;
