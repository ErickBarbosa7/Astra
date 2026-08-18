import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { RegisterPage } from "./pages/RegisterPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/accounts"
          element={<PlaceholderPage title="Cuentas" description="Gestiona tus cuentas financieras" />}
        />
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
