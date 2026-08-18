import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="rounded-bento bg-card p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent">
              <Sparkles className="h-5 w-5 text-foreground" />
            </span>
            <h1 className="text-2xl font-extrabold">Astra</h1>
          </div>
          {children}
          <p className="mt-6 text-center text-sm text-muted">
            <Link to="/" className="hover:underline">
              Volver al inicio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
