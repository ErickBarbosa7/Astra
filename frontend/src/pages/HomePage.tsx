import { ArrowRight, LineChart, ShieldCheck, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Wallet,
    title: "Controla tus cuentas",
    description: "Organiza saldos, ingresos y gastos en un solo lugar.",
  },
  {
    icon: LineChart,
    title: "Analiza tu dinero",
    description: "Gráficos claros para entender a dónde va tu dinero.",
  },
  {
    icon: ShieldCheck,
    title: "Seguro por diseño",
    description: "Tus datos cifrados y aislados por usuario.",
  },
];

export function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        <section className="grid gap-6 md:grid-cols-3">
          <div className="col-span-2 rounded-bento bg-ink p-10 text-white">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1 text-sm font-semibold text-foreground">
              <Wallet className="h-4 w-4" /> Finanzas personales
            </span>
            <h1 className="mt-6 text-5xl font-extrabold tracking-tight">
              Toma el control de tu dinero con <span className="text-accent">Astra</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-zinc-400">
              Gestiona cuentas, categoriza gastos y visualiza tu balance con un diseño limpio
              y moderno.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-foreground transition-opacity hover:opacity-90"
              >
                Crear cuenta <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 font-semibold transition-colors hover:bg-white/10"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>

          <div className="grid gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-bento bg-card p-6">
                <Icon className="h-7 w-7 text-ink" />
                <h2 className="mt-4 text-lg font-bold">{title}</h2>
                <p className="mt-1 text-sm text-muted">{description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
