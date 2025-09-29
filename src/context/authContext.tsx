"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

type User = {
  _id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  authenticated: boolean;
  loggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (data: { name: string; email: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          console.log("Not signed in yet! Current user: ", user)
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const me = await fetch("/api/auth/me", { credentials: "include" });
        if (me.ok) {
          const data = await me.json();
          setUser(data.user);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const signup = async (data: { name: string; email: string; password: string }) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (res.ok) {
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      setUser(null);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const refreshUser = async () => {
    try {
      const refresh = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      if (refresh.ok) {
        const me = await fetch("/api/auth/me", { credentials: "include" });
        if (me.ok) {
          const data = await me.json();
          setUser(data.user);
          setLoggedIn(true);
          return;
        }
      }
      setUser(null);
      setLoggedIn(false);
    } catch (err) {
      console.error("refreshUser failed:", err);
      setUser(null);
      setLoggedIn(false);
    }
  };

  useEffect(() => {
    refreshUser(); 
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authenticated: !!user,
        login,
        signup,
        logout,
        loggedIn,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
