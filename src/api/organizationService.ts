import api from "./api";

export interface Organization {
  id: string;
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateOrganizationRequest {
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  active?: boolean;
}

export const organizationService = {
  getAll: () => api.get<Organization[]>("/organization"),
  getById: (id: string) => api.get<Organization>(`/organization/${id}`),
  create: (data: CreateOrganizationRequest) => api.post<Organization>("/organization", data),
  update: (id: string, data: Partial<Organization>) => api.put<Organization>(`/organization/${id}`, data),
  remove: (id: string) => api.delete(`/organization/${id}`),
};