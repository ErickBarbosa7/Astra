import { Link } from "react-router-dom";
import { AuthShell } from "./AuthShell";

export function RegisterPage() {
  return (
    <AuthShell>
      <h2 className="mt-6 text-xl font-bold">Crear cuenta</h2>
      <p className="mt-1 text-sm text-muted">
        El registro estará disponible en la Fase 3.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 block w-full rounded-full bg-ink py-3 text-center font-semibold text-white transition-opacity hover:opacity-90"
      >
        Ver dashboard de ejemplo
      </Link>
    </AuthShell>
  );
}
