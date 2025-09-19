import api from "./api";

export interface Project {
  id?: string;
  name: string;
  description?: string;
  organization_id: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const projectService = {
  getAll: () => api.get<Project[]>("/project"),
  getActive: () => api.get<Project[]>("/project/active"),
  getById: (id: string) => api.get<Project>(`/project/${id}`),
  create: (data: Project) => api.post<Project>("/project", data),
  update: (id: string, data: Project) => api.put<Project>(`/project/${id}`, data),
  remove: (id: string) => api.delete(`/project/${id}`),
};