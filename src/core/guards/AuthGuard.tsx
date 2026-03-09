import { useAuthContext } from "@/features/auth/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { PUBLIC_ROUTES } from "../consts/publicRoutes.const";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isHydrating } = useAuthContext();
  const location = useLocation();

  if (isHydrating) return null;

  const isPublic = PUBLIC_ROUTES.includes(location.pathname);

  if (!isAuthenticated && !isPublic) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
