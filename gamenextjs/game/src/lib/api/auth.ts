import { apiFetch, setToken, clearToken } from "@/lib/api/client";
import { AuthResponse, AuthUser, LoginPayload, RegisterPayload } from "@/types/auth";

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setToken(data.token);
  return data;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setToken(data.token);
  return data;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch("/logout", { method: "POST", auth: true });
  } finally {
    clearToken(); // ينضف محليًا دائمًا، حتى لو فشل الطلب
  }
}


export async function getCurrentUser(): Promise<AuthUser> {
  const data = await apiFetch<{ user: AuthUser }>("/user", { auth: true });
  return data.user;
}
