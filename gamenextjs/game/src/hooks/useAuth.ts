"use client";

import { useEffect, useState } from "react";
import { getCurrentUser, logout as logoutRequest } from "@/lib/api/auth";
import { AuthUser } from "@/types/auth";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    if (!token) {
      setIsLoading(false);
      return;
    }

    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function logout() {
    await logoutRequest();
    setUser(null);
  }

  return { user, isAuthenticated: !!user, isLoading, logout };
}