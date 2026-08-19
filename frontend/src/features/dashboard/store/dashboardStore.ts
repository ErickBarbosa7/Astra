import { create } from "zustand";
import { getApiErrorMessage } from "@/lib/api";
import { dashboardApi } from "../services/dashboard.api";
import type { DashboardOverview } from "../types";

interface DashboardState {
  overview: DashboardOverview | null;
  loading: boolean;
  error: string | null;
  fetchOverview: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  overview: null,
  loading: false,
  error: null,

  async fetchOverview() {
    set({ loading: true, error: null });
    try {
      const overview = await dashboardApi.getOverview();
      set({ overview, loading: false });
    } catch (error) {
      set({
        error: getApiErrorMessage(error, "No se pudo cargar el resumen del dashboard"),
        loading: false,
      });
    }
  },
}));