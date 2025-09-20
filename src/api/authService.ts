import api from "./api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
    orgId?: string;
    projectId?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  orgId: string;
  projectId: string;
}

export const authService = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>("/login", data),

  logout: () =>
    api.post("/logout"),

  checkToken: () =>
    api.post("/checkToken"),

  ping: () =>
    api.get("/ping"),

  health: () =>
    api.get("/health"),
};