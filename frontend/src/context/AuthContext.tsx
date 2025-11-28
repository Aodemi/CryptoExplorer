import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

type User = { id: string; email: string; username: string; role: string; favorites?: string[] } | null;

type AuthContextType = {
  token: string | null;
  user: User;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User>(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    api.setToken(token);
  }, [token]);

  const value = useMemo<AuthContextType>(() => ({
    token,
    user,
    async login(email: string, password: string) {
      const res = await api.post("/auth/login", { email, password });
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
    },
    async register(email: string, username: string, password: string) {
      const res = await api.post("/auth/register", { email, username, password });
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
    },
    logout() {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
