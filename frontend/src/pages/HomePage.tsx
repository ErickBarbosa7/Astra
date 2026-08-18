import {
  ArrowLeftRight,
  ArrowRight,
  BarChart3,
  LogOut,
  PiggyBank,
  Plus,
  Sparkles,
  Tags,
  Target,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store/authStore";

const features = [
  {
    icon: Wallet,
    title: "Cuentas organizadas",
    description:
      "Crea cuentas de ahorro, corriente o tarjeta y mira tu balance de un vistazo. Todo en un solo lugar.",
    span: "md:col-span-7",
    theme: "ink",
  },
  {
    icon: Tags,
    title: "Categorías claras",
    description: "Clasifica cada gasto con categorías personalizadas para entender a dónde va tu dinero.",
    span: "md:col-span-5",
    theme: "accent",
  },
  {
    icon: ArrowLeftRight,
    title: "Transacciones simples",
    description: "Registra ingresos y gastos con un par de clics.",
    span: "md:col-span-4",
    theme: "card",
  },
  {
    icon: PiggyBank,
    title: "Presupuestos",
    description: "Fija límites por categoría y recibe alertas antes de pasarte.",
    span: "md:col-span-4",
    theme: "card",
  },
  {
    icon: Target,
    title: "Metas de ahorro",
    description: "Define objetivos y sigue tu progreso hasta lograrlos.",
    span: "md:col-span-4",
    theme: "card",
  },
  {
    icon: BarChart3,
    title: "Reportes e insights",
    description:
      "Gráficos y tendencias que te muestran la salud de tus finanzas: ingresos vs gastos, distribución por categoría y más.",
    span: "md:col-span-8",
    theme: "dark",
  },
];

const steps = [
  {
    step: "01",
    title: "Crea tu cuenta",
    description: "Regístrate en segundos. Tu información se encripta y queda aislada para ti.",
  },
  {
    step: "02",
    title: "Organiza tus finanzas",
    description: "Agrega tus cuentas, define categorías y un presupuesto mensual.",
  },
  {
    step: "03",
    title: "Analiza y decide",
    description: "Registra movimientos y observa tu balance, gastos y metas actualizarse al instante.",
  },
];

const recentTransactions = [
  { name: "Sueldo", category: "Ingresos", amount: "+S/ 2,800.00", type: "income" },
  { name: "Mercado", category: "Alimentos", amount: "-S/ 186.50", type: "expense" },
  { name: "Suscripción", category: "Ocio", amount: "-S/ 89.90", type: "expense" },
];

const chartBars = [62, 78, 45, 90, 55, 72, 40];

export function HomePage() {
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = status === "authenticated";

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-canvas/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink">
              <Sparkles className="h-5 w-5 text-accent" />
            </span>
            <span className="text-xl font-extrabold tracking-tight">Astra</span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-muted md:flex">
            <a href="#features" className="hover:text-foreground">Funciones</a>
            <a href="#how" className="hover:text-foreground">Cómo funciona</a>
            <a href="#preview" className="hover:text-foreground">Vista previa</a>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="hidden rounded-full bg-ink/5 px-4 py-2 text-sm font-semibold text-ink sm:block">
                  Hola, {user?.name}
                </span>
                <Link
                  to="/dashboard"
                  className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-accent transition-opacity hover:opacity-80"
                >
                  Mi dashboard
                </Link>
                <button
                  type="button"
                  onClick={() => void logout()}
                  title="Cerrar sesión"
                  className="rounded-full p-2.5 text-muted transition-colors hover:bg-ink/5 hover:text-foreground"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-ink/5">
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-accent transition-opacity hover:opacity-80"
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="rounded-bento-lg bg-ink p-10 text-white md:col-span-8 md:p-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-accent">
              <Sparkles className="h-4 w-4" /> Finanzas personales, hechas simples
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Toma el control de tu dinero con{" "}
              <span className="text-accent">Astra</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-on-dark">
              Cuentas, presupuestos, metas y reportes en un dashboard limpio y moderno.
              Sin hojas de cálculo, sin complicaciones.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 font-bold text-foreground transition-opacity hover:opacity-90"
              >
                Empieza gratis <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#preview"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 font-semibold transition-colors hover:bg-white/10"
              >
                Ver el dashboard
              </a>
            </div>
          </div>

          <div className="grid gap-6 md:col-span-4">
            <div className="rounded-bento bg-accent p-6">
              <div className="flex items-center justify-between">
                <p className="font-bold text-foreground">Balance del mes</p>
                <Plus className="h-5 w-5" />
              </div>
              <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-ink/10">
                <div className="w-3/4 rounded-full bg-ink" />
              </div>
              <p className="mt-4 text-3xl font-extrabold">S/ 4,850.60</p>
              <p className="mt-1 text-sm font-medium text-foreground/70">+12% vs. mes pasado</p>
            </div>
            <div className="rounded-bento bg-card p-6">
              <p className="text-sm font-medium text-muted">Meta de ahorro</p>
              <p className="mt-2 text-2xl font-extrabold">Viaje a Cusco</p>
              <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-canvas">
                <div className="w-2/3 rounded-full bg-accent" />
              </div>
              <p className="mt-2 text-sm text-muted">S/ 1,200 de S/ 1,800 · 67%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Todo tu dinero, un solo dashboard
          </h2>
          <p className="mt-3 text-muted">
            Herramientas pensadas para entender tu situación financiera sin esfuerzo.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-12">
          {features.map(({ icon: Icon, title, description, span, theme }) => {
            const themeClass =
              theme === "ink"
                ? "bg-ink text-white"
                : theme === "accent"
                  ? "bg-accent"
                  : theme === "dark"
                    ? "bg-ink-800 text-white"
                    : "bg-card";
            const subtitle =
              theme === "ink" ? "text-on-dark" : theme === "dark" ? "text-on-dark" : "text-muted";

            return (
              <div key={title} className={`${span} rounded-bento ${themeClass} p-8`}>
                <div className="flex items-center justify-between">
                  <Icon className="h-7 w-7" />
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wide opacity-80">
                    Astra
                  </span>
                </div>
                <h3 className="mt-8 text-2xl font-extrabold">{title}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${subtitle}`}>{description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cómo funciona */}
      <section id="how" className="mx-auto max-w-6xl px-6 pt-20">
        <div className="rounded-bento-lg bg-card p-8 md:p-12">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">Cómo funciona</h2>
          <p className="mt-2 text-muted">Del registro a las decisiones en tres pasos.</p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map(({ step, title, description }) => (
              <div key={step} className="rounded-bento bg-canvas p-7">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-lg font-extrabold">{step}</span>
                <h3 className="mt-6 text-xl font-extrabold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vista previa del dashboard */}
      <section id="preview" className="mx-auto max-w-6xl px-6 pt-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          <div className="flex flex-col justify-center md:col-span-5">
            <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Un dashboard que habla claro
            </h2>
            <p className="mt-4 text-muted">
              Mira tu balance, tus ingresos y gastos y tus últimos movimientos sin salir de la vista
              principal. Los datos se actualizan con cada transacción.
            </p>
            <Link
              to="/register"
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-bold text-accent transition-opacity hover:opacity-80"
            >
              Probar Astra <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-bento-lg bg-ink p-6 text-white md:col-span-7">
            <div className="flex items-center gap-3 border-b border-white/10 pb-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
                <Sparkles className="h-4 w-4 text-foreground" />
              </span>
              <span className="font-extrabold">Astra</span>
              <span className="ml-auto rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-accent">
                Dashboard
              </span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { label: "Balance", value: "S/ 4,850.60" },
                { label: "Ingresos", value: "S/ 3,100.00" },
                { label: "Gastos", value: "S/ 1,240.90" },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-2xl bg-white/5 p-4">
                  <p className="text-xs font-medium text-on-dark">{label}</p>
                  <p className="mt-1 text-lg font-extrabold">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Ingresos vs Gastos</p>
                <p className="text-xs text-on-dark">Últimos 7 meses</p>
              </div>
              <div className="mt-4 flex h-28 items-end gap-3">
                {chartBars.map((height, i) => (
                  <div key={i} className="flex-1 rounded-t-xl bg-gradient-to-t from-ink to-accent" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {recentTransactions.map(({ name, category, amount, type }) => (
                <div key={name} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${type === "income" ? "bg-accent" : "bg-white/30"}`} />
                    <div>
                      <p className="text-sm font-semibold">{name}</p>
                      <p className="text-xs text-on-dark">{category}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-bold ${type === "income" ? "text-accent" : "text-white"}`}>{amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-6 pt-24">
        <div className="rounded-bento-lg bg-accent p-10 text-center md:p-16">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            Empieza a cuidar tu dinero hoy
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-medium text-foreground/80">
            Gratis, sin tarjeta de crédito. Registra tus finanzas y descubre de verdad cómo te gastas
            el dinero.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-lg font-bold text-accent transition-opacity hover:opacity-80"
          >
            Crear mi cuenta gratis <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-ink/10 pt-8 md:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Sparkles className="h-4 w-4" /> Astra — finanzas personales
          </div>
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Astra. Hecho con cuidado.
          </p>
        </div>
      </footer>
    </div>
  );
}