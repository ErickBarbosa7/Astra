import { NavLink, Outlet } from "react-router-dom";
import {
  ArrowLeftRight,
  BarChart3,
  LayoutDashboard,
  PanelLeftClose,
  PanelLeftOpen,
  PiggyBank,
  Sparkles,
  Target,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/lib/useLocalStorage";

const SIDEBAR_KEY = "astra:sidebar-collapsed";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/accounts", label: "Cuentas", icon: Wallet },
  { to: "/transactions", label: "Movimientos", icon: ArrowLeftRight },
  { to: "/budgets", label: "Presupuestos", icon: PiggyBank },
  { to: "/goals", label: "Metas", icon: Target },
  { to: "/reports", label: "Reportes", icon: BarChart3 },
];

export function AppLayout() {
  const [collapsed, setCollapsed] = useLocalStorage(SIDEBAR_KEY, false);

  return (
    <div className="flex min-h-screen gap-6 p-6">
      <aside
        className={cn(
          "flex shrink-0 flex-col gap-8 rounded-bento-lg bg-ink py-8 transition-[width] duration-300 ease-in-out",
          collapsed ? "w-20 items-center" : "w-60 px-4",
        )}
      >
        <div
          className={cn(
            "flex w-full items-center gap-3",
            collapsed && "flex-col items-center gap-4",
          )}
        >
          <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent">
              <Sparkles className="h-6 w-6 text-foreground" />
            </div>
            {!collapsed && (
              <div className="min-w-0 whitespace-nowrap">
                <p className="text-lg font-extrabold tracking-tight text-white">Astra</p>
                <p className="text-xs text-on-dark">Finanzas personales</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCollapsed((current) => !current)}
            aria-label={collapsed ? "Expandir barra lateral" : "Colapsar barra lateral"}
            aria-expanded={!collapsed}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-muted-foreground transition-colors hover:bg-white/10 hover:text-white",
              !collapsed && "ml-auto",
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
        </div>

        <nav className={cn("flex flex-col gap-2", collapsed ? "items-center" : "w-full")}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              title={label}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-2xl text-muted-foreground transition-colors hover:bg-white/10 hover:text-white",
                  collapsed
                    ? "h-11 w-11 justify-center"
                    : "h-11 w-full gap-3 px-3",
                  isActive && "bg-accent text-foreground hover:bg-accent hover:text-foreground",
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && (
                <span className="text-sm font-semibold whitespace-nowrap">{label}</span>
              )}
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