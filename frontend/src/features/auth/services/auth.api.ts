import { api } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import type { LoginFormValues, RegisterFormValues } from "../schemas";
import type { AuthResponse, AuthUser } from "../types";

export const authApi = {
  async login(values: LoginFormValues): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/login", values);
    return response.data.data;
  },

  async register(values: RegisterFormValues): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/register", {
      name: values.name,
      email: values.email,
      password: values.password,
    });
    return response.data.data;
  },

  async refresh(): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>("/auth/refresh");
    return response.data.data;
  },

  async logout(): Promise<void> {
    await api.post<ApiResponse<null>>("/auth/logout");
  },

  async me(): Promise<AuthUser> {
    const response = await api.get<ApiResponse<{ user: AuthUser }>>("/auth/me");
    return response.data.data.user;
  },
};
