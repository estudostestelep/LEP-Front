import api from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Apenas para criação
  permissions: string[];
  active: boolean;
  created_at?: string;
  updated_at?: string;
  // Campos para compatibilidade com listagem (podem vir do backend)
  role?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  permissions: string[];
}

export const userService = {
  getAll: () => api.get<User[]>("/user"),
  getById: (id: string) => api.get<User>(`/user/${id}`),
  getByGroup: (groupId: string) => api.get<User[]>(`/user/group/${groupId}`),
  create: (data: CreateUserRequest) => api.post<User>("/user", data),
  update: (id: string, data: Partial<User>) => api.put<User>(`/user/${id}`, data),
  remove: (id: string) => api.delete(`/user/${id}`),
};
