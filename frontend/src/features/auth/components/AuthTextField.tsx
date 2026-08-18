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
              "peer w-full border-none border-b-2 border-ink/10 bg-transparent pb-2 pt-6 text-sm outline-none transition-colors",
              "placeholder:pointer-events-none placeholder:text-transparent",
              "focus:border-ink",
              error && "border-danger focus:border-danger-strong",
              isPassword && "pr-10",
              className,
            )}
            {...props}
          />
          <label
            htmlFor={id}
            className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-sm text-muted-foreground transition-all duration-200 peer-focus:top-0 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:font-medium peer-focus:text-ink peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:font-medium"
          >
            {label}
          </label>
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-ink"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs font-medium text-danger">{error}</p>}
      </div>
    );
  },
);
