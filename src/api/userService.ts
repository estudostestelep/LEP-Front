import api from "./api";
import { UserOrganization, UserProject } from "@/types/auth";

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

export interface UserAccessResponse {
  organizations: UserOrganization[];
  projects: UserProject[];
}

export interface UpdateUserAccessRequest {
  organization_ids: string[];
  project_ids: string[];
}

export interface UpdateUserAccessResponse {
  message: string;
  organizations_added: number;
  organizations_removed: number;
  projects_added: number;
  projects_removed: number;
}

export const userService = {
  getAll: () => api.get<User[]>("/user"),
  getById: (id: string) => api.get<User>(`/user/${id}`),
  getByGroup: (groupId: string) => api.get<User[]>(`/user/group/${groupId}`),
  create: (data: CreateUserRequest) => api.post<User>("/user", data),
  update: (id: string, data: Partial<User>) => api.put<User>(`/user/${id}`, data),
  remove: (id: string) => api.delete(`/user/${id}`),

  // Gerenciamento de acessos a organizações e projetos
  getUserAccess: (userId: string) => api.get<UserAccessResponse>(`/user/${userId}/organizations-projects`),
  updateUserAccess: (userId: string, data: UpdateUserAccessRequest) =>
    api.post<UpdateUserAccessResponse>(`/user/${userId}/organizations-projects`, data),
};
