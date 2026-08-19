import { api } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import type { DashboardOverview } from "../types";

export const dashboardApi = {
  async getOverview(): Promise<DashboardOverview> {
    const response = await api.get<ApiResponse<DashboardOverview>>("/reports/overview");
    return response.data.data;
  },
};