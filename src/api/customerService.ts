import api from "./api";

export interface Customer {
  id?: string;
  organization_id?: string;
  project_id?: string;
  name: string;
  email?: string;
  phone: string;
  birth_date?: string; // ISO string format
  created_at?: string;
  updated_at?: string;
}

export interface CreateCustomerRequest {
  organization_id: string;
  project_id: string;
  name: string;
  email?: string;
  phone: string;
  birth_date?: string;
}

export const customerService = {
  getAll: () => api.get<Customer[]>("/customer"),
  getById: (id: string) => api.get<Customer>(`/customer/${id}`),
  create: (data: CreateCustomerRequest) => api.post<Customer>("/customer", data),
  update: (id: string, data: Partial<Customer>) => api.put<Customer>(`/customer/${id}`, data),
  remove: (id: string) => api.delete(`/customer/${id}`),
};