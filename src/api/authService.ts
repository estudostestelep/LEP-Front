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
    organization_id: string;
    project_id: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  organization_id: string;
  project_id: string;
}

export const authService = {
  login: async (data: LoginRequest) => {
    console.log('AuthService - Tentando login com:', { email: data.email, baseURL: api.defaults.baseURL });
    try {
      const response = await api.post<LoginResponse>("/login", data);
      console.log('AuthService - Login bem-sucedido:', response.status);
      return response;
    } catch (error) {
      console.error('AuthService - Erro no login:', error);
      throw error;
    }
  },

  logout: () =>
    api.post("/logout"),

  checkToken: () =>
    api.post("/checkToken"),

  ping: () =>
    api.get("/ping"),

  health: () =>
    api.get("/health"),
};