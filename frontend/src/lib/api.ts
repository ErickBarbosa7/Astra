import axios, { AxiosError } from "axios";
import type { ApiResponse } from "./types";

interface AuthUser {
  id: string;
  email: string;
  name: string;
  currency: string;
}

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise: Promise<AuthResponse> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
    const url = original?.url ?? "";

    if (error.response?.status === 401 && !original?._retry && !url.includes("/auth/") && original) {
      original._retry = true;

      try {
        refreshPromise ??= api
          .post<ApiResponse<AuthResponse>>("/auth/refresh")
          .then((response) => {
            setAccessToken(response.data.data.accessToken);
            return response.data.data;
          });

        await refreshPromise;
        return api(original);
      } catch {
        setAccessToken(null);
      } finally {
        refreshPromise = null;
      }
    }

    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown, fallback = "Algo salió mal"): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiResponse<unknown> | undefined;
    if (data?.message) return data.message;
    if (error.code === "ERR_NETWORK") return "No se pudo conectar con el servidor";
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
