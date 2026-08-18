import { create } from "zustand";
import { setAccessToken } from "@/lib/api";
import type { LoginFormValues, RegisterFormValues } from "../schemas";
import { authApi } from "../services/auth.api";
import type { AuthStatus, AuthUser } from "../types";

interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
  initialize: () => Promise<void>;
  login: (values: LoginFormValues) => Promise<void>;
  register: (values: RegisterFormValues) => Promise<void>;
  logout: () => Promise<void>;
}

let initialized = false;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "idle",

  async initialize() {
    if (initialized) return;
    initialized = true;

    set({ status: "loading" });
    try {
      const response = await authApi.refresh();
      setAccessToken(response.accessToken);
      set({ user: response.user, status: "authenticated" });
    } catch {
      set({ user: null, status: "unauthenticated" });
    }
  },

  async login(values) {
    const response = await authApi.login(values);
    setAccessToken(response.accessToken);
    set({ user: response.user, status: "authenticated" });
  },

  async register(values) {
    const response = await authApi.register(values);
    setAccessToken(response.accessToken);
    set({ user: response.user, status: "authenticated" });
  },

  async logout() {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      set({ user: null, status: "unauthenticated" });
    }
  },
}));
