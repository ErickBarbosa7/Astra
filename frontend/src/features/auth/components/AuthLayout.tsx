import { ArrowUpRight, Sparkles } from "lucide-react";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink p-4 md:p-6">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-bento-lg bg-card shadow-2xl md:min-h-[720px]">
        {/* Panel izquierdo: branding */}
        <div className="hidden w-1/2 flex-col justify-between bg-canvas p-12 md:flex">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink">
              <Sparkles className="h-5 w-5 text-accent" />
            </span>
            <span className="text-xl font-extrabold tracking-tight">Astra</span>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight">
              Tu dinero,<br />bajo control.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Cuentas, presupuestos y metas en un dashboard limpio. Sin hojas de cálculo, sin
              complicaciones.
            </p>

            <div className="mt-8 rounded-bento bg-accent p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">Balance del mes</p>
                <ArrowUpRight className="h-4 w-4" />
              </div>
              <p className="mt-2 text-3xl font-extrabold">S/ 4,850.60</p>
              <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-ink/10">
                <div className="w-3/4 rounded-full bg-ink" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-bento bg-card p-4 text-sm">
              <span className="font-semibold">Meta de ahorro</span>
              <span className="font-bold text-muted">67%</span>
            </div>
          </div>

          <p className="text-xs font-medium text-muted">Astra · Finanzas personales</p>
        </div>

        {/* Panel derecho: formulario */}
        <div className="flex w-full flex-col justify-center p-8 md:w-1/2 md:p-16">
          <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
