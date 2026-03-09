import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearStoredTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredTokens,
} from "@/core/services/client.service";
import { decodeJWT, isTokenExpired } from "../utils/decoder";

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

export type AuthTokens = {
  accessToken: string | null;
  refreshToken?: string | null;
};

export type AuthContextValue = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrating: boolean;
  login: (payload: {
    user: AuthUser;
    accessToken: string;
    refreshToken?: string;
  }) => void;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
  setTokens: (tokens: AuthTokens) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  useEffect(() => {
    const storedAccess = getStoredAccessToken();
    const storedRefresh = getStoredRefreshToken();

    if (storedAccess && !isTokenExpired(storedAccess)) {
      setAccessToken(storedAccess);
      const user = decodeJWT(storedAccess);

      if (user) {
        setUser({
          email: user?.email,
          id: user?.sub,
          name: user?.username,
        });
      }
    } else {
      clearStoredTokens();
    }

    if (storedRefresh) setRefreshToken(storedRefresh);

    setIsHydrating(false);
  }, []);

  const setTokens = useCallback((tokens: AuthTokens) => {
    if (tokens.accessToken) {
      setAccessToken(tokens.accessToken);
      setStoredTokens(tokens.accessToken, tokens.refreshToken ?? undefined);
    }
    if (tokens.refreshToken !== undefined) setRefreshToken(tokens.refreshToken);
  }, []);

  const login = useCallback(
    ({
      user: nextUser,
      accessToken: newAccess,
      refreshToken: newRefreshToken,
    }: {
      user: AuthUser;
      accessToken: string;
      refreshToken?: string;
    }) => {
      setUser(nextUser);
      setTokens({
        accessToken: newAccess,
        refreshToken: newRefreshToken ?? null,
      });
    },
    [setTokens],
  );

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    clearStoredTokens();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(accessToken),
      isHydrating,
      login,
      logout,
      setUser,
      setTokens,
    }),
    [user, accessToken, refreshToken, isHydrating, login, logout, setTokens],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx)
    throw new Error("useAuthContext deve ser usado dentro do AuthProvider");
  return ctx;
}
