import { useNavigate, Link } from "react-router-dom";
import { useUser } from "@/lib/store";
import { clearAuth } from "@/lib/auth-store";
import { Mail, Sparkles, LogOut, ShieldCheck, Clock, Phone, Linkedin, Github, User, CheckCircle2, Edit3 } from "lucide-react";
import { useState } from "react";

function ProfilePage() {
  const [user, update] = useUser();
  const navigate = useNavigate();

  const contact = user.contact ?? { email: "", phone: "", linkedin: "", github: "", bio: "" };
  const [editing, setEditing] = useState(!contact.email);
  const [form, setForm] = useState({
    email: contact.email || "",
    phone: contact.phone || "",
    linkedin: contact.linkedin || "",
    github: contact.github || "",
    bio: contact.bio || "",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    update({ contact: { ...form } });
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    try {
      clearAuth();
      localStorage.removeItem("learnico:user");
      sessionStorage.removeItem("learnico:intro:v3");
    } catch {}
    navigate("/login");
    if (typeof window !== "undefined") window.location.reload();
  };

  const planHistory = [
    { name: "Pro", when: "Current plan", active: true },
    { name: "Builder", when: "Mar 2026 – May 2026", active: false },
    { name: "Explorer", when: "Jan 2026 – Mar 2026", active: false },
  ];

  const profileComplete = !!(form.email && form.phone);

  return (
    <div className="mx-auto max-w-3xl animate-float-up space-y-6">
      {/* Hero */}
      <div className="glass-card relative overflow-hidden p-6 md:p-8">
        <div className="absolute -right-10 -top-10 size-64 rounded-full bg-[oklch(0.85_0.1_310)] opacity-40 blur-3xl" />
        <div className="relative flex items-center gap-5">
          <div className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.78_0.14_75)] to-[oklch(0.7_0.15_300)] font-display text-3xl text-white shadow-[var(--shadow-glow)]">
            {user.name[0]}
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-3xl text-foreground">{user.name}</h1>
            {form.email && (
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="size-4" />
                <span className="truncate">{form.email}</span>
              </div>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium text-foreground/75">{user.rank}</span>
              <span className="rounded-full border border-border bg-white/70 px-3 py-1 text-xs font-medium text-foreground/75">Level {user.level}</span>
              {profileComplete && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.94_0.06_155)] px-3 py-1 text-xs font-medium text-[oklch(0.4_0.1_155)]">
                  <CheckCircle2 className="size-3" /> Profile complete
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Public profile / contact info */}
      <div className="glass-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg text-foreground">Your public profile</h3>
            <p className="text-xs text-muted-foreground mt-0.5">This is what companies see when they view your profile on the leaderboard.</p>
          </div>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white/70 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-white"
            >
              <Edit3 className="size-3" /> Edit
            </button>
          )}
        </div>

        {!profileComplete && !editing && (
          <div className="mb-4 rounded-xl border border-dashed border-amber-300 bg-amber-50 px-4 py-3">
            <div className="text-sm font-medium text-amber-800">Complete your profile to be discoverable</div>
            <div className="text-xs text-amber-700 mt-0.5">Add your email and phone so companies can reach you directly.</div>
          </div>
        )}

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                rows={3}
                placeholder="Tell companies what you build and what you're looking for…"
                className="w-full resize-none rounded-xl border border-border bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-shadow focus:shadow-[var(--shadow-glow)]"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Mail className="size-3" /> Email
                </label>
                <input
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  type="email"
                  className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-shadow focus:shadow-[var(--shadow-glow)]"
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Phone className="size-3" /> Phone
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  type="tel"
                  className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-shadow focus:shadow-[var(--shadow-glow)]"
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Linkedin className="size-3" /> LinkedIn URL
                </label>
                <input
                  value={form.linkedin}
                  onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
                  placeholder="linkedin.com/in/yourname"
                  className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-shadow focus:shadow-[var(--shadow-glow)]"
                />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Github className="size-3" /> GitHub URL
                </label>
                <input
                  value={form.github}
                  onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))}
                  placeholder="github.com/yourname"
                  className="w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-shadow focus:shadow-[var(--shadow-glow)]"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[var(--shadow-glow)] transition-opacity hover:opacity-95"
              >
                <CheckCircle2 className="size-4" /> Save profile
              </button>
              {contact.email && (
                <button
                  onClick={() => setEditing(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {form.bio && (
              <div className="rounded-xl border border-border/60 bg-white/60 px-4 py-3">
                <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
                  <User className="size-3" /> Bio
                </div>
                <p className="text-sm text-foreground/80">{form.bio}</p>
              </div>
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { icon: <Mail className="size-3.5" />, label: "Email", value: form.email },
                { icon: <Phone className="size-3.5" />, label: "Phone", value: form.phone },
                { icon: <Linkedin className="size-3.5" />, label: "LinkedIn", value: form.linkedin },
                { icon: <Github className="size-3.5" />, label: "GitHub", value: form.github },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3 rounded-xl border border-border/60 bg-white/60 px-4 py-3">
                  <div className="text-muted-foreground">{row.icon}</div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{row.label}</div>
                    <div className="truncate text-sm text-foreground">{row.value || <span className="text-muted-foreground/50">Not set</span>}</div>
                  </div>
                </div>
              ))}
            </div>
            {saved && (
              <div className="rounded-xl bg-[oklch(0.94_0.06_155)] px-4 py-2 text-xs font-medium text-[oklch(0.4_0.1_155)]">
                ✓ Profile saved — companies can now see your contact info
              </div>
            )}
          </div>
        )}
      </div>

      {/* Plan + history */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="tone-purple rounded-2xl p-5 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-foreground/70">
            <ShieldCheck className="size-4" /> Selected Plan
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <span className="font-display text-3xl text-foreground">{user.plan}</span>
          </div>
          <div className="mt-1 text-xs text-foreground/60">Unlimited AI · Verified builder badge</div>
          <Link to="/plans" className="mt-3 inline-flex text-xs font-medium text-primary hover:underline">Manage plan →</Link>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Clock className="size-4" /> Recent Plans
          </div>
          <ul className="mt-3 space-y-2">
            {planHistory.map((p) => (
              <li key={p.name} className="flex items-center justify-between rounded-xl border border-border/60 bg-white/60 px-3 py-2">
                <div>
                  <div className="text-sm font-medium text-foreground">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.when}</div>
                </div>
                {p.active && (
                  <span className="rounded-full bg-[oklch(0.94_0.06_155)] px-2 py-0.5 text-[10px] font-semibold text-[oklch(0.4_0.1_155)]">Active</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sign out */}
      <div className="glass-card flex items-center justify-between p-5">
        <div>
          <div className="font-display text-lg text-foreground">Sign out</div>
          <div className="text-xs text-muted-foreground">You can sign back in anytime.</div>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.65_0.2_25)] px-4 py-2 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition-opacity hover:opacity-90"
        >
          <LogOut className="size-4" /> Log out
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
