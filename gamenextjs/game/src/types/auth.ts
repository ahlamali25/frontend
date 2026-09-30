export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "passenger" | "office_admin" | "station_admin";
  office_id: number | null;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
  token: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}