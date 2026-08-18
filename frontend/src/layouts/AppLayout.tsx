import { Outlet, NavLink } from "react-router-dom";
import {
  ArrowLeftRight,
  BarChart3,
  LayoutDashboard,
  PiggyBank,
  Sparkles,
  Target,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/accounts", label: "Cuentas", icon: Wallet },
  { to: "/transactions", label: "Movimientos", icon: ArrowLeftRight },
  { to: "/budgets", label: "Presupuestos", icon: PiggyBank },
  { to: "/goals", label: "Metas", icon: Target },
  { to: "/reports", label: "Reportes", icon: BarChart3 },
];

export function AppLayout() {
  return (
    <div className="flex min-h-screen gap-6 p-6">
      <aside className="flex w-20 shrink-0 flex-col items-center gap-8 rounded-bento-lg bg-ink py-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent">
          <Sparkles className="h-6 w-6 text-foreground" />
        </div>
        <nav className="flex flex-col items-center gap-6">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              className={({ isActive }) =>
                cn(
                  "flex h-11 w-11 items-center justify-center rounded-2xl text-muted-foreground transition-colors hover:bg-white/10 hover:text-white",
                  isActive && "bg-accent text-foreground hover:bg-accent hover:text-foreground",
                )
              }
            >
              <Icon className="h-5 w-5" />
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
