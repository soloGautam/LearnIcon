
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ChevronDown } from "lucide-react";

const qs = [
  { q: "Is Explorer really free forever?", a: "Yes — 10 AI questions a day, basic editor, community leaderboard. No credit card." },
  { q: "How does placement work?", a: "Pro and Titan builders get a verified profile sent to our hiring partners every two weeks." },
  { q: "Can I cancel anytime?", a: "Yes. No questions, no friction. Your projects stay yours." },
  { q: "Which AI models do you use?", a: "A rotating mix of frontier and open models, picked for speed and accuracy. Titan gets a custom persona." },
  { q: "Do you sell my data?", a: "Never. We only share verified placement profiles, and only with your consent." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader kicker="FAQ" title="Quiet answers." sub="If we missed your question, write to hello@learnicon.app." />
      <div className="glass-card divide-y divide-border/60 overflow-hidden">
        {qs.map((it, i) => (
          <button key={i} onClick={() => setOpen(open === i ? null : i)} className="block w-full text-left">
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-sm font-medium text-foreground">{it.q}</span>
              <ChevronDown className={`size-4 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </div>
            {open === i && <div className="px-5 pb-4 text-sm text-muted-foreground">{it.a}</div>}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
