"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await authApi.getCurrentUser();
        // user.controller.js returns { data: { user: userData } } inside ApiResponse
        setUser(res.data?.user || null);
      } catch (error) {
        setUser(null);
        // Redirect to login if on protected route (dashboard, class, etc.)
        if (
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/class") ||
          pathname.startsWith("/subject")
        ) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [pathname, router]);

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

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
