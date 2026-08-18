import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const AuthTextField = forwardRef<HTMLInputElement, AuthTextFieldProps>(
  function AuthTextField({ label, error, id, type = "text", className, ...props }, ref) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const resolvedType = isPassword && showPassword ? "text" : type;

    return (
      <div className="mt-6">
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={resolvedType}
            aria-invalid={error ? true : undefined}
            placeholder=" "
            className={cn(
              "peer w-full border-0 border-b border-ink/10 bg-transparent pb-3 pt-7 text-base text-foreground outline-none transition-colors duration-150 ease-out",
              "placeholder:pointer-events-none placeholder:text-transparent",
              "focus:border-ink focus:caret-accent",
              "aria-invalid:border-danger",
              isPassword && "pr-12",
              className,
            )}
            {...props}
          />
          <label
            htmlFor={id}
            className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-base text-muted-foreground transition-all duration-150 ease-out peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-ink peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:font-semibold"
          >
            {label}
          </label>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -bottom-px h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-150 ease-out peer-focus:scale-x-100 peer-aria-invalid:scale-x-100 peer-aria-invalid:bg-danger"
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-ink/5 hover:text-ink"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
      </div>
    );
  },
);
