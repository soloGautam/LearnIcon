export function PageHeader({ kicker, title, sub }: { kicker?: string; title: string; sub?: string }) {
  return (
    <div className="mb-8 animate-float-up">
      {kicker && <div className="text-xs font-medium uppercase tracking-wider text-primary">{kicker}</div>}
      <h1 className="mt-1 font-display text-4xl md:text-5xl text-foreground">{title}</h1>
      {sub && <p className="mt-3 max-w-2xl text-sm text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function PagePlaceholder({ children }: { children: React.ReactNode }) {
  return <div className="glass-card p-8 text-sm text-muted-foreground">{children}</div>;
}