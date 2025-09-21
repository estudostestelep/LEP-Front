import api from "./api";

export interface User {
  id: string;
  organization_id: string;
  project_id: string;
  name: string;
  email: string;
  password?: string; // Apenas para criação
  role: string;
  permissions: string[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserRequest {
  organization_id: string;
  project_id: string;
  name: string;
  email: string;
  password: string;
  role: string;
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
