export interface AuthUser {
  id: string;
  email: string;
  name: string;
  currency: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";
