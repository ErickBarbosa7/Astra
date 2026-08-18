import { Lottie } from "lottie-react";
import { Sparkles } from "lucide-react";
import cubeAnimation from "@/assets/cube.json";

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
        {/* Panel izquierdo: branding con animación */}
        <div className="hidden w-1/2 flex-col justify-between bg-canvas p-12 md:flex">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink">
              <Sparkles className="h-5 w-5 text-accent" />
            </span>
            <span className="text-xl font-extrabold tracking-tight">Astra</span>
          </div>

          <div className="flex flex-1 items-center justify-center py-8">
            <div className="relative flex h-full max-h-[420px] w-full items-center justify-center">
              <div className="absolute inset-0 rounded-bento-lg bg-accent/40 blur-3xl" />
              <Lottie
                src={cubeAnimation}
                loop
                autoplay
                aria-hidden
                className="relative h-full w-full"
              />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold leading-tight tracking-tight">
              Tu dinero,<br />bajo control.
            </h2>
            <p className="mt-3 text-xs font-medium text-muted">
              Cuentas, presupuestos y metas en un dashboard limpio.
            </p>
          </div>
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