export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
        <p className="text-muted">{description}</p>
      </header>
      <div className="rounded-bento bg-card p-6">
        <p className="text-sm text-muted">
          Este módulo se desarrollará en una fase posterior.
        </p>
      </div>
    </div>
  );
}
