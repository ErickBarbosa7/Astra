import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "@/lib/api";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { AuthTextField } from "@/features/auth/components/AuthTextField";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas";
import { useAuthStore } from "@/features/auth/store/authStore";

export function RegisterPage() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.register);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      await registerUser(values);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setServerError(getApiErrorMessage(error, "No se pudo crear la cuenta"));
    }
  };

  return (
    <AuthLayout title="Crea tu cuenta" subtitle="Empieza a organizar tus finanzas en minutos">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4">
        {serverError && (
          <div className="rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger-strong">
            {serverError}
          </div>
        )}

        <AuthTextField
          label="Nombre"
          id="name"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />

        <AuthTextField
          label="Email"
          id="email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <AuthTextField
          label="Contraseña"
          id="password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <AuthTextField
          label="Confirmar contraseña"
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 flex w-full items-center justify-center rounded-full bg-accent py-3.5 text-sm font-bold text-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Crear cuenta
        </button>

        <p className="mt-6 text-center text-sm text-muted">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-semibold text-ink hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
