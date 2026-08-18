import { Loader2 } from "lucide-react";

export function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink">
      <Loader2 className="h-8 w-8 animate-spin text-accent" />
    </div>
  );
}
