import { Navigate } from "react-router-dom";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { useAuthStore } from "../store/authStore";

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((state) => state.status);

  if (status === "idle" || status === "loading") {
    return <FullScreenLoader />;
  }

  if (status === "authenticated") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
