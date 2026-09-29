"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // `isLoading` stays true until the single boot-time /me call resolves.
  // Components read this to avoid a flash-redirect while auth is unknown.
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Called ONCE on app mount — empty dep array is intentional.
  // /me must NOT fire on every navigation; user lives in context memory after this.
  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await authApi.getCurrentUser();
        setUser(res.data?.user || null);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMe();
  }, []); // ← intentionally empty — runs once on mount only

  // Redirect unauthenticated users away from protected routes.
  // We wait until isLoading resolves so we don't redirect before the /me response.
  useEffect(() => {
    if (isLoading) return;
    const protected_ =
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/class") ||
      pathname.startsWith("/subject") ||
      pathname.startsWith("/profile");
    if (!user && protected_) {
      router.push("/login");
    }
  }, [isLoading, user, pathname, router]);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    setUser(res.data?.user);
    router.push("/dashboard");
    return res;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    setUser(res.data?.user);
    router.push("/dashboard");
    return res;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    router.push("/login");
  };

  // Expose `isLoading` (not the old `loading`) to match the backend handoff spec.
  // Also keep `loading` as an alias so existing consumers don't break.
  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoading, loading: isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
