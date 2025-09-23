import api from "./api";

export interface Project {
  id: string;
  name: string;
  description?: string;
  organization_id: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  organization_id: string;
  active?: boolean;
}

export const projectService = {
  getAll: () => api.get<Project[]>("/project"),
  getActive: () => api.get<Project[]>("/project/active"),
  getById: (id: string) => api.get<Project>(`/project/${id}`),
  create: (data: CreateProjectRequest) => api.post<Project>("/project", data),
  update: (id: string, data: Partial<Project>) => api.put<Project>(`/project/${id}`, data),
  remove: (id: string) => api.delete(`/project/${id}`),
};