
import { PageHeader } from "@/components/PageHeader";

function About() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader kicker="About" title="Built for builders. Quietly." sub="LearnIcon is the AI learning companion we wished we had — calm, project-first, and connected to real opportunities." />
      <div className="glass-card space-y-4 p-6 text-sm leading-relaxed text-foreground/80">
        <p>Most learning apps reward time. We reward shipping. Every XP, every rank, every badge is tied to a real artifact you built.</p>
        <p>We work with hiring partners across AI startups and labs. Pro and Titan builders get a verified profile that goes straight to recruiters.</p>
        <p>And we believe software can be beautiful. Soft, warm, focused. No dark patterns, no streak guilt, no infinite scroll.</p>
      </div>
    </div>
  );
}

export default About;
