import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { GuestRoute } from "@/features/auth/components/GuestRoute";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { useAuthStore } from "@/features/auth/store/authStore";
import { AccountsPage } from "./pages/AccountsPage";
import { AppLayout } from "./layouts/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { RegisterPage } from "./pages/RegisterPage";

export default function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        }
      />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/accounts" element={<AccountsPage />} />
        <Route
          path="/transactions"
          element={<PlaceholderPage title="Movimientos" description="Tus transacciones y categorías" />}
        />
        <Route
          path="/budgets"
          element={<PlaceholderPage title="Presupuestos" description="Controla gastos por categoría" />}
        />
        <Route
          path="/goals"
          element={<PlaceholderPage title="Metas" description="Objetivos de ahorro" />}
        />
        <Route
          path="/reports"
          element={<PlaceholderPage title="Reportes" description="Tendencias y analíticas" />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
